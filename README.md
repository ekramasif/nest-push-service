<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Nest Push Notification Service

A progressive [NestJS](https://nestjs.com/) application for sending immediate and scheduled push notifications.

## Description

This service allows you to send push notifications to users either immediately or at a scheduled time. It uses Firebase for push notifications and Bull for job scheduling.

---

## Project Setup

### Prerequisites

- Node.js (v16+)
- Redis (for Bull queue management)
- Firebase credentials (if using Firebase for push notifications)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nest-push-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your Redis and Firebase configuration.

4. Start Redis:
   ```bash
   redis-server
   ```

5. Run the application:
   - Development mode:
     ```bash
     npm run start:dev
     ```
   - Production mode:
     ```bash
     npm run start:prod
     ```

---

## API Testing Guidelines

### Swagger Documentation

The API is documented using Swagger. Once the application is running, you can access the Swagger UI at:

```
http://localhost:3000/api
```

### Endpoints

#### 1. Send Notification Immediately

- **Endpoint**: `POST /push/send-now`
- **Description**: Sends a notification to all users immediately.
- **Request Body**:
  ```json
  {
    "title": "Promo Alert",
    "message": "Get 20% OFF!"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Notification sent successfully"
  }
  ```

#### 2. Schedule Notification

- **Endpoint**: `POST /push/schedule`
- **Description**: Schedules a notification to be sent at a future time.
- **Request Body**:
  ```json
  {
    "title": "Promo Alert",
    "message": "Get 20% OFF!",
    "scheduleAt": "2025-04-08T12:00:00.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Notification scheduled successfully",
    "scheduledFor": "2025-04-08T12:00:00.000Z"
  }
  ```

#### Error Responses

- **400 Bad Request**: Invalid input or scheduling issues (e.g., past date).
- **500 Internal Server Error**: Unexpected server errors.

---

## Scheduling Logic

The scheduling logic is implemented using the Bull queue library. Here’s how it works:

1. **Immediate Notifications**:
   - The `send-now` endpoint retrieves all user device tokens and sends the notification immediately using Firebase (or a simulated push notification in development).

2. **Scheduled Notifications**:
   - The `schedule` endpoint validates the `scheduleAt` timestamp to ensure it is in the future.
   - The notification is added to the Bull queue with a delay calculated as the difference between the current time and the scheduled time.
   - A Bull processor (`PushProcessor`) listens for the `scheduled-notification` job and sends the notification when the delay expires.

3. **Validation**:
   - The `NotificationDto` class ensures that the `title` and `message` are non-empty strings and that `scheduleAt` (if provided) is a valid ISO 8601 date.

4. **Error Handling**:
   - Invalid dates or past timestamps result in a `400 Bad Request` response.
   - Any unexpected errors during processing are logged and returned as `500 Internal Server Error`.

---

