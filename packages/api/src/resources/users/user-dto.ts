export interface UserDto {
  id: string;
  username: string;
  email: string;
  slackHandle: string;
}

export interface NewUserDto extends UserDto {
  password: string;
}
