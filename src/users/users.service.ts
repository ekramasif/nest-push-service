import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: '1', name: 'John Doe', deviceToken: 'device_token_1' },
    { id: '2', name: 'Jane Smith', deviceToken: 'device_token_2' },
    { id: '3', name: 'Alice Johnson', deviceToken: 'device_token_3' },
    { id: '4', name: 'Bob Brown', deviceToken: 'device_token_4' },
    { id: '5', name: 'Charlie Davis', deviceToken: 'device_token_5' },
    { id: '6', name: 'Diana Evans', deviceToken: 'device_token_6' },
    { id: '7', name: 'Ethan Foster', deviceToken: 'device_token_7' },
    { id: '8', name: 'Fiona Garcia', deviceToken: 'device_token_8' },
    { id: '9', name: 'George Harris', deviceToken: 'device_token_9' },
    { id: '10', name: 'Hannah Irving', deviceToken: 'device_token_10' },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  getAllDeviceTokens(): string[] {
    return this.users.map(user => user.deviceToken);
  }
}