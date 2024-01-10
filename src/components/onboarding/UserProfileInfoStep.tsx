import { Controller, useForm } from 'react-hook-form';
import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import SubHeading from '~/core/ui/SubHeading';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { UserProfileData } from '~/core/session/types/user-data';
import { User } from 'firebase/auth';
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
import classNames from 'classnames';

export const UserProfileInfoStep: React.FCC<{
  onSubmit: (data: UserProfileData) => void;
  userData: User | null;
  userProfileFormData?: UserProfileData;
}> = ({ onSubmit, userData, userProfileFormData }) => {
  const displayName = userData?.displayName ?? userData?.email ?? '';
  const { control, formState, register, handleSubmit, watch } =
    useForm<UserProfileData>({
      defaultValues: {
        languagesFluentIn: userProfileFormData?.languagesFluentIn || [
          SpokenLanguage.EN,
        ],
        timezone: userProfileFormData?.timezone || Timezone['US/Pacific'],
        firstLanguage: userProfileFormData?.firstLanguage || SpokenLanguage.EN,
        aboutMe: userProfileFormData?.aboutMe || '',
        dateOfBirth: userProfileFormData?.dateOfBirth || undefined,
        gender: userProfileFormData?.gender || undefined,
        yearsOfRolePlayExperience:
          userProfileFormData?.yearsOfRolePlayExperience ||
          YearsOfExperience.ZeroToThree,
        improvementList: userProfileFormData?.improvementList || [
          ImprovementOptions.BuildConfidnece,
        ],
        personalityType: userProfileFormData?.personalityType || [
          PersonalityType.D,
        ],
        displayName: userProfileFormData?.displayName || displayName,
        public: userProfileFormData?.public || true,
      },
    });

  const { errors } = formState;
  const displayNameValue = watch('displayName');

  const aboutMe = register('aboutMe', { required: true });
  const displayNameControl = register('displayName', { required: true });

  console.log('object entries', Object.entries(ImprovementOptions));
  console.log('object keys', Object.keys(ImprovementOptions));
  console.log('object values', Object.values(ImprovementOptions));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-1 flex-col space-y-6"
    >
      <div className="flex flex-col space-y-1.5">
        <Heading type={2}>Hi, {displayNameValue}!</Heading>
        <SubHeading>Tell us about yourself 😃</SubHeading>
      </div>

      <div className="flex flex-1 flex-col space-y-2">
        <div className="grid grid-cols-1 gap-4">
          <TextField>
            <TextField.Label>
              What is your name?
              <TextField.Input
                {...displayNameControl}
                required
                placeholder="John Doe"
                className={classNames(
                  'rounded-lg border border-gray-300',
                  errors.displayName && 'border-red-300'
                )}
              />
            </TextField.Label>
          </TextField>
        </div>
        <div className="mb-[15px] mt-[20px] grid grid-cols-1 gap-[20px] lg:grid-cols-2">
          {/* First Language */}
          <TextField>
            <TextField.Label>
              What is your first language?
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
              What is your personality type?
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
          {/* Languages Fluent In */}
          <TextField>
            <TextField.Label>
              What languages are you fluent in?
              <MultiSelectListBox
                name="languagesFluentIn"
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

          {/* Timezone */}
          <TextField>
            <TextField.Label>
              What is your timezone?
              <SelectListBox
                name="timezone"
                control={control}
                rules={{ required: true }}
                items={Object.values(Timezone).map((v) => ({
                  value: v,
                  label: v,
                }))}
                buttonClassname="rounded-lg border border-gray-300"
              />
            </TextField.Label>
          </TextField>
          {/* Date of Birth */}
          <TextField>
            <TextField.Label>
              When were you born?
              <div className="TextFieldInputContainer">
                <Controller
                  name="dateOfBirth"
                  control={control}
                  rules={{ required: 'Please enter your date of birth' }}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      value={value}
                      onChange={onChange as any}
                      className={classNames(
                        'TextFieldInput w-72 flex-1 rounded-lg border border-gray-300 py-2 pl-3',
                        errors.dateOfBirth && 'border-red-300'
                      )}
                      fromYear={1900} // for example, allowing navigation back to the year 1900
                      toYear={new Date().getFullYear()} // up to the current year
                      captionLayout="dropdown" // show dropdowns for month/year navigation
                    />
                  )}
                />
              </div>
            </TextField.Label>
          </TextField>

          {/* Gender */}
          <TextField>
            <TextField.Label>
              What is your gender?
              <SelectListBox
                name="gender"
                control={control}
                rules={{ required: true }}
                items={Object.values(Gender).map((v) => ({
                  value: v,
                  label: v,
                }))}
                buttonClassname={classNames(
                  'rounded-lg border border-gray-300',
                  errors.gender && 'border-red-300'
                )}
              />
            </TextField.Label>
          </TextField>
          {/* Years of Role Play Experience */}
          <TextField>
            <TextField.Label>
              Years of experience?
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
              What do you want to improve in?
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
        </div>
        <div className="grid grid-cols-1 gap-[15px]">
          {/* About Me */}
          <TextField>
            <TextField.Label>
              Write a little about yourself.
              <textarea
                required
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-0 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="I like challenging myself"
                ref={aboutMe.ref}
                onBlur={aboutMe.onBlur}
                onChange={aboutMe.onChange}
                name={aboutMe.name}
              />
            </TextField.Label>
          </TextField>
          <TextField>
            <TextField.Label className="my-2 flex items-center justify-between">
              Allow users to find you on RolePlayTribe
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
        <div>
          <Button type="submit">
            <span className="flex items-center space-x-2">
              <span>Continue</span>
              <ArrowRightIcon className="h-5" />
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
};
