// src/push/push.controller.ts
import { Controller, Post, Body, HttpStatus, HttpCode, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PushService } from './push.service';
import { NotificationDto } from './dto/notification.dto';

@ApiTags('push')
@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('send-now')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send notification immediately to all users' })
  @ApiResponse({
    status: 200,
    description: 'Notification sent successfully',
  })
  async sendNow(@Body() notificationDto: NotificationDto) {
    await this.pushService.sendImmediate(notificationDto);
    return { success: true, message: 'Notification sent successfully' };
  }

  @Post('schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Schedule a notification to be sent later' })
  @ApiResponse({
    status: 200,
    description: 'Notification scheduled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - scheduling issues like past date or missing schedule time',
  })
  async schedule(@Body() notificationDto: NotificationDto) {
    try {
      if (!notificationDto.scheduleAt) {
        throw new BadRequestException('scheduleAt is required for scheduling a notification');
      }
      
      const scheduleDate = new Date(notificationDto.scheduleAt);
      const now = new Date();
      
      // Validate date format and future time
      if (isNaN(scheduleDate.getTime())) {
        throw new BadRequestException('Invalid date format. Please use ISO format (e.g. 2025-04-08T12:00:00.000Z)');
      }
      
      if (scheduleDate <= now) {
        throw new BadRequestException(`Cannot schedule notifications in the past. Current time: ${now.toISOString()}`);
      }
      
      await this.pushService.scheduleNotification(notificationDto);
      
      return { 
        success: true, 
        message: 'Notification scheduled successfully', 
        scheduledFor: notificationDto.scheduleAt 
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }
}