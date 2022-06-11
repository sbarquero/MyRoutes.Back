import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY, TOKEN_DURATION, REFRESH_TOKEN_DURATION } from '@config';
import { LoginResponseDto, LoginUserDto, LogoutSessionDto, RegisterUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { Session } from '@/interfaces/auth.interface';
import { randomUUID } from 'crypto';

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

    const findUser = await this.users.findOne({ email: userData.email.toLowerCase() });
    if (!findUser) throw new HttpException(403, `Email ${userData.email} not found`);

    if (!findUser.active) throw new HttpException(401, `Email ${userData.email} not authorized`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(403, 'Wrong password');

    const tokenData = this.createToken(findUser);
    const refreshToken = this.createSession();

    findUser.sessions.push(refreshToken);

    const updatedUser = await findUser.save();

    const sessionId: number = updatedUser.sessions[updatedUser.sessions.length - 1]._id;

    const response: LoginResponseDto = {
      userId: findUser._id,
      userName: findUser.name,
      rol: findUser.rol,
      token: tokenData,
      sessionId,
      refreshToken: refreshToken.refreshToken,
      expireAt: refreshToken.expireAt,
    };
    return response;
  }

  public async logout(logoutRequest: LogoutSessionDto): Promise<Session> {
    if (isEmpty(logoutRequest)) throw new HttpException(400, 'There are not LogoutRequest');

    const { userId, sessionId } = logoutRequest;
    const findUser = await this.users.findById(userId);
    if (!findUser) throw new HttpException(404, `UserId '${userId}' not found`);

    const index = findUser.sessions.findIndex(x => x._id == sessionId);
    if (index === -1) throw new HttpException(404, `SessionId '${userId}' not found`);

    const closedSession = findUser.sessions.splice(index, 1)[0];
    await findUser.save();

    return closedSession;
  }

  private createToken(user: User): string {
    const dataStoredInToken: DataStoredInToken = {
      id: user._id,
      name: user.name,
      email: user.email,
      rol: user.rol,
    };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = parseInt(TOKEN_DURATION) * 60;

    return sign(dataStoredInToken, secretKey, { expiresIn });
  }

  private createSession(): Session {
    const refreshToken = randomUUID();
    const createAt = new Date(Date.now());
    const expireAt = new Date(Date.now() + parseInt(REFRESH_TOKEN_DURATION) * 60 * 1000);
    return { refreshToken, createAt, expireAt };
  }
}

export default AuthService;
