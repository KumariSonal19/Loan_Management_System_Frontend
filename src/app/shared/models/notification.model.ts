export interface Notification {
  id: number;
  userId: number;
  loanApplicationId: number;
  type: string;
  title: string;
  message: string;
  notificationChannel: string;
  isRead: boolean;
  createdAt: string;
}
