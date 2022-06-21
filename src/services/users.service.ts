import { hash } from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User, UserList } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty, isValidId } from '@utils/util';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<UserList[]> {
    const users = await this.users.find();
    const usersList: UserList[] = [];
    users.forEach(element => {
      const { _id, name, email } = element;
      usersList.push({ _id, name, email });
    });
    return usersList;
  }

  public async findUserById(userId: string): Promise<User> {
    if (!isValidId(userId)) throw new HttpException(400, 'Invalid user ID format');

    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(404, 'User ID not found');

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'There are no data');

    userData.email = userData.email.toLowerCase();
    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser)
      throw new HttpException(409, `Email '${userData.email}' already exists`);

    const now = new Date();
    const hashedPassword = await hash(userData.password, 10);

    const createUserData: User = await this.users.create({
      ...userData,
      password: hashedPassword,
      createAt: now,
      updateAt: null,
    });

    return createUserData;
  }

  public async updateUser(userId: string, userData: UpdateUserDto): Promise<User> {
    if (!isValidId(userId)) throw new HttpException(400, 'Invalid user ID format');

    if (isEmpty(userData)) throw new HttpException(400, 'There are no data');

    const findUser: User = await this.users.findById(userId);
    if (!findUser) throw new HttpException(404, `User not found`);

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const now = new Date();
    await this.users.findByIdAndUpdate(userId, { ...userData, updateAt: now });

    const updateUserById: User = await this.users.findById(userId);

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    if (!isValidId(userId)) throw new HttpException(400, 'Invalid user ID format');

    const deleteUserById: User = await this.users.findByIdAndDelete(userId);

    if (!deleteUserById) throw new HttpException(404, `User not found`);

    return deleteUserById;
  }
}

export default UserService;
