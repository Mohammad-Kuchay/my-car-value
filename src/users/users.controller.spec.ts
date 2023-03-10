import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'mnf@gmail.com',
          password: 'asdf',
        } as User);
      },
      find(email: string) {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      // remove: () {},
      // update: () {}
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signup: () => {
        return Promise.resolve({} as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('mnf@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('mnf@gmail.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user user with given id is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    try {
      await controller.findUser('1');
    } catch (error) {
      expect(error.message).toMatch('user not found');
    }
  });

  it('signin updates session object and retrun user', async () => {
    const session = { userId: 0 };
    const user = await controller.signin(
      { email: 'mnf@gmail.com', password: '12345678' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
