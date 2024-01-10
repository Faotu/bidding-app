import { Trans, useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import { useUpdateGroup } from '~/lib/groups/hooks/use-update-group';
import { Group, GroupSettings } from '~/lib/groups/types/group';
import SwitchToggle from '../SwitchToggle';

const UpdateGroupForm: React.FC<{
  groupId: string;
  settings: GroupSettings;
}> = ({ groupId, settings }) => {
  const [updateGroup, { loading, error }] = useUpdateGroup();
  const { t } = useTranslation('group');
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      name: settings.name,
      description: settings.description,
      isPublic: settings.isPublic,
    },
  });

  const onSubmit = useCallback(
    async (value: Partial<Group['settings']>) => {
      const promise = updateGroup({
        id: groupId,
        settings: {
          name: value.name || settings.name,
          description: value.description || settings.description,
          isPublic: value.isPublic || settings.isPublic,
        },
      });
      await toast.promise(promise, {
        loading: t(`updateGroupLoadingMessage`),
        success: t(`updateGroupSuccessMessage`),
        error: t(`updateGroupErrorMessage`),
      });
    },
    [t, updateGroup, groupId, settings]
  );
  const nameControl = register('name', {
    required: true,
  });
  const descriptionControl = register('description');
  const isPublicControl = register('isPublic');
  return (
    <form
      onSubmit={handleSubmit((value) => {
        return onSubmit(value);
      })}
      className={'space-y-4'}
    >
      <div className={'flex flex-col space-y-4'}>
        <TextField>
          <TextField.Label>
            <Trans i18nKey={'group:groupNameInputLabel'} />
            <TextField.Input
              data-cy={'group-name-input'}
              required
              type={'text'}
              {...nameControl}
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
              placeholder={'Describe the group'}
              ref={descriptionControl.ref}
              onBlur={descriptionControl.onBlur}
              onChange={descriptionControl.onChange}
              name={descriptionControl.name}
            />
          </TextField.Label>
        </TextField>
        <TextField>
          <TextField.Label className="my-2 flex flex-col">
            Allow users to find your Group
            <Controller
              name={isPublicControl.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <SwitchToggle
                  defaultChecked={value}
                  onChange={onChange as any}
                />
              )}
            />
          </TextField.Label>
        </TextField>
        <div>
          <Button
            className={'w-full md:w-auto'}
            data-cy={'update-group-submit-button'}
            loading={loading}
          >
            <Trans i18nKey={'group:updateGroupSubmitLabel'} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateGroupForm;
