export type AccessToken = {
  jti: string;
  sub: string;
  name: string;
  email: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
};
