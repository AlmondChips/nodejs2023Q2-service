import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-users-password.dto';
import { User } from 'src/database/entity/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isExists } from 'src/helpers/isExists';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private excludePassword(user: User): User {
    const userCopy = { ...user };
    delete userCopy['password'];
    return userCopy;
  }

  async findByLoginAndPassword({ login, password }: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      login,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({
      login: createUserDto.login,
    });

    try {
      isExists(user);
    } catch (error) {
      const timeStamp = Date.now();
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser: Omit<User, 'id'> = {
        ...createUserDto,
        password: hashPassword,
        version: 1,
        createdAt: timeStamp,
        updatedAt: timeStamp,
      };
      return this.excludePassword(await this.userRepository.save(newUser));
    }
    throw new HttpException('Login already exists', HttpStatus.CONFLICT);
  }

  async findAll(): Promise<User[]> {
    return (await this.userRepository.find()).map((user) =>
      this.excludePassword(user),
    );
  }

  async findOne(id: string): Promise<User> {
    const user = this.excludePassword(
      await this.userRepository.findOneBy({ id }),
    );
    return isExists<User>(user);
  }

  async updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<User | void> {
    const data = await this.userRepository.findOneBy({ id });
    isExists<User>(data);
    // check old password
    const isEqual = await bcrypt.compare(
      updateUserPasswordDto.oldPassword,
      data.password,
    );
    if (!isEqual) {
      throw new ForbiddenException(
        'Old password does not match the current password',
      );
    }

    // if everything is alright then update password
    const hashPassword = await bcrypt.hash(
      updateUserPasswordDto.newPassword,
      10,
    );
    const newUser: User = {
      ...data,
      version: ++data.version,
      updatedAt: Date.now(),
      createdAt: Number(data.createdAt),
      password: hashPassword,
    };
    return this.excludePassword(await this.userRepository.save(newUser));
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete({ id });
  }
}
