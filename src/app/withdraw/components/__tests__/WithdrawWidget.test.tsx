import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WithdrawWidget } from '../WithdrawWidget';
import { useWithdrawStore, WithdrawState, WithdrawActions } from '../../store';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/shared/ui', () => ({
  notify: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}));

jest.mock('../../store', () => {
  const originalModule = jest.requireActual('../../store');
  return {
    ...originalModule,
    useWithdrawStore: jest.fn(),
  };
});

describe('WithdrawWidget', () => {
  let storeState: WithdrawState & WithdrawActions;

  beforeEach(() => {
    storeState = {
      status: 'idle',
      error: null,
      isNetworkError: false,
      withdrawal: null,
      idempotencyKey: 'test-key',
      submit: jest.fn(),
      reset: jest.fn(),
      retry: jest.fn(),
    };
    (useWithdrawStore as unknown as jest.Mock).mockImplementation(() => storeState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Test 1: happy-path submit', async () => {
    const user = userEvent.setup();
    render(<WithdrawWidget />);

    const amountInput = screen.getByRole('spinbutton');
    const destInput = screen.getByRole('textbox');
    const confirmBox = screen.getByRole('checkbox');
    const submitBtn = screen.getByRole('button', { name: 'form.submit' });

    await user.type(amountInput, '100');
    await user.type(destInput, 'TRX123');
    await user.click(confirmBox);
    await user.click(submitBtn);

    expect(storeState.submit).toHaveBeenCalledWith({
      amount: 100,
      destination: 'TRX123',
      confirm: true,
    });

    storeState.status = 'success';
    storeState.withdrawal = {
      id: 'WD123',
      status: 'processing',
      amount: 100,
      destination: 'TRX123',
      createdAt: new Date().toISOString(),
    };
    (useWithdrawStore as unknown as jest.Mock).mockImplementation(() => storeState);

    render(<WithdrawWidget />);

    expect(screen.getByText('states.success.title')).toBeInTheDocument();
  });

  it('Test 2: API 409 error', async () => {
    const user = userEvent.setup();
    render(<WithdrawWidget />);

    const amountInput = screen.getByRole('spinbutton');
    const destInput = screen.getByRole('textbox');
    const confirmBox = screen.getByRole('checkbox');
    const submitBtn = screen.getByRole('button', { name: 'form.submit' });

    await user.type(amountInput, '100');
    await user.type(destInput, 'TRX123');
    await user.click(confirmBox);
    await user.click(submitBtn);

    storeState.status = 'error';
    storeState.error = 'Conflict Error 409';
    storeState.isNetworkError = false;
    (useWithdrawStore as unknown as jest.Mock).mockImplementation(() => storeState);

    render(<WithdrawWidget />);

    expect(screen.getByText('Conflict Error 409')).toBeInTheDocument();
  });

  it('Test 3: double-submit guard', async () => {
    storeState.status = 'loading';
    (useWithdrawStore as unknown as jest.Mock).mockImplementation(() => storeState);

    render(<WithdrawWidget />);

    expect(screen.getByText('states.loading')).toBeInTheDocument();
  });
});
