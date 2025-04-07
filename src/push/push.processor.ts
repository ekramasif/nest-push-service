// src/push/push.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UsersService } from '../users/users.service';
import { PushService } from './push.service';

@Processor('notifications')
export class PushProcessor {
  private readonly logger = new Logger(PushProcessor.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly pushService: PushService,
  ) {}

  @Process('scheduled-notification')
  async handleScheduledNotification(job: Job) {
    const { notification } = job.data;
    this.logger.log(
      `Processing scheduled notification: ${notification.title}`
    );

    const deviceTokens = this.usersService.getAllDeviceTokens();
    await this.pushService.sendPushNotifications(deviceTokens, notification);
  }
}