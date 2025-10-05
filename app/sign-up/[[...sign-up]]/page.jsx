import { SignUp } from '@clerk/nextjs';


export default function Page() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-black'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent'></div>
      <SignUp
        appearance={{
          baseTheme: "dark",
          variables: { colorPrimary: "rgb(59, 130, 246)" }
        }}
        afterSignUpUrl="/main"
        redirectUrl="/main"
      />
    </div>
  );
}

