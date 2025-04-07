import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PushController } from './push.controller';
import { PushService } from './push.service';
import { UsersModule } from '../users/users.module';
import { PushProcessor } from './push.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    UsersModule, // This imports the UsersModule, making its exported providers available
  ],
  controllers: [PushController],
  providers: [PushService, PushProcessor],
})
export class PushModule {}