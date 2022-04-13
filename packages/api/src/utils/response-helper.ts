import { Response } from 'express';

export function createdResponse(res: Response, path: string, resource: { id: string }) {
  path = path.replace(/^\/?([a-z\-]*)\/?$/gi, '$1');
  res.status(201).location(`/${path}/${resource.id}`).send({ id: resource.id });
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
