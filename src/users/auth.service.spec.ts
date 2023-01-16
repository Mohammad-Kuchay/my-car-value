import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'mnf@gmail.com', password: '12345' } as User,
      ]);
    try {
      await authService.signup('mnf@gmail.com', 'asdf');
    } catch (error) {
      return;
    }
  });

  it('throws an error if signin is called with an unused user', async () => {
    try {
      await authService.signin('mnf@gmail.com', 'asdf');
    } catch (error) {
      return;
    }
  });
});
