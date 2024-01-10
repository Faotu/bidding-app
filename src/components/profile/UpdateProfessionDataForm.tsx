import { useEffect } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import toaster from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import { useUpdateProfile } from '~/lib/profile/hooks/use-update-profile';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import {
  ProfileInfo,
  UserProfessionalData,
} from '~/core/session/types/user-data';
import {
  YearsOfExperience,
  PreferredRolePlayDuration,
  PreferredSessionsPerWeek,
  RolePlayLevel,
} from '~/core/session/types/role-play-tribe';
import SelectListBox from '../SelectListBox';

function UpdateProfessionalDataForm({
  profile,
  onUpdate,
}: {
  profile: UserProfessionalData;
  onUpdate: (user: Partial<ProfileInfo>) => void;
}) {
  const [updateProfile, { loading }] = useUpdateProfile();

  const { t } = useTranslation();

  const currentYearsOfIndustryExperience =
    profile?.yearsOfIndustryExperience ?? YearsOfExperience.ZeroToThree;
  const currentTransactionsLastTwelveMonths =
    profile?.transactionsLastTwelveMonths ?? 1;
  const currentBrokerageName = profile?.brokerageName ?? '';
  const currentSelfAssessedRolePlayLevel =
    profile?.selfAssessedRolePlayLevel ?? RolePlayLevel.Beginner;
  const currentPreferredSessionsPerWeek =
    profile?.preferredSessionsPerWeek ?? PreferredSessionsPerWeek.OneToThree;
  const currentPreferredRolePlayDuration =
    profile?.preferredRolePlayDuration ??
    PreferredRolePlayDuration.FifteenMinutes;

  const { register, handleSubmit, reset, setValue, control } = useForm({
    defaultValues: {
      yearsOfIndustryExperience: currentYearsOfIndustryExperience,
      transactionsLastTwelveMonths: currentTransactionsLastTwelveMonths,
      brokerageName: currentBrokerageName,
      selfAssessedRolePlayLevel: currentSelfAssessedRolePlayLevel,
      preferredSessionsPerWeek: currentPreferredSessionsPerWeek,
      preferredRolePlayDuration: currentPreferredRolePlayDuration,
    },
  });

  const onSubmit = async (values: UserProfessionalData) => {
    const info = {
      yearsOfIndustryExperience: values.yearsOfIndustryExperience,
      transactionsLastTwelveMonths: values.transactionsLastTwelveMonths,
      brokerageName: values.brokerageName,
      selfAssessedRolePlayLevel: values.selfAssessedRolePlayLevel,
      preferredSessionsPerWeek: values.preferredSessionsPerWeek,
      preferredRolePlayDuration: values.preferredRolePlayDuration,
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

  const transactionsLastTwelveMonthsControl = register(
    'transactionsLastTwelveMonths',
    {
      value: currentTransactionsLastTwelveMonths,
    }
  );
  const brokerageNameControl = register('brokerageName', {
    value: currentBrokerageName,
  });

  useEffect(() => {
    reset({
      yearsOfIndustryExperience: currentYearsOfIndustryExperience ?? '',
      transactionsLastTwelveMonths: currentTransactionsLastTwelveMonths ?? '',
      brokerageName: currentBrokerageName ?? '',
      selfAssessedRolePlayLevel: currentSelfAssessedRolePlayLevel ?? '',
      preferredSessionsPerWeek: currentPreferredSessionsPerWeek ?? '',
      preferredRolePlayDuration: currentPreferredRolePlayDuration ?? '',
    });
  }, [
    currentYearsOfIndustryExperience,
    currentTransactionsLastTwelveMonths,
    currentBrokerageName,
    currentSelfAssessedRolePlayLevel,
    currentPreferredSessionsPerWeek,
    currentPreferredRolePlayDuration,
    reset,
  ]);

  return (
    <>
      <form data-cy={'update-profile-form'} onSubmit={handleSubmit(onSubmit)}>
        <div className={'flex flex-col space-y-4'}>
          {/* Professional Data */}
          <TextField>
            <TextField.Label>
              <Trans
                i18nKey={'profile:displayYearsOfIndustryExperienceLabel'}
              />
              <SelectListBox
                name="yearsOfIndustryExperience"
                control={control}
                rules={{ required: true }}
                items={Object.values(YearsOfExperience).map((v) => ({
                  value: v,
                  label: v,
                }))}
                buttonClassname={'rounded-lg border border-gray-300'}
              />
            </TextField.Label>
          </TextField>
          <TextField>
            <TextField.Label>
              <Trans
                i18nKey={'profile:displayTransactionsLastTwelveMonthsLabel'}
              />
              <TextField.Input
                {...transactionsLastTwelveMonthsControl}
                type="number"
                required
                data-cy={'profile-display-name'}
                minLength={2}
                placeholder={''}
              />
            </TextField.Label>
          </TextField>
          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:displayBrokerageName'} />
              <TextField.Input
                {...brokerageNameControl}
                required
                type="text"
                data-cy={'profile-display-name'}
                minLength={2}
                placeholder={''}
              />
            </TextField.Label>
          </TextField>
          <TextField>
            <TextField.Label>
              <Trans
                i18nKey={'profile:displaySelfAssessedRolePlayLevelLabel'}
              />
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

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:displayPreferredSessionsPerWeekLabel'} />
              <SelectListBox
                name="preferredSessionsPerWeek"
                control={control}
                rules={{ required: true }}
                items={Object.values(PreferredSessionsPerWeek).map(
                  (v) => ({
                    value: v,
                    label: v,
                  })
                )}
                buttonClassname="rounded-lg border border-gray-300"
              />
            </TextField.Label>
          </TextField>

          <TextField>
            <TextField.Label>
              <Trans
                i18nKey={'profile:displayPreferredRolePlayDurationLabel'}
              />
              <SelectListBox
                name="preferredRolePlayDuration"
                control={control}
                rules={{ required: true }}
                items={Object.values(PreferredRolePlayDuration).map(
                  (v) => ({
                    value: v,
                    label: v,
                  })
                )}
                buttonClassname="rounded-lg border border-gray-300"
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
export default UpdateProfessionalDataForm;
