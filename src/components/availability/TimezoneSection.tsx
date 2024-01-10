import React from 'react';
import TimezonePicker from '~/components/availability/TimezonePicker';
import { useFormContext, Controller } from 'react-hook-form';
import { Timezone } from '~/core/session/types/role-play-tribe';

const TimezoneSection = () => {
  const { control, setValue, watch } = useFormContext<{ timezone: Timezone }>();
  const formValues = watch();

  return (
    <div>
      <Controller
        control={control}
        name={'timezone'}
        rules={{
          required: 'Please select timezone.',
        }}
        render={() => (
          <TimezonePicker
            value={formValues?.timezone}
            onChange={(value) => setValue('timezone', value as Timezone)}
          />
        )}
      />
    </div>
  );
};

export default TimezoneSection;
