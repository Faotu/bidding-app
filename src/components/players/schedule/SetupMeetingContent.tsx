// Third-party libs
import { Calendar as BigCalendar, Views } from 'react-big-calendar';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';
import { format, parse } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

// Components
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import SelectListBox from '../../SelectListBox';
import { DatePicker } from '~/core/ui/DatePicker';

// Hooks
import { useCreateEvent } from '~/lib/players/hooks/use-create-event';

// Types and Utils
import {
  AvailabilityDay,
  Schedule,
  UserData,
} from '~/core/session/types/user-data';
import { EventData } from '~/lib/players/types/event';
import {
  MeetingReducerAction,
  MeetingReducerState,
} from '~/lib/players/types/meeting';
import {
  availableTopics,
  transformUnavailbilityToBlockedEvents,
} from './utils';

import { useUserId } from '~/core/hooks/use-user-id';
import {
  daysOfWeek,
  getDaysMinMaxTime,
  localizer,
} from '~/core/generic/datetime-utils';

// Styling
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar } from '~/core/ui/Calendar';

const initialState: MeetingReducerState = {
  events: [],
};

const reducer = (
  state: MeetingReducerState,
  action: MeetingReducerAction
): MeetingReducerState => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
      };
    default:
      return state;
  }
};

const defaultValues = {
  title: 'FSBO (For Sales By Owner)',
  isUnavailable: false,
};

const SetupMeetingContent: React.FCC<{
  player: UserData;
  playerEvents: EventData[];
  onScheduleMeeting?: (data: WithId<EventData>) => void;
}> = ({
  player: { userId, availability },
  playerEvents = [],
  onScheduleMeeting,
}) => {
  // Translation and create event hook
  const { t } = useTranslation('event');
  const [createEvent, createEventState] = useCreateEvent();
  const { loading, data: newEvent } = createEventState;
  const currentUserId = useUserId();

  const [state, dispatch] = useReducer(reducer, initialState);
  // State
  const prevStartDate = useRef<number>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { handleSubmit, watch, setValue, control } = useForm<EventData>({
    defaultValues,
  });
  const formValues = watch();

  const daysMinMaxTime = useMemo(
    () => getDaysMinMaxTime(availability),
    [availability]
  );

  // Effects to update slots and schedule meeting
  useEffect(() => {
    // If the start date has changed, update the events
    if (prevStartDate.current !== formValues.start?.getDate()) {
      prevStartDate.current = formValues.start?.getDate();
      setIsCalendarOpen(false);
      const day = daysOfWeek[formValues.start.getDay()];
      const events = [
        ...transformUnavailbilityToBlockedEvents(
          formValues.start,
          availability,
          day,
          daysMinMaxTime
        ),
        ...playerEvents.map((event) => ({
          title: event.createdBy === currentUserId ? event.title : 'Booked',
          start: event.start,
          end: event.end,
          isUnavailable: true,
        })),
      ];
      dispatch({ type: 'SET_EVENTS', payload: events });
    }
  }, [
    formValues,
    availability,
    daysMinMaxTime,
    state.events,
    playerEvents,
    currentUserId,
  ]);

  useEffect(() => {
    if (newEvent && onScheduleMeeting) {
      onScheduleMeeting(newEvent);
    }
  }, [newEvent, onScheduleMeeting]);

  const inactiveDays = useMemo(
    () =>
      Object.keys(availability).reduce((acc: string[], day: string) => {
        if (!availability[day as AvailabilityDay].isActive) {
          acc.push(day);
        }
        return acc;
      }, []),
    [availability]
  );

  const [min, max] = useMemo(() => {
    if (!formValues.start) {
      return [undefined, undefined];
    }
    const day = daysOfWeek[formValues.start.getDay()];
    return daysMinMaxTime[day];
  }
  , [formValues.start, daysMinMaxTime]);
  /**
   * Disable days that are not active OR are in the past
   */
  const disableDayMatcher = useCallback(
    (day: Date) => {
      const dayOfWeek = daysOfWeek[day.getDay()];
      const isInactiveDay = inactiveDays.includes(dayOfWeek);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPastDay = day < today;
      return isInactiveDay || isPastDay;
    },
    [inactiveDays]
  );

  const isOverlapping = useCallback(
    (start: Date, end: Date) => {
      return playerEvents.some((event: EventData) => {
        // Event overlaps when new event start time is in between the existing event times
        const startDate = event.start;
        const endDate = event.end;
        return (
          (start >= startDate && start < endDate) ||
          // or the new event end time is in between the existing event times
          (end > startDate && end <= endDate) ||
          // or the new event completely encloses the existing event times
          (start <= startDate && end >= endDate)
        );
      });
    },
    [playerEvents]
  );

  const handleScheduleMeeting = useCallback(
    async (data: EventData) => {
      const { title, start, end } = data;
      if (!start) {
        return;
      }
      if (isOverlapping(start, end)) {
        return toast.error(t(`event:overlappingEventError`));
      }
      if (!start || !end) {
        return toast.error(t(`event:invalidEventError`));
      }
      const promise = createEvent({
        title: title,
        start,
        end,
        playerId: userId,
        isUnavailable: true,
      });
      await toast.promise(promise, {
        success: t(`event:createEventSuccess`),
        error: t(`event:createEventError`),
        loading: t(`event:createEventLoading`),
      });
    },
    [createEvent, userId, t, isOverlapping]
  );

  const handleSelectSlot = useCallback(
    ({ start, end, title }: { start: Date; end: Date; title: string }) => {
      const schedulesForDay =
        availability[daysOfWeek[start.getDay()]].schedules;
      const isInAllowedSchedule = schedulesForDay.some((schedule: Schedule) => {
        const from = parse(schedule.from, 'h:mmaa', start);
        const to = parse(schedule.to, 'h:mmaa', end);
        return start >= from && end <= to;
      });

      if (!isInAllowedSchedule) {
        return toast.error(t(`event:timeNotAvailableError`));
      }

      if (!isOverlapping(start, end)) {
        setValue('start', start);
        setValue('end', end);
        // add new event to the reducer state while overriding the previously added slot
        dispatch({
          type: 'SET_EVENTS',
          payload: [
            ...state.events.filter((event) => event.isUnavailable),
            {
              title,
              start,
              end,
              isUnavailable: false,
            },
          ],
        });
      } else {
        toast.error(t(`event:overlappingEventError`));
      }
    },
    [availability, isOverlapping, setValue, state.events, t]
  );

  return (
    <form
      onSubmit={handleSubmit(handleScheduleMeeting)}
      className={'mt-4 flex w-full flex-1'}
    >
      <div className={'flex flex-1 flex-col'}>
        <div className="mb-16 grid grid-cols-1 gap-6">
          <TextField>
            <TextField.Label>
              <span className={'text-gray-700'}>
                <Trans i18nKey="event:selectTopicLabel" />
              </span>
              <SelectListBox
                name="title"
                control={control}
                rules={{ required: true }}
                items={availableTopics.map((topic) => ({
                  value: topic.title,
                  label: topic.title,
                  description: topic.description,
                }))}
                buttonClassname={'rounded-lg border border-gray-300'}
              />
            </TextField.Label>
          </TextField>
          <TextField>
            <TextField.Label>
              <span className={'text-gray-700'}>
                <Trans i18nKey="event:selectDateLabel" />
              </span>
              <Controller
                name="start"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Calendar
                  mode="single"
                  selected={typeof value === 'string' ? new Date(value) : value}
                  onSelect={onChange as any}
                  initialFocus
                  disabled={disableDayMatcher}
                />
                )}
              />
            </TextField.Label>
          </TextField>
          <div className="min-h-[40vh] rounded-lg border border-gray-200 bg-slate-100 p-3">
            {formValues.start ? (
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
                  events={state.events}
                  defaultView={Views.DAY}
                  views={[Views.DAY]}
                  toolbar={false}
                  min={min}
                  max={max}
                  onSelectSlot={({ start, end }) =>
                    handleSelectSlot({ start, end, title: formValues.title })
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className='text-gray-500 text-sm'>Select a date to view available times</p>
              </div>
            )}
          </div>
        </div>
        <br />
        <div className="fixed bottom-4 right-8 flex flex-1">
          <Button block type="submit" loading={loading}>
            <span className={'flex items-center space-x-2'}>
              <Trans i18nKey="event:createEventSubmitLabel" />
              <ArrowRightIcon className={'h-5'} />
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SetupMeetingContent;
