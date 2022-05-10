import { ApiResponse, authRefresh } from '.';
import Api, { ApiResult } from './api';

class AuthorizedApi {
  private api: Api;

  constructor(baseUrl?: string) {
    this.api = new Api(baseUrl);
  }

  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.call(() => this.api.get<T>(endpoint));
  }

  public post<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    return this.call(() => this.api.post<T>(endpoint, payload));
  }

  public put<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    return this.call(() => this.api.put<T>(endpoint, payload));
  }

  public delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.call(() => this.api.delete<T>(endpoint));
  }

  private async call<T>(callFn: () => ApiResult<T>): Promise<ApiResponse<T>> {
    const initialResult = await callFn().wait();
    if (initialResult.status === 401) {
      const authResult = await authRefresh().wait();
      if (authResult.status === 401) {
        return initialResult;
      }
      return await callFn().wait();
    }
    return initialResult;
  }
}

export default AuthorizedApi;
