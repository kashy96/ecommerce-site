'use client';

import { syncAuthState } from '@/app/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const AuthSync = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(syncAuthState() as any);
  }, [dispatch]);

  return null;
};

export default AuthSync;