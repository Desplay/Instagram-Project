export interface Authorization {
  authorization: string;
}

export interface UserSignIn {
  NameOrEmail: string;
  password: string;
}

export interface OTPCode {
  verify: boolean;
  code: string;
  dateCreated: number;
  dateExpired: number;
}
