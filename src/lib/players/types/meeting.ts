export interface RolePlayTopic {
  title: string;
  description: string;
}
export type EventSlot = {
  start: Date;
  end: Date;
  title?: string;
  isUnavailable?: boolean;
};

export interface MeetingReducerState {
  events: EventSlot[];
}

export interface MeetingReducerAction {
  type: string;
  payload: EventSlot[];
}
