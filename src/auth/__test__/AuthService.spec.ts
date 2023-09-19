import { Test } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { AuthErrorHanding } from '../authValidate.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/common/mail/mail.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { AuthPayLoadMock } from '../stubs/AuthMock';
import { UserSignIn } from '../datatype/auth.entity';
import { userTest } from 'src/users/stubs/user.stub';

const mockUsersService = () => ({
  async findOneUser() {
    return Promise.resolve({});
  },
  async createUser() {
    return Promise.resolve({});
  },
  throwUserId() {
    return '';
  },
  async updateUser() {
    return Promise.resolve({});
  },
});

const mockProfilesService = () => ({
  async createProfile() {
    return Promise.resolve({});
  },
});

const mockMailService = () => ({
  async sendMail() {
    return Promise.resolve({});
  },
});

describe('AuthService', () => {
  let service: AuthService;
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        UsersService,
        JwtService,
        MailService,
        ProfilesService,
        AuthService,
        AuthErrorHanding,
      ],
    })
      .overrideProvider(ProfilesService)
      .useValue(mockProfilesService)
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .overrideProvider(UsersService)
      .useValue(mockUsersService);

    const compiledModule = await setupTestModule.compile();
    service = compiledModule.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('SignIn done', async () => {
    const userSignIn: UserSignIn = {
      NameOrEmail: userTest.username,
      password: '123456',
    };
    jest.spyOn(service, 'SignIn').mockResolvedValue(AuthPayLoadMock);
    const result = await service.SignIn(userSignIn);
    expect(result).toEqual(AuthPayLoadMock);
  });

  it('SignUp done', async () => {
    jest.spyOn(service, 'SignUp').mockResolvedValue(true);
    const result = await service.SignUp(userTest);
    expect(result).toEqual(true);
  });

  it('getUserId done', async () => {
    jest.spyOn(service, 'getUserId').mockResolvedValue(userTest._id);
    const result = await service.getUserId(userTest.email);
    expect(result).toEqual(userTest._id);
  });

  it('verifyAccount done', async () => {
    jest.spyOn(service, 'verifyAccount').mockResolvedValue(true);
    const result = await service.verifyAccount(
      userTest._id,
      userTest.OTPCode.code,
    );
    expect(result).toEqual(true);
  });

  it('resendOTPCode done', async () => {
    jest
      .spyOn(service, 'resendOTPCode')
      .mockResolvedValue('Resend OTPCode done!');
    const result = await service.resendOTPCode(userTest.email);
    expect(result).toEqual('Resend OTPCode done!');
  });

  it('changePassword done', async () => {
    const newPassword = '123456789';
    const message = `Password of ${userTest.username} is changed successfully`;
    jest.spyOn(service, 'changePassword').mockResolvedValue(message);
    const result = await service.changePassword(
      {
        user_id: userTest._id,
        OTPCode: userTest.OTPCode.code,
      },
      newPassword,
    );
    expect(result).toEqual(message);
  });

  it('forgotPassword done', async () => {
    const message = `OTP code is sent to ${userTest.email}`;
    jest.spyOn(service, 'forgotPassword').mockResolvedValue(message);
    const result = await service.forgotPassword(userTest.email);
    expect(result).toEqual(message);
  });
});
