import { toBase64 } from '@etimo-achievements/common';
import { useLocation } from 'react-router';

const useLoginState = () => {
  const location = useLocation();

  return toBase64(JSON.stringify({ redirectUrl: location.pathname + location.search }));
};

export default useLoginState;
