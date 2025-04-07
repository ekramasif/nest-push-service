import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UsersService } from '../users/users.service';
import { NotificationDto } from './dto/notification.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private firebaseInitialized = false;

  constructor(
    private readonly usersService: UsersService,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // This is just for demonstration - in production you'd use actual credentials
      // admin.initializeApp({
      //   credential: admin.credential.cert({
      //     projectId: 'your-project-id',
      //     clientEmail: 'your-client-email',
      //     privateKey: 'your-private-key',
      //   }),
      // });
      // this.firebaseInitialized = true;
      
      // For now, we'll just simulate
      this.logger.log('Firebase simulated initialization successful');
    } catch (error) {
      this.logger.error('Firebase initialization failed', error);
    }
  }

  async sendImmediate(notificationDto: NotificationDto): Promise<void> {
    const deviceTokens = this.usersService.getAllDeviceTokens();
    await this.sendPushNotifications(deviceTokens, notificationDto);
  }

  async scheduleNotification(notificationDto: NotificationDto): Promise<void> {
    if (!notificationDto.scheduleAt) {
      throw new Error('scheduleAt is required for scheduling a notification');
    }
    
    const scheduleDate = new Date(notificationDto.scheduleAt);
    const now = new Date();
    const delay = scheduleDate.getTime() - now.getTime();
  
    if (isNaN(scheduleDate.getTime())) {
      throw new Error('Invalid date format');
    }
  
    if (delay <= 0) {
      throw new Error('Cannot schedule notifications in the past');
    }
  
    // Add to queue with delay
    await this.notificationsQueue.add(
      'scheduled-notification',
      { notification: notificationDto },
      { delay }
    );
  
    this.logger.log(
      `Notification scheduled: "${notificationDto.title}" at ${notificationDto.scheduleAt} (delay: ${Math.round(delay/1000)} seconds)`
    );
  }

  async sendPushNotifications(
    deviceTokens: string[],
    notification: NotificationDto
  ): Promise<void> {
    this.logger.log(
      `Sending notification to ${deviceTokens.length} devices: ${notification.title}`
    );

    // If this was production code with actual Firebase integration
    if (this.firebaseInitialized) {
      // try {
      //   await admin.messaging().sendMulticast({
      //     tokens: deviceTokens,
      //     notification: {
      //       title: notification.title,
      //       body: notification.message,
      //     },
      //   });
      // } catch (error) {
      //   this.logger.error('Failed to send push notifications', error);
      //   throw error;
      // }
    } else {
      // Simulate push notifications for demonstration
      deviceTokens.forEach(token => {
        this.logger.log(
          `[SIMULATION] Sending to ${token}: ${notification.title} - ${notification.message}`
        );
      });
    }
  }
}