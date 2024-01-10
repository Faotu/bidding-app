import React from 'react';
import SwitchToggle from '~/components/SwitchToggle';
import TimePicker from '~/components/availability/TimePicker';
import {
  availabilityDayLabels,
  validateTimeOverlaps,
  getNextHour,
  initialDayData,
  validateRangeSelection,
} from '~/components/availability/utils';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { AddIcon, DeleteIcon } from '~/components/availability/Icons';
import CopyButton from '~/components/availability/CopyButton';
import classNames from 'classnames';
import {
  AvailabilityDay,
  AvailabilityFormData,
} from '~/core/session/types/user-data';

interface AvailabilityDaySchedulesProps {
  day: AvailabilityDay;
}

const AvailabilityDaySchedules: React.FC<AvailabilityDaySchedulesProps> = (
  props
) => {
  const { day } = props;
  const {
    control,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useFormContext<AvailabilityFormData>();

  const { append, remove } = useFieldArray({
    control,
    name: `availability.${day}.schedules`,
  });

  const formValues = watch();

  const addNewSchedule = () => {
    const lastRow =
      formValues.availability[day]?.schedules[
        formValues.availability[day]?.schedules?.length - 1
      ];
    const lastToTime = lastRow?.to;
    const nextToTime = getNextHour(lastToTime as any);
    append({
      from: lastToTime,
      to: nextToTime,
    });

    setTimeout(() => {
      trigger();
    });
  };

  const deleteSchedule = (index: number) => {
    remove(index);

    setTimeout(() => {
      trigger();
    });
  };

  const toggleDay = (checked: boolean) => {
    setValue(`availability.${day}.schedules`, initialDayData?.schedules);
    setValue(`availability.${day}.isActive`, checked);

    setTimeout(() => {
      trigger();
    });
  };

  const validateFromTime = (value: string, index: number) => {
    let passed = true;
    const restSchedules = [...(formValues.availability[day]?.schedules ?? [])];

    restSchedules?.map((item, scheduleIndex) => {
      if (index !== scheduleIndex) {
        if (!validateTimeOverlaps(item?.from, item?.to, value, true)) {
          passed = false;
        }
        const currentSchedule =
          formValues.availability[day]?.schedules?.[index];
        if (
          !validateTimeOverlaps(
            currentSchedule?.from,
            currentSchedule?.to,
            item?.from,
            false
          )
        ) {
          passed = false;
        }
      }
    });

    return passed;
  };

  const validateToTime = (value: string, index: number) => {
    let passed = true;
    const restSchedules = [...(formValues.availability[day]?.schedules ?? [])];

    restSchedules?.map((item, scheduleIndex) => {
      if (index !== scheduleIndex) {
        if (!validateTimeOverlaps(item?.from, item?.to, value, false)) {
          passed = false;
        }
      }
    });

    return passed;
  };

  const applySchedulesToOtherDays = (
    copyFrom: AvailabilityDay,
    days: AvailabilityDay[]
  ) => {
    const schedules = formValues.availability[copyFrom]?.schedules ?? [];
    days?.forEach((dayKey) => {
      setValue(`availability.${dayKey}.schedules`, schedules);
    });
  };

  return (
    <>
      <div className={'flex flex-col gap-[10px]'}>
        {formValues.availability[day]?.schedules?.map((fieldItem, index) => (
          <div key={index} className={'flex flex-col gap-[3px]'}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 flex items-center justify-between md:col-span-12 lg:col-span-3">
                {index === 0 && (
                  <>
                    <div className={'flex items-center gap-[10px]'}>
                      <Controller
                        control={control}
                        name={`availability.${day}.isActive`}
                        render={() => (
                          <SwitchToggle
                            defaultChecked={
                              formValues.availability[day]?.isActive
                            }
                            onChange={toggleDay}
                          />
                        )}
                      />
                      <span className={'text-[14px]'}>
                        {availabilityDayLabels[day]}
                      </span>
                    </div>

                    {formValues.availability[day]?.isActive && (
                      <div className={'inline-block md:inline-block lg:hidden'}>
                        <CopyButton
                          day={day}
                          onClickApply={applySchedulesToOtherDays}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div
                className={
                  'col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-9'
                }
              >
                <div className={'grid grid-cols-12 gap-4'}>
                  <div
                    className={classNames(
                      'relative col-span-10 md:col-span-10 lg:col-span-9',
                      {
                        'h-[auto] lg:h-[41px]':
                          !formValues.availability[day]?.isActive,
                      }
                    )}
                  >
                    {formValues.availability[day]?.isActive && (
                      <>
                        <div className={'flex items-center gap-[10px]'}>
                          <div>
                            <Controller
                              control={control}
                              name={`availability.${day}.schedules.${index}.from`}
                              rules={{
                                validate(value) {
                                  if (!validateFromTime(value, index)) {
                                    return 'Time overlap with another set of times.';
                                  }
                                  return true;
                                },
                              }}
                              render={() => (
                                <TimePicker
                                  value={
                                    formValues.availability[day]?.schedules[
                                      index
                                    ]?.from
                                  }
                                  onChange={(value) => {
                                    setValue(
                                      `availability.${day}.schedules.${index}.from`,
                                      value
                                    );

                                    setTimeout(() => {
                                      trigger();
                                    }, 100);
                                  }}
                                />
                              )}
                            />
                          </div>
                          <div>-</div>
                          <div>
                            <Controller
                              control={control}
                              name={`availability.${day}.schedules.${index}.to`}
                              rules={{
                                validate(value) {
                                  if (
                                    !validateRangeSelection(
                                      formValues.availability[day]?.schedules[
                                        index
                                      ]?.from,
                                      value
                                    )
                                  ) {
                                    return 'Choose an end time later than the start time.';
                                  }

                                  if (!validateToTime(value, index)) {
                                    return 'Time overlap with another set of times.';
                                  }
                                  return true;
                                },
                              }}
                              render={() => (
                                <TimePicker
                                  value={
                                    formValues.availability[day]?.schedules[
                                      index
                                    ]?.to
                                  }
                                  onChange={(value) => {
                                    setValue(
                                      `availability.${day}.schedules.${index}.to`,
                                      value
                                    );
                                    setTimeout(() => {
                                      trigger();
                                    }, 100);
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col-span-2 flex items-center gap-[10px] md:col-span-2 lg:col-span-3">
                    {formValues.availability[day]?.isActive && (
                      <>
                        {index === 0 ? (
                          <>
                            <button
                              className={'rounded p-[6px] hover:bg-[#eeeeee]'}
                              onClick={addNewSchedule}
                            >
                              <AddIcon />
                            </button>

                            <div className={'hidden md:hidden lg:inline-block'}>
                              <CopyButton
                                day={day}
                                onClickApply={applySchedulesToOtherDays}
                              />
                            </div>
                          </>
                        ) : (
                          <button
                            className={'rounded p-[6px] hover:bg-[#eeeeee]'}
                            onClick={() => deleteSchedule(index)}
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 flex items-center gap-[10px]" />
              <div className="relative col-span-6">
                <div className={'px-[5px] text-[13px] text-red-500'}>
                  {errors &&
                    errors.availability &&
                    errors.availability[day]?.schedules?.[index]?.to?.message}
                  {errors.availability &&
                    !errors.availability[day]?.schedules?.[index]?.to
                      ?.message &&
                    errors &&
                    errors.availability &&
                    errors.availability[day]?.schedules?.[index]?.from?.message}
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-[10px]" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AvailabilityDaySchedules;
