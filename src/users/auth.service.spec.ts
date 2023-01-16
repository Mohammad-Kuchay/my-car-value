import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await authService.signup('mnf@gmail.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("throws an error if user sign up with email that's already in use ", async () => {
    await authService.signup('mnf@gmail.com', '12345');
    try {
      await authService.signup('mnf@gmail.com', 'asdf');
    } catch (error) {
      expect(error.message).toMatch('Email in use');
    }
  });

  it('throws an error if signin is called with an unused user', async () => {
    try {
      await authService.signin('mnfbbbbb@gmail.com', 'asdf');
    } catch (error) {
      expect(error.message).toMatch('User not found');
    }
  });

  it('throws an error if an invalid password is provided', async () => {
    await authService.signup('mnf@gmail.com', '12345');

    try {
      await authService.signin('mnf@gmail.com', 'asdf');
    } catch (error) {
      expect(error.message).toMatch('Password doesnot match');
    }
  });

  it('returns a user if correct password is provided', async () => {
    await authService.signup('mnf@gmail.com', '12345678');
    const user = await authService.signin('mnf@gmail.com', '12345678');
    expect(user).toBeDefined();
  });
});
