import React, { FormEvent, useState } from 'react';
import { Alert, Button, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

type FormDataType = {
  image?: string;
  title: string;
  content: string;
  category: string;
};

export const CreatePost = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState('');
  const [publishError, setPublishError] = useState('');
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    content: '',
    category: '',
  });
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError('');
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const srorageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(srorageRef, file);
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(+progress.toFixed(0));
        },
        error => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(0);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            setImageUploadProgress(0);
            setImageUploadError('');
            setFormData({ ...formData, image: downloadURL });
          });
        },
      );
    } catch (e) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(0);
      console.log(e);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setImageUploadError('');
      navigate(`/post/${data.slug}`);
    } catch (e) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className={'p-3 max-w-3xl mx-auto min-h-screen'}>
      <h1 className={'text-center text-3xl my-7 font-semibold'}>Create a post</h1>
      <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
        <div className={'flex flex-col gap-4 sm:flex-row justify-between'}>
          <TextInput
            type={'text'}
            placeholder={'title'}
            required
            id={'title'}
            className={'flex-1'}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            onChange={e =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
          >
            <option value={'uncategorized'}>Select a category</option>
            <option value={'typescript'}>typeScript</option>
            <option value={'reactjs'}>React.js</option>
            <option value={'nodejs'}>Node.js</option>
          </Select>
        </div>
        <div
          className={
            'flex gap-4 items-center justify-between border-2 border-teal-500 border-dotted p-3'
          }
        >
          <input
            onChange={handleFileChange}
            type={'file'}
            accept={'image/*'}
            className={' rounded-lg border border-teal-500'}
          />
          <Button
            type={'button'}
            gradientDuoTone={'greenToBlue'}
            size={'sm'}
            outline
            onClick={handleUploadImage}
            disabled={!!imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className={'w-16 h-16'}>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color={'failure'}>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt={'upload'}
            className={'w-full h-72 object-cover'}
          />
        )}
        <ReactQuill
          onChange={value => setFormData({ ...formData, content: value })}
          theme={'snow'}
          placeholder={'Write something...'}
          className={`h-72 mb-12 dark:text-cyan-100 dark:placeholder:text-cyan-100 `}
        />
        <Button type={'submit'} gradientDuoTone={'purpleToBlue'}>
          Publish
        </Button>
        {publishError && (
          <Alert className={'mt-5'} color={'failure'}>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};
