import { SignIn } from '@clerk/nextjs';
import { darkTheme } from '@/config/clerk-theme';

export default function Page() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-black'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent'></div>
      <SignIn
        appearance={{
          baseTheme: "dark",
          variables: { colorPrimary: "rgb(59, 130, 246)" }
        }}
        afterSignInUrl="/main"
        redirectUrl="/main"
      />
    </div>
  );
}