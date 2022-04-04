import { Logger } from '@etimo-achievements/common';

type ApiResponse<T> = {
  success: boolean;
  body?: Promise<T>;
  data: () => Promise<T>;
  status: number;
  message: string;
  error?: string;
};

type ApiResult<T> = {
  wait: () => Promise<ApiResponse<T>>;
  abort: () => void;
};

class Api {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env.API_URL ?? 'http://localhost:3000';
  }

  public get<T>(endpoint: string): ApiResult<T> {
    return this.call<T>(endpoint, 'GET');
  }

  public post<T>(endpoint: string, payload: any): ApiResult<T> {
    return this.call<T>(endpoint, 'POST', payload);
  }

  public put<T>(endpoint: string, payload: any): ApiResult<T> {
    return this.call<T>(endpoint, 'PUT', payload);
  }

  private call<T>(endpoint: string, method: string, payload?: any): ApiResult<T> {
    const controller = new AbortController();
    const result = fetch(this.getUrl(endpoint), {
      method,
      body: payload ? JSON.stringify(payload) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal: controller.signal,
    });

    Logger.log(`API call: ${method} ${this.getUrl(endpoint)}`);

    return this.mapResult<T>(result, controller.abort);
  }

  private getUrl(endpoint: string): string {
    // Fix url in case endpoint or api url slashing is wrong
    if (!this.baseUrl.endsWith('/') && !endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }

    return this.baseUrl + endpoint;
  }

  private mapResult<T>(response: Promise<Response>, abort: () => void): ApiResult<T> {
    const responsePromise: Promise<ApiResponse<T>> = new Promise((resolve, reject) => {
      response
        .then((res) => {
          const statusCode = res.status;
          const message = res.statusText;
          let error: string | undefined;
          let bodyPromise: Promise<T> | undefined;
          let success: boolean = false;
          const headers = res.headers;
          const contentType = headers.get('content-type');
          const isJson = contentType && contentType.includes('application/json');
          if (statusCode >= 200 && statusCode < 300) {
            success = true;
            bodyPromise = new Promise((resolve, reject) => {
              if (isJson) {
                return res
                  .json()
                  .then((data) => resolve(data ? (data as T) : ({} as T)))
                  .catch(reject);
              }

              return {} as T;
            });
          } else {
            error = message;
          }

          resolve({
            success,
            body: bodyPromise,
            data: () => bodyPromise ?? Promise.reject(new Error('No body')),
            status: statusCode,
            message,
            error,
          });
        })
        .catch((err) => reject(err));
    });

    return {
      wait: async () => await responsePromise,
      abort,
    };
  }
}

export default Api;
