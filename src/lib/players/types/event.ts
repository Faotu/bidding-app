export interface EventData {
  title: string;
  start: Date;
  end: Date;
  isUnavailable: boolean;
  playerId?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}