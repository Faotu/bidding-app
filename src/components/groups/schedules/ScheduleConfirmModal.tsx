import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';
import Modal from '~/core/ui/Modal';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useUpdateGroupSchedule } from '~/lib/groups/hooks/schedules/use-update-group-schedule';

const ScheduleConfirmModal = ({
  isOpen,
  setIsOpen,
  selectedScheduleId,
  groupId
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => unknown;
  selectedScheduleId: string;
  groupId: string;
}) => {
  const [_, deleteGroupSchedule] = useUpdateGroupSchedule(groupId);
  const { t } = useTranslation();
  const Heading = useMemo(
    () => <Trans i18nKey={'group:deleteGroupScheduleModalHeading'} />,
    []
  );
  const handleDeleteSchedule = useCallback(async () => {
    if (!selectedScheduleId) return false;
    await toast.promise(deleteGroupSchedule(selectedScheduleId), {
      success: t(`group:deleteGroupScheduleSuccess`),
      error: t(`group:deleteGroupScheduleError`),
      loading: t(`group:deleteGroupScheduleLoading`),
    });
    setIsOpen(false);
  }, [t, selectedScheduleId, deleteGroupSchedule, setIsOpen]);
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading={Heading}>
      <div className={'flex flex-col space-y-4'}>
        <p>Proceed with deleting this schedule meeting?</p>
        <button
          className="mb-2 flex items-center justify-center rounded-md border border-blue-600 px-4 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
          onClick={() => handleDeleteSchedule()}
        >
          <CheckCircleIcon className="mr-1 h-5 w-5" />
          <span>Proceed</span>
        </button>
      </div>
    </Modal>
  );
};

export default ScheduleConfirmModal;
