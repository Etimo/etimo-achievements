import { Logger, PaginationInfo } from '@etimo-achievements/common';

export type ApiResponse<T> = {
  success: boolean;
  body?: Promise<T>;
  data: () => Promise<T>;
  status: number;
  message: string;
  pagination?: PaginationInfo;
  error?: string;
  errorMessage?: Promise<string>;
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

  public delete<T>(endpoint: string): ApiResult<T> {
    return this.call<T>(endpoint, 'DELETE');
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
          let bodyPromise: Promise<T> | undefined;
          let success: boolean = false;
          let error: string | undefined;
          let errorMessage: Promise<string> | undefined;
          let pagination: PaginationInfo | undefined;
          const headers = res.headers;
          const contentType = headers.get('content-type');
          const isJson = contentType && contentType.includes('application/json');
          if (statusCode >= 200 && statusCode < 300) {
            success = true;
            bodyPromise = this.getBodyPromise<T>(res, isJson);
            pagination = this.getPagination(headers);
          } else {
            error = message;
            errorMessage = new Promise<string>((resolve) => {
              this.getBodyPromise<{ error: string }>(res, isJson)?.then((data) => {
                if (data?.error) {
                  resolve(data.error);
                } else {
                  resolve(message);
                }
              });
            });
          }

          resolve({
            success,
            body: bodyPromise,
            data: () => bodyPromise ?? Promise.reject(new Error('No body')),
            status: statusCode,
            message,
            error,
            errorMessage,
            pagination,
          });
        })
        .catch((err) => reject(err));
    });

    return {
      wait: async () => await responsePromise,
      abort,
    };
  }

  private getPagination(headers: Headers): PaginationInfo | undefined {
    let pagination: PaginationInfo | undefined;
    const contentRange = headers.get('Content-Range');
    if (contentRange) {
      const paginationInfo = contentRange.split(' ')[1].split('/');
      const countInfo = paginationInfo[0].split('-');
      const start = parseInt(countInfo[0]);
      const end = parseInt(countInfo[1]);
      const itemsPerPage = end - start;
      const totalItems = parseInt(paginationInfo[1]);
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const currentPage = Math.ceil(start / itemsPerPage + 1);

      // Get navigation links
      const linkHeader = headers.get('Link');
      let firstLink: string | undefined;
      let nextLink: string | undefined;
      let prevLink: string | undefined;
      let lastLink: string | undefined;
      if (linkHeader) {
        const links = linkHeader.split(',');
        for (const link of links) {
          const linkParts = link.split(';');
          const linkUrl = linkParts[0].replace(/<|>/g, '').trim();
          const linkRel = linkParts[1].replace('rel=', '').replace(/"/g, '').trim();
          if (linkRel == 'first') firstLink = linkUrl;
          if (linkRel == 'next') nextLink = linkUrl;
          if (linkRel == 'prev') prevLink = linkUrl;
          if (linkRel == 'last') lastLink = linkUrl;
        }
      }

      pagination = {
        items: itemsPerPage,
        itemsPerPage,
        totalPages,
        currentPage,
        totalItems,
        firstLink,
        nextLink,
        prevLink,
        lastLink,
      };
    }

    return pagination;
  }

  private getBodyPromise<T>(res: Response, isJson: string | boolean | null): Promise<T> | undefined {
    return new Promise((resolve, reject) => {
      if (isJson) {
        return res
          .json()
          .then((data) => resolve(data ? (data as T) : ({} as T)))
          .catch(reject);
      }

      return {} as T;
    });
  }
}

export default Api;
