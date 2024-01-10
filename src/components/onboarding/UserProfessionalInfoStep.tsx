import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import SubHeading from '~/core/ui/SubHeading';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { UserProfessionalData } from '~/core/session/types/user-data';
import { useForm } from 'react-hook-form';
import {
  YearsOfExperience,
  PreferredRolePlayDuration,
  PreferredSessionsPerWeek,
  RolePlayLevel,
} from '~/core/session/types/role-play-tribe';
import SelectListBox from '../SelectListBox';

export interface UserProfessionalInfoStepData {
  organization: string;
}

export const UserProfessionalInfoStep: React.FCC<{
  onSubmit: (data: UserProfessionalData) => void;
  userProfessionalFormData?: UserProfessionalData;
}> = ({ onSubmit, userProfessionalFormData }) => {
  const { control, register, handleSubmit } = useForm<UserProfessionalData>({
    defaultValues: {
      yearsOfIndustryExperience:
        userProfessionalFormData?.yearsOfIndustryExperience ||
        YearsOfExperience.ZeroToThree,
      transactionsLastTwelveMonths:
        userProfessionalFormData?.transactionsLastTwelveMonths || 1,
      brokerageName: userProfessionalFormData?.brokerageName || '',
      selfAssessedRolePlayLevel:
        userProfessionalFormData?.selfAssessedRolePlayLevel ||
        RolePlayLevel.Beginner,
      preferredSessionsPerWeek:
        userProfessionalFormData?.preferredSessionsPerWeek ||
        PreferredSessionsPerWeek.OneToThree,
      preferredRolePlayDuration:
        userProfessionalFormData?.preferredRolePlayDuration ||
        PreferredRolePlayDuration.TwentyMinutes,
    },
  });

  const brokerageName = register('brokerageName', { required: true });

  const transactionsLastTwelveMonths = register(
    'transactionsLastTwelveMonths',
    { required: true }
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={'flex w-full flex-1 flex-col space-y-6'}
    >
      <div className={'flex flex-col space-y-1.5'}>
        <SubHeading>Lets get professional 👩‍💼</SubHeading>
      </div>

      <div className={'flex flex-1 flex-col space-y-2'}>
        <div className="grid grid-cols-1 gap-4">
          {/* Years of Role Play Experience */}
          <TextField.Label>
            How many years of role play experience do you have?
            <SelectListBox
              name="yearsOfIndustryExperience"
              control={control}
              rules={{ required: true }}
              items={Object.values(YearsOfExperience).map((v) => ({
                value: v,
                label: v,
              }))}
              buttonClassname={'rounded-lg border border-gray-200'}
              containerClassName={'w-[100%]'}
            />
          </TextField.Label>

          {/* Brokerage Name */}
          <TextField>
            <TextField.Label>
              What is your brokerage name?
              <TextField.Input
                {...brokerageName}
                required
                type="text"
                placeholder={'Your brokerage'}
              />
            </TextField.Label>
          </TextField>

          {/* Transactions Last Twelve Months */}
          <TextField>
            <TextField.Label>
              How many transactions in the last 12 months?
              <TextField.Input
                {...transactionsLastTwelveMonths}
                required
                type="number"
                placeholder={'5'}
              />
            </TextField.Label>
          </TextField>

          {/* Self assessed role play level */}
          <TextField>
            <TextField.Label>
              How do you rank yourself?
              <SelectListBox
                name="selfAssessedRolePlayLevel"
                control={control}
                rules={{ required: true }}
                items={Object.values(RolePlayLevel).map((v) => ({
                  value: v,
                  label: v,
                }))}
                buttonClassname="rounded-lg border border-gray-300"
              />
            </TextField.Label>
          </TextField>
          {/* Preferresed sessions per week */}
          <TextField>
            <TextField.Label>
              Sessions per week?
              <SelectListBox
                name="preferredSessionsPerWeek"
                control={control}
                rules={{ required: true }}
                items={Object.values(PreferredSessionsPerWeek).map(
                  (v) => ({ value: v, label: v })
                )}
                buttonClassname="rounded-lg border border-gray-300"
              />
            </TextField.Label>
          </TextField>

          {/* Preferred role play duration */}
          <TextField>
            <TextField.Label>
              How long do you prefer to play for?
              <SelectListBox
                name="preferredRolePlayDuration"
                control={control}
                rules={{ required: true }}
                items={Object.values(PreferredRolePlayDuration).map(
                  (v) => ({ value: v, label: v })
                )}
                buttonClassname="rounded-lg border border-gray-300"
              />
            </TextField.Label>
          </TextField>
        </div>

        <div>
          <Button type={'submit'}>
            <span className={'flex items-center space-x-2'}>
              <span>Continue</span>
              <ArrowRightIcon className={'h-5'} />
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
};
