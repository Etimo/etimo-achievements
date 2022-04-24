import { useNavigate } from 'react-router';
import { removeQueryParam } from '../utils/query-helper';

function useRemoveQueryParam() {
  const navigate = useNavigate();

  return (param: string) => {
    navigate(removeQueryParam(window.location, param));
  };
}

export default useRemoveQueryParam;
