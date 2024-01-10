import GroupBanner from './GroupBanner';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useReducer } from 'react';
import GroupScheduleDetails from './GroupScheduleDetails';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import useGroupData from '~/lib/groups/hooks/use-group-data';
import ScheduleForm from '../schedules/ScheduleForm';
import { Schedule, ModalState } from '~/lib/groups/types/group';
import { useFetchGroupScheduleData } from '~/lib/groups/hooks/schedules/use-fetch-group-schedule';
import ScheduleConfirmModal from '../schedules/ScheduleConfirmModal';
import EmptyData from '../EmptyData';
import MeetingDetailsModal from '../schedules/MeetingDetailsModal';
import Modal from '~/core/ui/Modal';
import { Trans } from 'react-i18next';
import Button from '~/core/ui/Button';
import Breadcrumbs from '~/core/ui/Breadcrumbs';

type InitialStateType = {
  modalState: ModalState | null;
  selectedSchedule: Schedule | null;
};
const initialState: InitialStateType = {
  modalState: null,
  selectedSchedule: null,
};

const reducer = (state: InitialStateType, action: any) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        modalState: action.modalState,
        selectedSchedule: action.selectedSchedule,
      };
    case 'CLOSE_MODAL':
      return { ...state, modalState: null, selectedSchedule: null };
    default:
      throw new Error('Invalid action type');
  }
};
const GroupDetailsPageContainer: React.FCC = () => {
  const {
    query: { id },
  } = useRouter();
  const groupId = id as string;
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleButtonClick = useCallback(
    (modalState: ModalState, selectedSchedule: Schedule | null) => {
      dispatch({ type: 'OPEN_MODAL', modalState, selectedSchedule });
    },
    []
  );

  const handleCloseModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const groupData = useGroupData(groupId);
  const { isOwner, isMember } = groupData;
  const { data } = useFetchGroupScheduleData(groupId);
  // collect all the schedules JSON data
  const schedules = useMemo(() => {
    return data?.docs?.map((doc) => doc.data()) ?? [];
  }, [data]);

  return (
    <div>
      <Breadcrumbs />
      <GroupBanner groupData={groupData} />
      <div className="container mt-6 max-w-2xl px-4 bg-white sm:rounded-lg sm:shadow pb-3">
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Scheduled Meetings
              </h3>
            </div>
            {isOwner ? (
              <div className="ml-4 mt-2 flex-shrink-0">
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleButtonClick('create', null)}
                  >
                    <CalendarDaysIcon className="mr-2 h-6 w-6" />
                    Add Event
                  </Button>
                  <Modal
                    isOpen={
                      state.modalState === 'create' ||
                      state.modalState === 'edit'
                    }
                    setIsOpen={() => handleCloseModal()}
                    heading={
                      <Trans
                        i18nKey={
                          !state.selectedSchedule
                            ? 'group:createGroupScheduleModalHeading'
                            : 'group:updateGroupScheduleModalHeading'
                        }
                      />
                    }
                    size="2xl"
                  >
                    <ScheduleForm
                      selectedSchedule={state.selectedSchedule}
                      groupId={groupId}
                      groupSchedules={schedules}
                      onCreate={() => handleCloseModal()}
                    />
                  </Modal>
                  {!!state.selectedSchedule ? (
                    <ScheduleConfirmModal
                      groupId={groupId}
                      selectedScheduleId={state.selectedSchedule.id}
                      isOpen={state.modalState === 'delete'}
                      setIsOpen={() => handleCloseModal()}
                    />
                  ) : null}
                </>
              </div>
            ) : null}
          </div>
        </div>
        {!schedules.length ? (
          <EmptyData title="No meeting scheduled yet." />
        ) : (
          // <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <ol
            role="list"
            className="divide-y divide-gray-400 text-sm leading-6 text-gray-500"
          >
            {schedules.map((schedule, idx: number) => (
              <GroupScheduleDetails
                key={`${schedule.id}_${idx}`}
                schedule={schedule}
                isOwner={isOwner}
                isMember={isMember}
                handleButtonClick={handleButtonClick}
              />
            ))}
            {!!state.selectedSchedule ? (
              <MeetingDetailsModal
                isOpen={state.modalState === 'view'}
                setIsOpen={() => handleCloseModal()}
                selectedSchedule={state.selectedSchedule}
              />
            ) : null}
          </ol>
          // </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetailsPageContainer;
