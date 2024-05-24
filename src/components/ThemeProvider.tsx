import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

type PropsType = {
  children: ReactNode;
};
export const ThemeProvider = ({ children }: PropsType) => {
  const { theme } = useSelector((state: RootState) => state.theme);
  return (
    <div className={theme}>
      <div
        className={
          'bg-white text-gray-700 dark:tex-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'
        }
      >
        {children}
      </div>
    </div>
  );
};
