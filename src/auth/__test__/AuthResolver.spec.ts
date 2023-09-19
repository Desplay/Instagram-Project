import { Test } from '@nestjs/testing';
import { AuthResolver } from 'src/auth/auth.resolver';
import { AuthService } from 'src/auth/auth.service';
import { GuardMock } from '../stubs/GuardMock';
import { AuthGuard } from '../auth.guard';
import { AuthErrorHanding } from '../authValidate.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { userTest } from 'src/users/stubs/user.stub';
import { UserSignIn } from 'src/users/datatype/user.dto';
import { MailService } from 'src/common/mail/mail.service';
import { AuthPayLoadMock } from '../stubs/AuthMock';

const mockAuthService = () => ({
  async SignIn() {
    return Promise.resolve({});
  },

  async SignUp() {
    return Promise.resolve({});
  },

  async getUserId() {
    return Promise.resolve({});
  },

  async verifyAccount() {
    return Promise.resolve({});
  },

  async resendOTPCode() {
    return Promise.resolve({});
  },

  async changePassword() {
    return Promise.resolve({});
  },

  async forgotPassword() {
    return Promise.resolve({});
  },

  async createUser() {
    return Promise.resolve({});
  },

  createEmtyProfile() {
    return null;
  },
});

const mockMailService = () => ({
  async sendMail() {
    return Promise.resolve({});
  },
});

const mockUsersService = () => ({
  async findOneUser() {
    return Promise.resolve({});
  },
});

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        UsersService,
        JwtService,
        MailService,
        AuthResolver,
        AuthService,
        AuthErrorHanding,
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .overrideProvider(UsersService)
      .useValue(mockUsersService);

    setupTestModule.overrideGuard(AuthGuard).useValue(GuardMock);
    const compiledModule = await setupTestModule.compile();
    resolver = compiledModule.get(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('SignIn done', async () => {
    const userSignIn: UserSignIn = {
      username: userTest.username,
      email: null,
      password: '123456',
    };
    jest.spyOn(resolver, 'SignIn').mockResolvedValue(AuthPayLoadMock);
    const result = await resolver.SignIn(userSignIn);
    expect(result).toEqual(AuthPayLoadMock);
  });

  it('SignUp done', async () => {
    jest.spyOn(resolver, 'SignUp').mockResolvedValue('Sign up done!');
    const result = await resolver.SignUp(userTest);
    expect(result).toEqual('Sign up done!');
  });

  it('verifyAccount done', async () => {
    jest
      .spyOn(resolver, 'verifyAccount')
      .mockResolvedValue('Verify account done!');
    const result = await resolver.verifyAccount(
      '123456',
      'something@gmail.com',
    );
    expect(result).toEqual('Verify account done!');
  });
});
