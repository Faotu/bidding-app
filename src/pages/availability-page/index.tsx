import React, { useEffect } from 'react';
import AvailabilityDaySchedules from '~/components/availability/AvailabilityDayShedules';
import { useForm, FormProvider } from 'react-hook-form';
import { initialDayData } from '~/components/availability/utils';
import TimezoneSection from '~/components/availability/TimezoneSection';
import SubHeading from '~/core/ui/SubHeading';
import Button from '~/core/ui/Button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { AvailabilityFormData } from '~/core/session/types/user-data';
import { Timezone } from '~/core/session/types/role-play-tribe';

interface AvailabilityPageProps {
  data?: AvailabilityFormData | null;
  updateMode?: boolean;
  onSubmit(formData: AvailabilityFormData | undefined): void;
}

const AvailabilityPage: React.FC<AvailabilityPageProps> = (props) => {
  const { updateMode, data } = props;

  const formMethods = useForm<AvailabilityFormData>({
    mode: 'onChange',
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
      availability: {
        saturday: initialDayData,
        sunday: initialDayData,
        monday: initialDayData,
        tuesday: initialDayData,
        wednesday: initialDayData,
        thursday: initialDayData,
        friday: initialDayData,
      },
    },
  });
  const { setValue, watch } = formMethods;
  const formValues = watch();

  const handleSubmit = () => {
    if (props?.onSubmit) {
      props?.onSubmit(formValues);
    }
  };

  useEffect(() => {
    if (data) {
      setValue('timezone', data?.timezone);
      setValue('availability', data?.availability);
    }
  }, [data, setValue]);

  return (
    <>
      <div className={'flex w-full flex-1 flex-col space-y-6'}>
        {!updateMode && (
          <div className={'flex flex-col space-y-1.5'}>
            <SubHeading>Set your availabilities 📅</SubHeading>
            <p>
              Role Play Tribe uses integrated calendar to schedule your ideal
              role play times.
            </p>
          </div>
        )}

        <div>
          <div
            className={classNames('flex flex-col gap-[15px]', {
              'border-gray rounded-[10px] border p-[20px] pr-[40px]':
                !updateMode,
            })}
          >
            <FormProvider {...formMethods}>
              <TimezoneSection />
              <AvailabilityDaySchedules day={'saturday'} />
              <AvailabilityDaySchedules day={'sunday'} />
              <AvailabilityDaySchedules day={'monday'} />
              <AvailabilityDaySchedules day={'tuesday'} />
              <AvailabilityDaySchedules day={'wednesday'} />
              <AvailabilityDaySchedules day={'thursday'} />
              <AvailabilityDaySchedules day={'friday'} />
            </FormProvider>
          </div>
        </div>
        <div className={'flex flex-1 flex-col space-y-2'}>
          <div className="grid grid-cols-1 gap-4">
            <Button onClick={handleSubmit} size={'large'}>
              <span className={'flex items-center space-x-2'}>
                <span>Save</span>
                {!updateMode && <ArrowRightIcon className={'h-5'} />}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AvailabilityPage;
