import { Link, useNavigate } from 'react-router-dom';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Oauth } from '../components/Oauth';

type FormType = {
  username: string;
  email: string;
  password: string;
};
export const SignUp = () => {
  const [formData, setFormData] = useState<FormType>({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | boolean>(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setError('Please fill out all fields');
    }
    try {
      setError(false);
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
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
            You can sign up with your email and password or with Google!
          </p>
        </div>
        <div className={'flex-1'}>
          <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
            <div>
              <Label value={'Your username'} />
              <TextInput
                className={'hover:shadow-lg'}
                type={'text'}
                placeholder={'Username'}
                id={'username'}
                onChange={handleChange}
              />
            </div>
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
                placeholder={'Password'}
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
                'Sign up'
              )}
            </Button>
            <Oauth />
          </form>
          <div className={'flex gap-2 mt-5 text-sm'}>
            <span>Have an account?</span>
            <Link to={'/sign-in'} className={'text-blue-500 hover:underline'}>
              Sign In
            </Link>
          </div>
          {error && (
            <Alert color={'failure'} className={'mt-5'}>
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};
