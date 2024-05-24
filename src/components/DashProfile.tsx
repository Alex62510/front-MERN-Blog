import React, {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { Alert, Button, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import 'react-circular-progressbar/dist/styles.css';
import { FormData } from '../types/types';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export const DashProfile = () => {
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageFileUrl, setImageFileUrl] = useState<null | string>(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState<boolean | string>(false);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserDataSuccess, setUpdateUserDataSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData | object>({});
  const [updateUserError, setUpdateUserError] = useState('');

  const { currentUser, loading, error } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const filePickerRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage(imageFile);
    }
  }, [imageFile]);

  const uploadImage = async (imageFile: File) => {
    setImageFileUploading(true);
    setImageError(false);
    setUpdateUserError('');
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(+progress.toFixed(0));
      },
      error => {
        setImageError('Could not upload image (File must be less 2MB)');
        console.log(error);
        setImagePercent(0);
        setImageFileUrl(null);
        setImageFile(undefined);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUrl(downloadURL);
          setImageFileUploading(false);
        });
      },
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateUserDataSuccess(false);
    setUpdateUserError('');
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateUserError('');
    setUpdateUserDataSuccess(false);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError('Please waite uploading...');
      return;
    }
    try {
      dispatch(updateUserStart());
      if (currentUser) {
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          setUpdateUserError(data.message);
          dispatch(updateUserFailure(data.message));
        } else {
          dispatch(updateUserSuccess(data));
          setUpdateUserDataSuccess(true);
          setFormData({});
        }
      }
    } catch (e) {
      dispatch(updateUserFailure((e as Error).message));
      setUpdateUserError((e as Error).message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      if (currentUser) {
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(deleteUserFailure(data.message));
        } else {
          dispatch(deleteUserSuccess(data));
        }
      }
    } catch (e) {
      dispatch(deleteUserFailure((e as Error).message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout/', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOut());
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  console.log(formData);
  return (
    <div className={'max-w-lg mx-auto p-3 w-full'}>
      <h1 className={'my-7 text-center font-semibold text-3xl dark:text-teal-100'}>
        Profile
      </h1>
      {currentUser && (
        <>
          <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
            <input
              type={'file'}
              ref={filePickerRef}
              hidden
              accept={'image/*'}
              onChange={handleImageChange}
            />
            <div
              onClick={() => filePickerRef.current?.click()}
              className={
                'relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
              }
            >
              {imagePercent !== 100 && imagePercent > 0 && (
                <CircularProgressbar
                  value={imagePercent || 0}
                  text={`${imagePercent}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    },
                    path: { stroke: `rgba(62,152,199,${imagePercent / 100})` },
                  }}
                />
              )}
              <img
                src={imageFileUrl || currentUser.profilePicture}
                alt="user"
                className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                  imagePercent && imagePercent < 100 && 'opacity-60'
                }`}
              />
            </div>
            {imageError && <Alert color={'failure'}>{imageError}</Alert>}
            <TextInput
              type={'text'}
              id={'username'}
              placeholder={'Username'}
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
            <TextInput
              type={'text'}
              id={'email'}
              placeholder={'Email'}
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
            <TextInput
              type={'password'}
              id={'password'}
              placeholder={'password'}
              onChange={handleChange}
            />
            <Button
              type={'submit'}
              gradientDuoTone={'greenToBlue'}
              className={''}
              outline
              disabled={imageFileUploading || loading}
            >
              {imageFileUploading || loading ? 'Loading...' : 'Update'}
            </Button>
            {currentUser.isAdmin && (
              <Link to={'/create-post'}>
                <Button
                  type={'button'}
                  gradientDuoTone={'purpleToBlue'}
                  className={'w-full'}
                >
                  Create a post
                </Button>
              </Link>
            )}
          </form>
          <div className={'text-red-700 flex justify-between mt-5 mb-14'}>
            <span
              onClick={() => setShowModal(true)}
              className={'cursor-pointer hover:scale-105 transition hover:animate-pulse'}
            >
              Delete Account
            </span>
            <span
              onClick={handleSignout}
              className={'cursor-pointer hover:scale-105 transition hover:animate-pulse'}
            >
              Sign Out
            </span>
          </div>
          {updateUserDataSuccess && (
            <Alert
              color={'success'}
              className={'mt-5'}
              rounded
              onDismiss={() => setUpdateUserDataSuccess(false)}
            >
              Update success!
            </Alert>
          )}
          {updateUserError && (
            <Alert
              color={'failure'}
              className={'mt-5'}
              rounded
              onDismiss={() => setUpdateUserError('')}
            >
              {updateUserError}
            </Alert>
          )}
          {error && (
            <Alert
              color={'failure'}
              className={'mt-5'}
              rounded
              onDismiss={() => setUpdateUserError('')}
            >
              {error as ReactNode}
            </Alert>
          )}
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size={'md'}
            position={'center'}
          >
            <ModalHeader color={'caretColor'} />
            <ModalBody>
              <div className={'text-center'}>
                <HiOutlineExclamationCircle
                  className={
                    'h-16 w-16 text-lime-500 dark:text-gray-200  mt-4 mx-auto transition animate-bounce'
                  }
                />
                <h3 className={'mb-6 text-lg text-gray-600'}>
                  Are you sure you want to delete your account?
                </h3>
                <div className={'flex justify-center gap-10 '}>
                  <Button gradientDuoTone={'pinkToOrange'} onClick={handleDeleteUser}>
                    Yes I'm sure
                  </Button>
                  <Button
                    outline
                    gradientDuoTone={'tealToLime'}
                    onClick={() => setShowModal(false)}
                  >
                    No, cancel
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </>
      )}
    </div>
  );
};
