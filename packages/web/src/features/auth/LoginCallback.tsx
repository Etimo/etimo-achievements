import { authCallback } from '@etimo-achievements/common';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../app/Router';
import { LocalStorage } from '../../common/enums/local-storage';
import useQuery from '../../common/hooks/use-query';

const LoginCallback = (): JSX.Element => {
  const navigate = useNavigate();
  const query = useQuery();

  const getCode = () => query.get('code') ?? '';

  const login = async (code: string) => {
    const response = await authCallback('google', code).wait();
    if (response.success) {
      // Fetch the redirect url from local storage
      const redirectUrl = localStorage.getItem(LocalStorage.RedirectUrl);
      if (redirectUrl) {
        navigate(redirectUrl);

        // Clear the redirect url since we don't need it anymore
        localStorage.removeItem(LocalStorage.RedirectUrl);
      } else {
        navigate(Routes.UserProfile);
      }
    } else {
      navigate(Routes.Home);
      toast.error('Could not login: ' + (await response.errorMessage));
    }
  };

  useEffect(() => {
    if (getCode()) {
      login(getCode());
    }
  }, [getCode()]);

  return <></>;
};

export default LoginCallback;
