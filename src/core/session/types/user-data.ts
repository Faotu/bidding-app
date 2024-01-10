import { GlobalRole } from '~/core/session/types/global-role';
import {
  Gender,
  ImprovementOptions,
  PersonalityType,
  PreferredRolePlayDuration,
  PreferredSessionsPerWeek,
  RolePlayLevel,
  SpokenLanguage,
  Timezone,
  YearsOfExperience,
} from './role-play-tribe';

export interface AvailabilityFormData {
  timezone: UserData['timezone'];
  availability: UserData['availability'];
}

export type AvailabilityDay =
  | 'saturday'
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday';

export interface Schedule {
  from: string;
  to: string;
}

export type DayData = {
  isActive: boolean;
  schedules: Schedule[];
};

export type Availability = {
  [key in AvailabilityDay]: DayData;
};

/**
 * This interface represents the user record in Firestore
 * Not to be confused with {@link User} defined in Firebase Auth
 * This data is always present in {@link UserSession}
 */
export interface UserData extends UserProfileData, UserProfessionalData {
  role?: GlobalRole;
  userId: string;
  userRating?: RolePlayLevel;
  userType: UserType;
  availability: Availability;
}

export enum UserType {
  'admin' = 'admin',
  'user' = 'user',
}

/**
 * Profile related user data
 */
export interface UserProfileData {
  languagesFluentIn?: SpokenLanguage[];
  timezone?: Timezone;
  firstLanguage?: SpokenLanguage;
  aboutMe?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  yearsOfRolePlayExperience?: YearsOfExperience;
  improvementList?: ImprovementOptions[];
  personalityType?: PersonalityType[];
  displayName: string;
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Professional related user data
 */
export interface UserProfessionalData {
  yearsOfIndustryExperience?: YearsOfExperience;
  transactionsLastTwelveMonths?: number;
  brokerageName?: string;
  selfAssessedRolePlayLevel?: RolePlayLevel;
  preferredSessionsPerWeek?: PreferredSessionsPerWeek;
  preferredRolePlayDuration?: PreferredRolePlayDuration;
}

export interface ProfileInfo extends UserProfileData, UserProfessionalData {
  photoURL: string | null;
  phoneNumber: string | null;
  displayName: string;
}
