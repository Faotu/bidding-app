import React from 'react';
import ReactDatetime, { DatetimepickerProps } from 'react-datetime';

const DateTimePicker: React.FC<
  {
    value: Date;
    onChange: (value: string | Date) => void;
    required?: boolean;
  } & DatetimepickerProps
> = ({ value, onChange, required = false, ...datetimepickerprops }) => {
  return (
    <ReactDatetime
      value={value}
      onChange={onChange}
      inputProps={{
        placeholder: 'Select date and time',
        required,
      }}
      {...datetimepickerprops}
    />
  );
};

export default DateTimePicker;
