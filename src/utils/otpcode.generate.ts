import { customAlphabet } from 'nanoid';
import { OTPCode } from 'src/auth/datatype/auth.entity';

export default function createOTPCode(): OTPCode {
  const newOTPCode: OTPCode = {
    verify: false,
    code: customAlphabet('1234567890', 6)(),
    dateCreated: new Date().getTime(),
    dateExpired: new Date().getTime() + 5 * 60 * 1000,
  };
  return newOTPCode;
}
