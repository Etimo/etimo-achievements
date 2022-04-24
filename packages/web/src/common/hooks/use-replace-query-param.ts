import { useNavigate } from 'react-router';
import { replaceQueryParam } from '../utils/query-helper';

function useReplaceQueryParam() {
  const navigate = useNavigate();

  return (param: string, value: string) => {
    navigate(replaceQueryParam(window.location, param, value));
  };
}

export default useReplaceQueryParam;
