import { PaginatedData } from '@etimo-achievements/common';
import { Response } from 'express';

export function createdResponse(res: Response, path: string, resource: { id: string }) {
  path = path.replace(/^\/?([a-z\-]*)\/?$/gi, '$1');
  res.status(201).location(`/${path}/${resource.id}`).send({ id: resource.id });
}

export function paginatedResponse<T>(
  res: Response,
  path: string,
  paginatedData: PaginatedData<T>,
  mapper: (resource: T) => any
) {
  const { itemsPerPage, currentPage, totalItems } = paginatedData.pagination;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  res.header('Content-Range', `items ${start}-${end}/${totalItems}`);

  // Construct links
  path = path.replace(/^\/?([a-z\-]*)\/?$/gi, '$1');
  const links: string[] = [];
  if (paginatedData.pagination.firstLink) links.push(`</${path}${paginatedData.pagination.firstLink}>; rel="first"`);
  if (paginatedData.pagination.nextLink) links.push(`</${path}${paginatedData.pagination.nextLink}>; rel="next"`);
  if (paginatedData.pagination.prevLink) links.push(`</${path}${paginatedData.pagination.prevLink}>; rel="prev"`);
  if (paginatedData.pagination.lastLink) links.push(`</${path}${paginatedData.pagination.lastLink}>; rel="last"`);
  res.header('Link', links.join(', '));

  const data = paginatedData.data.map(mapper);

  return okResponse(res, data);
}

export function okResponse(res: Response, data?: any) {
  res.status(200).send(data);
}

export function noContentResponse(res: Response) {
  res.status(204).send();
}

export function redirectResponse(res: Response, path: string) {
  res.redirect(301, path);
}

export function badRequestResponse(res: Response, message: string) {
  res.status(400).send(message);
}

export function notImplementedResponse(res: Response) {
  res.status(501).send();
}
