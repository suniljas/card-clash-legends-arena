// Push notification service
export class PushNotificationService {
  async requestPermission(): Promise<boolean> {
    // Placeholder implementation
    return false;
  }

  async sendNotification(title: string, body: string): Promise<void> {
    // Placeholder implementation
  }
}

export const pushNotificationService = new PushNotificationService();