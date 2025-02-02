export interface Target {
  _id: string;
  name: string;
  id: string;
}
export interface Notification {
  _id: string;
  target: Target;
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  id: string;
}
export interface NotificationResponsePayload {
  notifications: Notification[];
}
