import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // This is critical - it makes UsersService available to other modules
})
export class UsersModule {}