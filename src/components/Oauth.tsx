import React from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';

export const Oauth = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          photo: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button
      type={'button'}
      outline
      gradientDuoTone={'pinkToOrange'}
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className={'w-6 h-6 mr-2'} />
      Continue with Google
    </Button>
  );
};
