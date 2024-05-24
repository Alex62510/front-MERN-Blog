import { Link, useNavigate } from 'react-router-dom';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import { Oauth } from '../components/Oauth';

type FormType = {
  email: string;
  password: string;
};
export const SignIn = () => {
  const [formData, setFormData] = useState<FormType>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { error, loading } = useSelector((state: RootState) => state.user);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill out all fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (e) {
      dispatch(signInFailure((e as Error).message));
    }
  };

  return (
    <div className={'min-h-screen mt-20'}>
      <div
        className={
          'flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'
        }
      >
        <div className={' flex flex-col flex-1 '}>
          <Link
            to={'/'}
            className={
              'hover:animate-pulse font-bold dark:text-white text-4xl hover:opacity-80 transition'
            }
          >
            <span
              className={
                'px-3 py-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 rounded-lg text-white '
              }
            >
              OrlovAlex's
            </span>
            Blog
          </Link>
          <p className={'text-sm mt-5'}>
            You can sign in with your email and password or with Google!
          </p>
        </div>
        <div className={'flex-1'}>
          <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
            <div>
              <Label value={'Your email'} />
              <TextInput
                className={'hover:shadow-lg'}
                type={'email'}
                placeholder={'Email'}
                id={'email'}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value={'Your password'} />
              <TextInput
                className={'hover:shadow-lg'}
                type={'password'}
                placeholder={'********'}
                id={'password'}
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone={'greenToBlue'} type={'submit'} disabled={loading}>
              {loading ? (
                <>
                  <Spinner size={'sm'} />
                  <span className={'pl-3'}>Loading...</span>
                </>
              ) : (
                'Sign in'
              )}
            </Button>
            <Oauth />
          </form>
          <div className={'flex gap-2 mt-5 text-sm'}>
            <span>Don't have an account?</span>
            <Link to={'/sign-up'} className={'text-blue-500 hover:underline'}>
              Sign Up
            </Link>
          </div>
          <div className={'text-blue-800 dark:text-teal-100 pt-7'}>
            For test in admin mode you can use:
            <div className={'pt-1'}>
              email:
              <span
                className={'text-green-500 dark:text-teal-500 animate-pulse transition'}
              >
                {' '}
                admin@gmail.com
              </span>
            </div>
            <div>
              password:
              <span
                className={' text-green-500 dark:text-teal-500 animate-pulse transition'}
              >
                {' '}
                admin
              </span>
            </div>
          </div>
          {error && (
            <Alert color={'failure'} className={'mt-5'}>
              {typeof error === 'string'
                ? error
                : typeof error === 'object' && error
                  ? error.message || 'Something went wrong'
                  : ''}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};
