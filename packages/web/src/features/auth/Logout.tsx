import { authLogout } from '@etimo-achievements/common';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../app/Router';
import { useAppDispatch } from '../../app/store';
import { LocalStorage } from '../../common/enums/local-storage';
import { setLoggedOut } from './auth-slice';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    authLogout()
      .wait()
      .then(() => {
        /*
          The redirect url is set before the token is refreshed.
          When the token fails to refresh, this function is called,
          and the local storage is cleared. Because of this, we need
          to save the redirectUrl in a variable, clear local storage
          and then set the redirectUrl again in local storage, to allow
          the user to be redirected properly after getting his/her token.
        */
        const redirectUrl = localStorage.getItem(LocalStorage.RedirectUrl);
        localStorage.clear();
        if (redirectUrl) {
          localStorage.setItem(LocalStorage.RedirectUrl, redirectUrl);
        }

        dispatch(setLoggedOut());
        navigate(Routes.Home);
      });
  }, []);

  return null;
};

export default Logout;
