import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-users-password.dto';
import { User } from 'src/database/entity/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isExists } from 'src/helpers/isExists';
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
    if (!(data.password === updateUserPasswordDto.oldPassword))
      throw new ForbiddenException(
        'Old password does not match the current password1',
      );
    // if everything is alright then update password
    const newUser: User = {
      ...data,
      version: ++data.version,
      updatedAt: Date.now(),
      createdAt: Number(data.createdAt),
      password: updateUserPasswordDto.newPassword,
    };
    return this.excludePassword(await this.userRepository.save(newUser));
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete({ id });
  }
}
