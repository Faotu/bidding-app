export interface GroupSettings {
  name: string;
  timezone?: string;
  logoURL?: string | null;
  isPublic: boolean;
  pairingDuration?: number;
  allowPreviousPartner?: boolean;
  numberOfUsersPerSession?: number;
  description: string;
}

export interface Schedule {
  groupId: string;
  ownerId: string;
  topic: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  attendees?: string[];
  isUnavailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleReducerState {
  schedules: ScheduleFormType[];
}

export interface ScheduleFormType extends Omit<Schedule, 'startTime' | 'endTime'> {
  start: Date;
  end: Date;
}

export interface ScheduleReducerAction {
  type: string;
  payload: ScheduleFormType[];
}


export type ModalState = 'edit' | 'delete' | 'view' | 'create';

export enum GroupMember {
  'owner' = 'owner',
  'member' = 'member',
}

export interface Group {
  groupId: string;
  ownerId: string;
  settings: GroupSettings;
  members?: Record<string, GroupMember>;
}
