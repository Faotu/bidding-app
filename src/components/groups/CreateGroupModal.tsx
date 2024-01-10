import { FormEvent, useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';

import Modal from '~/core/ui/Modal';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';

import { useCreateGroup } from '~/lib/groups/hooks/use-create-group';
import { Group } from '~/lib/groups/types/group';

const CreateGroupModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => unknown;
  onCreate: (group: WithId<Group>) => void;
}> = ({ isOpen, setIsOpen, onCreate }) => {
  const [createGroup, createGroupState] = useCreateGroup();
  const { loading, data: newGroup } = createGroupState;
  const { t } = useTranslation('group');

  const Heading = useMemo(
    () => <Trans i18nKey={'group:createGroupModalHeading'} />,
    []
  );

  // Report error when user leaves input empty
  const onError = useCallback(() => {
    toast.error(`Please use a valid name`);
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const name = data.get(`name`) as string;
      const description = data.get(`description`) as string;

      // Adjust logic for error handling as needed
      const isNameInvalid = !name || name.trim().length === 0;
      const isDescriptionInvalid =
        !description || description.trim().length === 0;

      if (isNameInvalid || isDescriptionInvalid) {
        return onError();
      }

      await toast.promise(createGroup({ name, description }), {
        success: t(`group:createGroupSuccess`),
        error: t(`group:createGroupError`),
        loading: t(`group:createGroupLoading`),
      });

      setIsOpen(false);
    },
    [createGroup, onError, setIsOpen, t]
  );

  useEffect(() => {
    if (newGroup) {
      onCreate(newGroup);
    }
  }, [newGroup, onCreate]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading={Heading}>
      <form onSubmit={onSubmit}>
        <div className={'flex flex-col space-y-4'}>
          <TextField>
            <TextField.Label>
              <Trans i18nKey={'group:groupNameLabel'} />

              <TextField.Input
                data-cy={'create-group-name-input'}
                name={'name'}
                minLength={1}
                required
                placeholder={'ex. IndieCorp'}
              />
            </TextField.Label>
          </TextField>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'group:groupDescriptionLabel'} />
              <textarea
                required
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder={'ex. Describe the group'}
                name="description"
              />
            </TextField.Label>
          </TextField>

          <Button
            data-cy={'confirm-create-group-button'}
            block
            loading={loading}
          >
            <Trans i18nKey={'group:createGroupSubmitLabel'} />
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;
