import { Metadata } from 'next';
import { WithdrawWidget } from './components';

export const metadata: Metadata = {
  title: 'Withdraw | USDT',
  description: 'Submit and track your USDT withdrawal requests',
};

export default function WithdrawPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8 antialiased selection:bg-primary selection:text-primary-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-primary/20 object-cover opacity-50 mix-blend-screen blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-blue-500/20 object-cover opacity-50 mix-blend-screen blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        <WithdrawWidget />
      </div>
    </main>
  );
}
