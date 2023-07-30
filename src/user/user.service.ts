import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/interfaces/service.resources.interface';
import { v4 as uuid4 } from 'uuid';
import { UpdateUserPasswordDto } from './dto/update-users-password.dto';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  private excludePassword(user: User): User {
    const userCopy = { ...user };
    delete userCopy['password'];
    return userCopy;
  }

  private getUserData(id: string): { user: User; index: number } {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException();
    }
    return { user: this.users[index], index };
  }

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
    const { user } = this.getUserData(id);
    return this.excludePassword(user);
  }

  updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): User {
    const { user, index } = this.getUserData(id);
    console.log(user.password, updateUserPasswordDto.oldPassword);
    if (!(user.password === updateUserPasswordDto.oldPassword))
      throw new ForbiddenException(
        'Old password does not match the current password',
      );
    const updatedUser: User = {
      ...user,
      password: updateUserPasswordDto.newPassword,
      version: ++user.version,
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
