import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Outlet, Navigate } from 'react-router-dom';

export const OnlyAdminPrivateRoute = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to={'/sign-in'} />;
};
