import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/interfaces/service.resources.interface';
import { v4 as uuid4 } from 'uuid';
import { UpdateUserPasswordDto } from './dto/update-users-password.dto';
import { getData } from 'src/helpers/getData';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  private excludePassword(user: User): User {
    const userCopy = { ...user };
    delete userCopy['password'];
    return userCopy;
  }

  private getUserData = getData<User>(this.users);

  create(createUserDto: CreateUserDto): User {
    const timeStamp = Date.now();
    const newUser: User = {
      id: uuid4(),
      ...createUserDto,
      version: 1,
      createdAt: timeStamp,
      updatedAt: timeStamp,
    };
    this.users.push(newUser);
    return this.excludePassword(newUser);
  }

  findAll(): User[] {
    return this.users.map((user) => this.excludePassword(user));
  }

  findOne(id: string): User {
    const { data } = this.getUserData(id);
    return this.excludePassword(data);
  }

  updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): User {
    const { data, index } = this.getUserData(id);
    console.log(data.password, updateUserPasswordDto.oldPassword);
    if (!(data.password === updateUserPasswordDto.oldPassword))
      throw new ForbiddenException(
        'Old password does not match the current password',
      );
    const updatedUser: User = {
      ...data,
      password: updateUserPasswordDto.newPassword,
      version: ++data.version,
      updatedAt: Date.now(),
    };
    this.users.splice(index, 1, updatedUser);
    return this.excludePassword(updatedUser);
  }

  remove(id: string) {
    const { index } = this.getUserData(id);
    this.users.splice(index, 1);
  }
}
