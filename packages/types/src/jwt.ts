export type JWT = {
  jti: string;
  sub: string;
  act: string;
  name: string;
  email: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  scope: string;
};
