import {
  Gender,
  PersonalityType,
  SpokenLanguage,
  Timezone,
  YearsOfExperience,
} from '~/core/session/types/role-play-tribe';

// options
export const genderOptions = Object.keys(Gender).map((gender) => ({
  label: gender,
  value: gender,
}));

export const personalityOptions = Object.keys(PersonalityType).map((type) => ({
  label: type,
  value: type,
}));

export const yearsOfExperienceOptions = Object.values(YearsOfExperience).map(
  (year) => ({
    label: year,
    value: year,
  })
);

export const languageOptions = Object.values(SpokenLanguage).map(
  (language) => ({
    label: language,
    value: language,
  })
);

export const timezoneOptions = Object.values(Timezone).map((tz) => ({
  label: tz,
  value: tz,
}));
