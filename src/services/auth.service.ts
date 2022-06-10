import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { LoginResponseDto, LoginUserDto, RegisterUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';

class AuthService {
  public users = userModel;

  public async register(userData: RegisterUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'There are no data');

    userData.email = userData.email.toLowerCase();
    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `Email '${userData.email}' already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const now = new Date();

    const createUserData: User = await this.users.create({
      ...userData,
      password: hashedPassword,
      rol: 'user',
      active: false,
      google: false,
      createAt: now,
      updateAt: null,
    });

    return createUserData;
  }

  public async login(userData: LoginUserDto): Promise<LoginResponseDto> {
    if (isEmpty(userData)) throw new HttpException(400, 'There are no data');

    const findUser: User = await this.users.findOne({ email: userData.email.toLowerCase() });
    if (!findUser) throw new HttpException(403, `Email ${userData.email} not found`);

    if (!findUser.active) throw new HttpException(401, `Email ${userData.email} not authorized`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(403, 'Wrong password');

    const tokenData = this.createToken(findUser);

    return {
      userName: findUser.name,
      rol: findUser.rol,
      token: tokenData,
      refreshToken: 'not-implemented-yet',
    };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    return findUser;
  }

  public createToken(user: User): string {
    const dataStoredInToken: DataStoredInToken = {
      id: user._id,
      name: user.name,
      email: user.email,
      rol: user.rol,
    };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return sign(dataStoredInToken, secretKey, { expiresIn });
  }
}

export default AuthService;
