import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User as User1 } from 'src/interfaces/service.resources.interface';
import { v4 as uuid4 } from 'uuid';
import { UpdateUserPasswordDto } from './dto/update-users-password.dto';
import { getData } from 'src/helpers/getData';
import { User } from 'src/database/entity/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  private readonly users: User1[] = [];

  private excludePassword(user: User): User {
    const userCopy = { ...user };
    delete userCopy['password'];
    return userCopy;
  }

  private getUserData = getData<User1>(this.users);

  async create(createUserDto: CreateUserDto): Promise<User> {
    const timeStamp = Date.now();
    const newUser: Omit<User, 'id'> = {
      ...createUserDto,
      version: 1,
      createdAt: timeStamp,
      updatedAt: timeStamp,
    };
    return this.excludePassword(await this.userRepository.save(newUser));
  }

  async findAll(): Promise<User[]> {
    return (await this.userRepository.find()).map((user) =>
      this.excludePassword(user),
    );
  }

  findOne(id: string): void {
    const { data } = this.getUserData(id);
    // return this.excludePassword(data);
  }

  updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): void {
    const { data, index } = this.getUserData(id);
    console.log(data.password, updateUserPasswordDto.oldPassword);
    if (!(data.password === updateUserPasswordDto.oldPassword))
      throw new ForbiddenException(
        'Old password does not match the current password1',
      );
    const updatedUser: User1 = {
      ...data,
      password: updateUserPasswordDto.newPassword,
      version: ++data.version,
      updatedAt: Date.now(),
    };
    this.users.splice(index, 1, updatedUser);
    // return this.excludePassword(updatedUser);
  }

  remove(id: string): void {
    const { index } = this.getUserData(id);
    this.users.splice(index, 1);
  }
}
