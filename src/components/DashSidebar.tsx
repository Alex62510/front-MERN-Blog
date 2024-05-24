import React, { useEffect, useState } from 'react';
import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from '../redux/user/userSlice';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';

export const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
    <Sidebar className={'w-full md:w-56'}>
      <Sidebar.Items>
        <Sidebar.ItemGroup className={'flex flex-col gap-1 '}>
          {currentUser && currentUser.isAdmin && (
            <Link to={'/dashboard?tab=dash'}>
              <Sidebar.Item
                active={tab === 'dash'}
                className={'hover:bg-neutral-300 hover:shadow-lg hover:animate-pulse'}
                icon={HiChartPie}
                labelColor={'dark'}
                as={'div'}
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item
              className={'hover:bg-neutral-300 hover:shadow-lg hover:animate-pulse'}
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser && currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor={'dark'}
              as={'div'}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser && currentUser.isAdmin && (
            <Link to={'/dashboard?tab=posts'}>
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
                as={'div'}
                className={'hover:bg-neutral-300 hover:shadow-lg hover:animate-pulse'}
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <>
              <Link to={'/dashboard?tab=users'}>
                <Sidebar.Item
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                  as={'div'}
                  className={'hover:bg-neutral-300 hover:shadow-lg hover:animate-pulse'}
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to={'/dashboard?tab=comments'}>
                <Sidebar.Item
                  active={tab === 'comments'}
                  icon={HiAnnotation}
                  as={'div'}
                  className={'hover:bg-neutral-300 hover:shadow-lg hover:animate-pulse'}
                >
                  comments
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className={
              'cursor-pointer hover:bg-neutral-300 hover:shadow-lg hover:animate-pulse'
            }
            onClick={handleSignout}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
