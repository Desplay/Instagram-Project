export interface JWT {
  access_token: string;
}

export interface UserLogIn {
  NameOrEmail: string;
  password: string;
}

export interface UserSignUp {
  email: string;
  username: string;
  password: string;
}
