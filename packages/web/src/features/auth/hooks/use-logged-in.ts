import { useAppSelector } from '../../../app/store';
import { authSelector } from '../auth-slice';

const useLoggedIn = () => {
  const { authenticated } = useAppSelector(authSelector);

  return authenticated;
};

export default useLoggedIn;
