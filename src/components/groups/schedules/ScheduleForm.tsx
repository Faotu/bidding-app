import { Calendar as BigCalendar, Views } from 'react-big-calendar';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';
import { format } from 'date-fns';

import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';

import {
  Schedule,
  ScheduleFormType,
  ScheduleReducerAction,
  ScheduleReducerState,
} from '~/lib/groups/types/group';
import { useCreateGroupSchedule } from '~/lib/groups/hooks/schedules/use-create-group-schedule';
import { Controller, useForm } from 'react-hook-form';
import { useUpdateGroupSchedule } from '~/lib/groups/hooks/schedules/use-update-group-schedule';
import { DatePicker } from '~/core/ui/DatePicker';
import If from '~/core/ui/If';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import { localizer } from '~/core/generic/datetime-utils';

// Styling
import 'react-big-calendar/lib/css/react-big-calendar.css';

const initialState: ScheduleReducerState = {
  schedules: [],
};

const reducer = (
  state: ScheduleReducerState,
  action: ScheduleReducerAction
): ScheduleReducerState => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        schedules: action.payload,
      };
    default:
      return state;
  }
};

const ScheduleForm: React.FC<{
  onCreate?: (schedule: Partial<Schedule>) => void;
  groupId: string;
  selectedSchedule: WithId<Schedule> | null;
  groupSchedules: Schedule[];
}> = ({ onCreate, groupId, selectedSchedule, groupSchedules }) => {
  const [createGroupSchedule, { loading, data: newGroupSchedule }] =
    useCreateGroupSchedule();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [updateGroupSchedule] = useUpdateGroupSchedule(groupId);
  const { t } = useTranslation('group');
  const { control, register, handleSubmit, watch, reset, trigger, setValue } =
    useForm<ScheduleFormType>({
      defaultValues: {
        start: new Date(),
      },
    });
  const [state, dispatch] = useReducer(reducer, initialState);
  const [step, setStep] = useState(0);

  const formValues = watch();

  // Report error when user leaves input empty
  const onError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const onSubmit = useCallback(
    async (values: ScheduleFormType) => {
      const { start, end, ...rest } = values;

      if (start >= end) {
        return onError('Please select a valid end time for the meeting');
      }

      const schedule: Schedule = {
        ...rest,
        groupId: groupId,
        startTime: start,
        endTime: end,
        isUnavailable: true,
      };
      // if this exists, perform an update instead
      if (selectedSchedule) {
        await toast.promise(
          updateGroupSchedule({ ...schedule, id: selectedSchedule.id }),
          {
            success: t(`group:updateGroupScheduleSuccess`),
            error: t(`group:updateGroupScheduleError`),
            loading: t(`group:updateGroupScheduleLoading`),
          }
        );
      } else {
        // save a new document
        await toast.promise(createGroupSchedule(schedule), {
          success: t(`group:createGroupScheduleSuccess`),
          error: t(`group:createGroupScheduleError`),
          loading: t(`group:createGroupScheduleLoading`),
        });
      }
    },
    [
      createGroupSchedule,
      onError,
      t,
      groupId,
      selectedSchedule,
      updateGroupSchedule,
    ]
  );

  useEffect(() => {
    if (newGroupSchedule && onCreate) {
      onCreate(newGroupSchedule);
    }
  }, [newGroupSchedule, onCreate]);

  useEffect(() => {
    if (selectedSchedule) {
      const { startTime, endTime } = selectedSchedule;
      reset({
        ...selectedSchedule,
        start: startTime,
        end: endTime,
      });
      trigger('start');
    }
  }, [selectedSchedule, reset, trigger]);

  useEffect(() => {
    setIsCalendarOpen(false);
  }, [formValues.start]);

  const topicControl = register('topic', { required: true });
  const descriptionControl = register('description');
  const locationControl = register('location');

  const isOverlapping = useCallback(
    (start: Date, end: Date) => {
      return groupSchedules.some((schedule: Schedule) => {
        // Event overlaps when new schedule start time is in between the existing schedule times
        const startDate = schedule.startTime;
        const endDate = schedule.endTime;
        return (
          (start >= startDate && start < endDate) ||
          // or the new schedule end time is in between the existing schedule times
          (end > startDate && end <= endDate) ||
          // or the new schedule completely encloses the existing schedule times
          (start <= startDate && end >= endDate)
        );
      });
    },
    [groupSchedules]
  );

  const handleSelectSlot = useCallback(
    ({ startTime, endTime }: { startTime: Date; endTime: Date }) => {
      if (!isOverlapping(startTime, endTime)) {
        setValue('start', startTime);
        setValue('end', endTime);
        // add new schedule to the reducer state while overriding the previously added slot
        dispatch({
          type: 'SET_EVENTS',
          payload: [
            ...state.schedules.filter((schedule) => schedule.isUnavailable),
            {
              ...formValues,
              start: startTime,
              end: endTime,
              isUnavailable: false,
            },
          ],
        });
      } else {
        toast.error(t(`event:overlappingEventError`));
      }
    },
    [formValues, isOverlapping, setValue, state.schedules, t]
  );

  return (
    <form
      onSubmit={handleSubmit((value) => {
        return onSubmit(value);
      })}
    >
      <If condition={step === 0}>
        <div className={'flex flex-col space-y-4'}>
          <TextField>
            <TextField.Label>
              <Trans i18nKey={'group:groupScheduleTopicLabel'} />

              <TextField.Input
                data-cy={'create-group-schedule-topic-input'}
                minLength={1}
                required
                placeholder={'ex. To Discuss XYZ'}
                {...topicControl}
              />
            </TextField.Label>
          </TextField>
          <TextField className="flex-grow">
            <TextField.Label>
              <Trans i18nKey={'group:groupScheduleStartTimeLabel'} />
              <div className="TextFieldInputContainer">
                <Controller
                  name="start"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      className="w-full"
                      value={
                        typeof value === 'string' ? new Date(value) : value
                      }
                      onChange={onChange as any}
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                      captionLayout="dropdown-buttons" // show dropdowns for month/year navigation
                    />
                  )}
                />
              </div>
            </TextField.Label>
          </TextField>
          <section>
            <h3 className="mb-4 text-sm font-semibold text-gray-600">
              <Trans i18nKey="event:selectTimeLabel" />{' '}
              <time
                dateTime={
                  formValues.start
                    ? format(formValues.start, 'mm eee, yy')
                    : undefined
                }
              >
                {format(formValues.start, 'MMMM d, yyyy')}
              </time>
            </h3>
            <BigCalendar
              step={15}
              timeslots={4}
              date={formValues.start}
              localizer={localizer}
              defaultDate={formValues.start}
              events={state.schedules}
              defaultView={Views.DAY}
              views={[Views.DAY]}
              min={new Date(0, 0, 0, 8, 0, 0)}
              max={new Date(0, 0, 0, 20, 0, 0)}
              toolbar={false}
              onSelectSlot={({ start, end }) =>
                handleSelectSlot({
                  startTime: start,
                  endTime: end,
                })
              }
              selectable
              eventPropGetter={(event: any) => {
                if (event.isUnavailable) {
                  return {
                    className: 'rbc-background-event',
                  };
                }
                return {
                  className: 'rbc-event',
                };
              }}
            />
          </section>
          <Button type="button" onClick={() => setStep(1)}>
            Next
          </Button>
        </div>
      </If>

      <If condition={step === 1}>
        <div className={'flex flex-col space-y-4'}>
          <div>
            <Button
              type="button"
              color="transparent"
              variant="outline"
              onClick={() => setStep(0)}
            >
              <ArrowLeftCircleIcon className="mr-1 h-5 w-5" />
              Go back
            </Button>
          </div>
          <TextField>
            <TextField.Label>
              <Trans i18nKey={'group:groupScheduleLocationLabel'} />
              <TextField.Input
                data-cy={'create-group-schedule-location-input'}
                minLength={1}
                required
                placeholder={'ex. Video Link or Google Meet Link'}
                {...locationControl}
              />
            </TextField.Label>
          </TextField>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'group:groupDescriptionLabel'} />
              <textarea
                required
                rows={6}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder={'ex. Tell us what the meeting is about'}
                {...descriptionControl}
              />
            </TextField.Label>
          </TextField>

          <Button
            data-cy={'confirm-create-group-button'}
            block
            loading={loading}
          >
            <Trans
              i18nKey={
                !selectedSchedule
                  ? 'group:createGroupScheduleSubmitLabel'
                  : 'group:updateGroupScheduleSubmitLabel'
              }
            />
          </Button>
        </div>
      </If>
    </form>
  );
};

export default ScheduleForm;
