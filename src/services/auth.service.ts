import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  RECOVER_URL,
  RECOVER_TOKEN_DURATION,
  ACTIVATION_URL,
  SECRET_KEY,
  TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
} from '@config';
import {
  LoginUserDto,
  LogoutSessionDto,
  RefreshTokenDto,
  AuthResponseDto,
  RegisterUserDto,
  RejectSessionDto,
  RecoverPasswordDto,
  ResetPasswordDto,
  ActivateUserDto,
  ActivateResponseDto,
} from '@dtos/auth.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, Session } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { randomBytes, randomUUID } from 'crypto';
import MailService from './mail.service';
import resetTokenModel from '@/models/resetToken.model';
import { logger } from '@/utils/logger';
import registerTokenModel from '@/models/registerToken.model';

class AuthService {
  public users = userModel;
  public resetToken = resetTokenModel;
  public registerToken = registerTokenModel;
  public mailService = new MailService();

  public async register(userData: RegisterUserDto): Promise<void> {
    if (isEmpty(userData)) throw new HttpException(400, 'There are no data');

    const email = userData.email.toLowerCase();
    const findUser: User = await this.users.findOne({ email });
    if (findUser && findUser.active) {
      await this.registerToken.findOneAndRemove({ email });
      throw new HttpException(409, `Email '${email}' already exists`);
    }

    if (findUser) {
      // if user exist and is not active we send the token again
      const { token } = await this.registerToken.findOne({ email });
      this.sendActivationTokenEmail(email, token);
      return;
    }

    // if new user account
    const hashedPassword = await hash(userData.password, 10);
    const now = new Date();

    userData.email = email;

    await this.users.create({
      ...userData,
      password: hashedPassword,
      rol: 'user',
      active: false,
      createAt: now,
      updateAt: now,
    });

    const token = randomBytes(16).toString('hex');

    await this.registerToken.findOneAndDelete({ email });
    await this.registerToken.create({ email, token });
    this.sendActivationTokenEmail(email, token);
  }

  public async login(userData: LoginUserDto): Promise<AuthResponseDto> {
    if (isEmpty(userData)) throw new HttpException(400, 'There are no data');

    const email = userData.email.toLowerCase();
    const findUser = await this.users.findOne({ email });
    if (!findUser) throw new HttpException(403, `Email ${email} not found`);

    if (!findUser.active) throw new HttpException(403, `Email ${email} not active`);

    const isPasswordMatching: boolean = await compare(
      userData.password,
      findUser.password,
    );

    if (!isPasswordMatching) throw new HttpException(403, 'Wrong password');

    this.removeExpiredSessions(findUser.sessions);

    const tokenData = this.createToken(findUser);
    const refreshToken = this.createSession();

    findUser.sessions.push(refreshToken);

    const updatedUser = await findUser.save();

    const sessionId: string = updatedUser.sessions[updatedUser.sessions.length - 1]._id;

    const response: AuthResponseDto = {
      userId: findUser._id,
      userName: findUser.name,
      email: findUser.email,
      rol: findUser.rol,
      token: tokenData,
      sessionId,
      refreshToken: refreshToken.refreshToken,
      expireAt: refreshToken.expireAt,
    };
    return response;
  }

  public async logout(logoutRequest: LogoutSessionDto): Promise<Session> {
    if (isEmpty(logoutRequest))
      throw new HttpException(400, 'There are not LogoutRequest');

    const { userId, sessionId, refreshToken } = logoutRequest;
    const findUser = await this.users.findById(userId);
    if (!findUser) throw new HttpException(404, `UserId '${userId}' not found`);

    const index = findUser.sessions.findIndex(session => session._id == sessionId);
    if (index === -1) throw new HttpException(404, `SessionId '${sessionId}' not found`);

    if (refreshToken !== findUser.sessions[index].refreshToken)
      throw new HttpException(
        403,
        'Session could not to be closed due incorrect refreshToken',
      );

    const closedSession = findUser.sessions.splice(index, 1)[0];
    await findUser.save();

    return closedSession;
  }

  public async refresh(refreshData: RefreshTokenDto): Promise<AuthResponseDto> {
    if (isEmpty(refreshData)) throw new HttpException(400, 'There are no data');

    const findUser = await this.users.findById(refreshData.userId);
    if (!findUser) throw new HttpException(403, `UserId ${refreshData.userId} not found`);

    if (!findUser.active)
      throw new HttpException(403, `UserId ${refreshData.userId} not active`);

    const index = findUser.sessions.findIndex(
      session => session._id == refreshData.sessionId,
    );
    if (index === -1)
      throw new HttpException(404, `SessionId '${refreshData.sessionId}' not found`);

    const storedSession = findUser.sessions[index];
    if (refreshData.refreshToken !== storedSession.refreshToken) {
      findUser.sessions.splice(index, 1)[0];
      await findUser.save();
      throw new HttpException(401, 'Invalid refreshToken');
    }

    const now = new Date(Date.now());

    if (storedSession.expireAt.getTime() < now.getTime()) {
      findUser.sessions.splice(index, 1)[0];
      await findUser.save();
      throw new HttpException(401, `RefreshToken has expired`);
    }

    const tokenData = this.createToken(findUser);
    const refreshToken = this.refreshSession(storedSession);

    findUser.sessions[index] = refreshToken;

    await findUser.save();

    const response: AuthResponseDto = {
      userId: refreshData.userId,
      userName: findUser.name,
      email: findUser.email,
      rol: findUser.rol,
      token: tokenData,
      sessionId: refreshData.sessionId,
      refreshToken: refreshToken.refreshToken,
      expireAt: refreshToken.expireAt,
    };
    return response;
  }

  public async reject(rejectRequest: RejectSessionDto): Promise<Session> {
    if (isEmpty(rejectRequest))
      throw new HttpException(400, 'There are not RejectRequest');

    const { userId, sessionId, refreshToken } = rejectRequest;
    const findUser = await this.users.findById(userId);
    if (!findUser) throw new HttpException(404, `UserId '${userId}' not found`);

    const indexSession = findUser.sessions.findIndex(session => session._id == sessionId);
    const indexRefreshToken = findUser.sessions.findIndex(
      session => session.refreshToken == refreshToken,
    );

    if (indexSession === -1 && indexRefreshToken === -1)
      throw new HttpException(
        404,
        `SessionId '${sessionId}' and RefreshToken '${refreshToken}' not found`,
      );

    let closedSession: Session;
    if (indexSession !== -1) closedSession = findUser.sessions.splice(indexSession, 1)[0];
    else closedSession = findUser.sessions.splice(indexRefreshToken, 1)[0];

    await findUser.save();

    return closedSession;
  }

  public async recover(recoverRequest: RecoverPasswordDto): Promise<void> {
    const email = recoverRequest.email.toLowerCase();
    const user = await this.users.findOne({ email });
    if (!user) {
      logger.error(`Recover password: Email ${email} does not exist`);
      return;
    }
    const token = randomBytes(16).toString('hex');
    const recoverUrl = `${RECOVER_URL}/${token}`;

    await this.resetToken.findOneAndDelete({ email: recoverRequest.email });
    await this.resetToken.create({
      email: recoverRequest.email,
      token: token,
      expireAt: new Date(Date.now() + parseInt(RECOVER_TOKEN_DURATION) * 60 * 1000),
    });

    this.mailService.sendRecoverEmail(recoverRequest.email, recoverUrl);
  }

  public async reset(resetRequest: ResetPasswordDto): Promise<void> {
    const { token, password } = resetRequest;
    const response = await this.resetToken.findOne({ token });
    if (!response) throw new HttpException(401, 'Invalid Token');

    const { email, expireAt } = response;
    const now = new Date(Date.now());

    if (expireAt.getTime() < now.getTime()) {
      await this.resetToken.findOneAndDelete({ token });
      throw new HttpException(401, `Token has expired`);
    }

    const user = await this.users.findOne({ email });

    if (!user) throw new HttpException(404, 'User not found');

    user.password = await hash(password, 10);

    await this.users.findByIdAndUpdate(user._id, user);
    await this.resetToken.findOneAndDelete({ token });
  }

  public async activate(activateRequest: ActivateUserDto): Promise<ActivateResponseDto> {
    const { token } = activateRequest;
    const registeredToken = await this.registerToken.findOne({ token });
    if (!registeredToken) throw new HttpException(401, 'Invalid Token');

    const { email } = registeredToken;
    const user = await this.users.findOne({ email });
    if (!user) throw new HttpException(404, 'User not found');

    user.active = true;
    user.updateAt = new Date();

    await this.users.findByIdAndUpdate(user._id, user);
    await this.registerToken.findOneAndDelete({ token });

    const response: ActivateResponseDto = { email };
    return response;
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

  private refreshSession(session: Session): Session {
    const _id = session._id;
    const refreshToken = randomUUID();
    const createAt = session.createAt;
    const expireAt = new Date(Date.now() + parseInt(REFRESH_TOKEN_DURATION) * 60 * 1000);
    return { _id, refreshToken, createAt, expireAt };
  }

  private sendActivationTokenEmail(email: string, token: string): void {
    const activationUrl = `${ACTIVATION_URL}/${token}`;
    this.mailService.sendActivationEmail(email, activationUrl);
  }

  private removeExpiredSessions(sessions: [Session]): [Session] {
    const now = new Date();

    for (let i = sessions.length - 1; i >= 0; i--) {
      if (sessions[i].expireAt.getTime() < now.getTime()) {
        console.log('borro:', sessions[i].expireAt);
        sessions.splice(i, 1);
      }
    }

    return sessions;
  }
}

export default AuthService;
