import { Trans, useTranslation } from 'next-i18next';
import toaster from 'react-hot-toast';
import { Controller, useForm } from 'react-hook-form';
import { useUpdateProfile } from '~/lib/profile/hooks/use-update-profile';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import { UserData, UserProfileData } from '~/core/session/types/user-data';
import {
  Gender,
  ImprovementOptions,
  PersonalityType,
  SpokenLanguage,
  Timezone,
  YearsOfExperience,
} from '~/core/session/types/role-play-tribe';
import SelectListBox from '../SelectListBox';
import MultiSelectListBox from '../MultiSelectListBox';
import SwitchToggle from '../SwitchToggle';
import { DatePicker } from '~/core/ui/DatePicker';

interface ProfileData
  extends Omit<UserProfileData, 'displayName' | 'createdAt' | 'updatedAt'> {}

function UpdateProfileForm({
  profile,
  onUpdate,
}: {
  profile?: ProfileData;
  onUpdate: (user: ProfileData) => void;
}) {
  const [updateProfile, { loading }] = useUpdateProfile();

  const { t } = useTranslation();
  const currentTimeZone = profile?.timezone ?? Timezone.EST;
  const currentFirstLanguage = profile?.firstLanguage ?? SpokenLanguage.EN;
  const currentLanguagesFluentIn = profile?.languagesFluentIn ?? [
    SpokenLanguage.EN,
  ];
  const currentAboutMe = profile?.aboutMe ?? '';
  let currentDateOfBirth: UserData['dateOfBirth'];
  profile?.dateOfBirth != undefined
    ? (currentDateOfBirth = new Date(profile.dateOfBirth))
    : new Date();
  const currentGender = profile?.gender ?? Gender.Unknown;
  const currentYearsOfRolePlayExperience =
    profile?.yearsOfRolePlayExperience ?? YearsOfExperience.ZeroToThree;
  const currentPersonalityType = profile?.personalityType ?? [
    PersonalityType.D,
  ];
  const currentImprovementList = profile?.improvementList ?? [
    ImprovementOptions.BuildConfidnece,
  ];
  const currentPublicStatus = profile?.public || false;

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      firstLanguage: currentFirstLanguage,
      aboutMe: currentAboutMe,
      personalityType: currentPersonalityType,
      timezone: currentTimeZone,
      languagesFluentIn: currentLanguagesFluentIn,
      dateOfBirth: currentDateOfBirth,
      gender: currentGender,
      yearsOfRolePlayExperience: currentYearsOfRolePlayExperience,
      improvementList: currentImprovementList,
      public: currentPublicStatus,
    },
  });

  const onSubmit = async ({
    firstLanguage,
    aboutMe,
    personalityType,
    timezone,
    languagesFluentIn,
    dateOfBirth,
    gender,
    yearsOfRolePlayExperience,
    improvementList,
    public: isPublic,
  }: ProfileData) => {
    const info = {
      firstLanguage,
      aboutMe,
      personalityType,
      timezone,
      languagesFluentIn,
      dateOfBirth,
      gender,
      yearsOfRolePlayExperience,
      improvementList,
      public: isPublic,
    };

    const promise = updateProfile(info).then(() => {
      onUpdate(info);
    });

    return toaster.promise(promise, {
      success: t(`profile:updateProfileSuccess`),
      error: t(`profile:updateProfileError`),
      loading: t(`profile:updateProfileLoading`),
    });
  };

  const aboutMeControl = register('aboutMe');

  return (
    <>
      <form
        data-cy={'update-profile-form'}
        onSubmit={handleSubmit((value) => {
          return onSubmit({
            gender: value.gender,
            firstLanguage: value.firstLanguage,
            aboutMe: value.aboutMe,
            personalityType: value.personalityType,
            timezone: value.timezone,
            languagesFluentIn: value.languagesFluentIn,
            dateOfBirth: value.dateOfBirth,
            yearsOfRolePlayExperience: value.yearsOfRolePlayExperience,
            improvementList: value.improvementList,
            public: value.public,
          });
        })}
      >
        <div className={'flex flex-col space-y-4'}>
          <div className="grid w-full grid-cols-2 gap-4">
            <TextField>
              <TextField.Label>
                What is your gender?
                <SelectListBox
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  items={Object.values(Gender).map(([k, v]) => ({
                    value: v,
                    label: v,
                  }))}
                  buttonClassname={'rounded-lg border border-gray-300'}
                />
              </TextField.Label>
            </TextField>
            <TextField>
              <TextField.Label>
                <Trans i18nKey={'profile:displayLanguageLabel'} />
                <SelectListBox
                  name="firstLanguage"
                  control={control}
                  rules={{ required: true }}
                  items={Object.values(SpokenLanguage).map((v) => ({
                    value: v,
                    label: v,
                  }))}
                  buttonClassname="rounded-lg border border-gray-300"
                />
              </TextField.Label>
            </TextField>
            <TextField>
              <TextField.Label>
                <Trans i18nKey={'profile:displayPersonalityTypeLabel'} />
                <MultiSelectListBox
                  name="personalityType"
                  control={control}
                  rules={{ required: true }}
                  items={Object.entries(PersonalityType).map(([k, v]) => ({
                    value: k,
                    label: v,
                  }))}
                  buttonClassname="rounded-lg border border-gray-300"
                />
              </TextField.Label>
            </TextField>

            <TextField>
              <TextField.Label>
                <Trans i18nKey={'profile:displayTimeZoneLabel'} />
                <SelectListBox
                  name="timezone"
                  control={control}
                  rules={{ required: true }}
                  items={Object.entries(Timezone).map(([v]) => ({
                    value: v,
                    label: v,
                  }))}
                  buttonClassname="rounded-lg border border-gray-300"
                />
              </TextField.Label>
            </TextField>

            <TextField>
              <TextField.Label>
                <Trans i18nKey={'profile:displayLanguageFluentIn'} />
                <MultiSelectListBox
                  name="languagesFluentIn"
                  control={control}
                  rules={{ required: true }}
                  items={Object.entries(SpokenLanguage).map(([k, v]) => ({
                    value: k,
                    label: v,
                  }))}
                  buttonClassname="rounded-lg border border-gray-300"
                />
              </TextField.Label>
            </TextField>

            <TextField>
              <TextField.Label>
                <Trans i18nKey={'profile:dateOfBirthLabel'} />
                <div className="TextFieldInputContainer">
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        value={value}
                        onChange={onChange}
                        className="w-full rounded-lg border border-gray-300"
                        fromYear={1900} // for example, allowing navigation back to the year 1900
                        toYear={new Date().getFullYear()} // up to the current year
                        captionLayout="dropdown-buttons" // show dropdowns for month/year navigation
                      />
                    )}
                  />
                </div>
              </TextField.Label>
            </TextField>

            <TextField>
              <TextField.Label>
                <Trans i18nKey={'profile:displayYearsOfExperienceLabel'} />
                <SelectListBox
                  name="yearsOfRolePlayExperience"
                  control={control}
                  rules={{ required: true }}
                  items={Object.values(YearsOfExperience).map((v) => ({
                    value: v,
                    label: v,
                  }))}
                  buttonClassname="rounded-lg border border-gray-300"
                />
              </TextField.Label>
            </TextField>

            <TextField>
              <TextField.Label>
                <Trans
                  i18nKey={'profile:displayPreferredImprovementListLabel'}
                />
                <MultiSelectListBox
                  name="improvementList"
                  control={control}
                  rules={{ required: true }}
                  items={Object.entries(ImprovementOptions).map(([k, v]) => ({
                    value: k,
                    label: v,
                  }))}
                  buttonClassname="rounded-lg border border-gray-300"
                />
              </TextField.Label>
            </TextField>
            <TextField>
              <TextField.Label className="flex flex-col">
                <Trans i18nKey={'profile:displayPublicProfile'} />
                <Controller
                  name="public"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SwitchToggle
                      defaultChecked={value}
                      onChange={onChange}
                      label="Public"
                    />
                  )}
                />
              </TextField.Label>
            </TextField>
          </div>
          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:displayAboutMeLabel'} />
              <textarea
                required
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                name={aboutMeControl.name}
                ref={aboutMeControl.ref}
                onBlur={aboutMeControl.onBlur}
                onChange={aboutMeControl.onChange}
                data-cy={'profile-display-name'}
                minLength={2}
                placeholder={''}
              />
            </TextField.Label>
          </TextField>

          <div>
            <Button className={'w-full md:w-auto'} loading={loading}>
              <Trans i18nKey={'profile:updateProfileSubmitLabel'} />
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default UpdateProfileForm;
