import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import router from 'next/router';
import { Google } from '@mui/icons-material';

const LogIn: NextPage = () => {
  const [number, setNumber] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [showNumberVerifyLayout, setShowNumberVerifyLayout] = useState(false);

  const [error, setError] = useState('');
  const [verificationCodeFromApi, setVerificationCodeFromApi] = useState('');
  const [verificationCodeFromUser, setVerificationCodeFromUser] = useState('');

  useEffect(() => {
    // if sessionstatus is authenticated, redirect to home page
    if (router.query.session_id) {
      router.push('/');
    }
  }, []);

  const handleSignInWithGoogle = () => {
    signIn('google', {
      callbackUrl: '/',
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-950">
      {error && <p className="mx-8  my-5 text-red-500">{error}</p>}

      <div className=" flex justify-center flex-col">
        <p className="text-lg text-violet-600 my-10 justify-center items-center"> Log in to MeghBuzz GPT</p>
        <button className="my-10 flex items-center space-x-2 rounded bg-red-500 p-4 text-lg text-white hover:bg-red-600" onClick={handleSignInWithGoogle}>
          <Google className="h-6 w-6 " />
          <span>Log in with Google</span>
        </button>
        {/* <button
              className="flex items-center space-x-2 rounded bg-blue-500 p-4 text-lg text-white hover:bg-blue-600"
              onClick={handleSignInWithFacebook}
              disabled={!isValidNumber}
            >
              <FaFacebook className="h-6 w-6" />
              <span>Log in with Facebook</span>
            </button> */}
      </div>
    </div>
  );
};
export default LogIn;
