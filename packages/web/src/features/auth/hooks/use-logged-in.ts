import { useAppSelector } from '../../../app/store';
import { authSelector } from '../auth-slice';

const useLoggedIn = () => {
  const { loginState, authenticated } = useAppSelector(authSelector);

  return loginState !== 'logged-out' && authenticated;
};

export default useLoggedIn;
