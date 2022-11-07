import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '../app';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import UserRoute from '../routes/user.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing User', () => {
  describe('[GET] /user', () => {
    it('response findAll Users', async () => {
      const userRoute = new UserRoute();
      const users = userRoute.userController.userService.users;

      users.find = jest.fn().mockReturnValue([
        {
          _id: '62594afa866ac94150a0801d',
          name: 'user a',
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
          rol: 'user',
          active: true,
          google: false,
        },
        {
          _id: '56594afa866ac94150a0801d',
          name: 'user b',
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
          rol: 'user',
          active: true,
          google: false,
        },
        {
          _id: '78594afa866ac94150a0801d',
          name: 'user c',
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
          rol: 'user',
          active: true,
          google: false,
        },
      ]);

      (mongoose as any).connect = jest.fn();
      const app = new App([userRoute]);
      return request(app.getServer()).get(`${userRoute.path}`).expect(200);
    });
  });

  describe('[GET] /user/:id', () => {
    it('response findOne User', async () => {
      const userId = '62594afa866ac94150a0801d';

      const userRoute = new UserRoute();
      const users = userRoute.userController.userService.users;

      users.findOne = jest.fn().mockReturnValue({
        _id: '62594afa866ac94150a0801d',
        name: 'test name',
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
        rol: 'user',
        active: true,
        google: false,
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([userRoute]);
      return request(app.getServer()).get(`${userRoute.path}/${userId}`).expect(200);
    });
  });

  describe('[POST] /user', () => {
    it('response Create User', async () => {
      const userData: CreateUserDto = {
        name: 'test name',
        email: 'test@email.com',
        password: 'q1w2e3r4',
        rol: 'user',
        active: true,
      };

      const userRoute = new UserRoute();
      const users = userRoute.userController.userService.users;

      users.findOne = jest.fn().mockReturnValue(null);
      users.create = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([userRoute]);
      return request(app.getServer())
        .post(`${userRoute.path}`)
        .send(userData)
        .expect(201);
    });
  });

  describe('[PUT] /user/:id', () => {
    it('response Update User', async () => {
      const userId = '60706478aad6c9ad19a31c84';
      const userData: UpdateUserDto = {
        name: 'updated test name',
        password: 'q1w2e3r4',
        rol: 'admin',
        active: true,
      };

      const userRoute = new UserRoute();
      const users = userRoute.userController.userService.users;

      users.findById = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
      });
      users.findByIdAndUpdate = jest.fn().mockReturnValue({
        message: 'User updated',
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([userRoute]);
      return request(app.getServer()).put(`${userRoute.path}/${userId}`).send(userData);
    });
  });

  describe('[DELETE] /user/:id', () => {
    it('response Delete User', async () => {
      const userId = '60706478aad6c9ad19a31c84';

      const userRoute = new UserRoute();
      const users = userRoute.userController.userService.users;

      users.findByIdAndDelete = jest.fn().mockReturnValue({
        message: 'User deleted',
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([userRoute]);
      return request(app.getServer()).delete(`${userRoute.path}/${userId}`).expect(200);
    });
  });
});
