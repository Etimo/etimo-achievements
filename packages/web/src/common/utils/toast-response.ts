import { ApiResponse } from '@etimo-achievements/common';
import toast from 'react-hot-toast';

export function toastResponse<T>(
  response: ApiResponse<T>,
  success: string,
  failure: string,
  onSuccess?: () => void,
  onFailure?: () => void
) {
  if (response.success) {
    if (onSuccess) onSuccess();
    return toast.success(success);
  }

  if (response.errorMessage) {
    response.errorMessage?.then((error) => {
      toast.error(failure + ': ' + error);
    });
  } else if (response.error) {
    toast.error(failure + ': ' + response.error);
  } else {
    toast.error(failure);
  }
  if (onFailure) onFailure();
}
