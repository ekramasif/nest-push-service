import { IsNotEmpty, IsString, IsOptional, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({
    description: 'Title of the notification',
    example: 'Promo Alert',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Message content of the notification',
    example: 'Get 20% OFF!',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Time to schedule the notification (ISO format)',
    example: '2025-04-05T17:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  scheduleAt?: string;
}