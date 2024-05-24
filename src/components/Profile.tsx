import React from 'react';
import { Avatar, Dropdown } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { Link } from 'react-router-dom';
import { signOut } from '../redux/user/userSlice';

export const Profile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
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

  return (
    <>
      {currentUser && (
        <Dropdown
          label={<Avatar alt={'user'} img={currentUser.profilePicture} rounded />}
          arrowIcon={false}
          inline
        >
          <Dropdown.Header>
            <span className={' block text-sm mb-1'}>@{currentUser.username}</span>
            <span className={'block text-sm font-medium truncate'}>
              {currentUser.email}
            </span>
          </Dropdown.Header>
          <Link to={'/dashboard?tab=profile'}>
            <Dropdown.Item className={'hover:animate-pulse'}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className={'hover:animate-pulse'} onClick={handleSignout}>
              Sign out
            </Dropdown.Item>
          </Link>
        </Dropdown>
      )}
    </>
  );
};
