import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { Fragment, useCallback } from 'react';

import PlusCircleIcon from '@heroicons/react/24/outline/PlusCircleIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';

import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

// import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { useInviteMembers } from '~/lib/groups/hooks/use-invite-members';

import If from '~/core/ui/If';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import IconButton from '~/core/ui/IconButton';
import { Tooltip } from '~/core/ui/Tooltip';

import MembershipRoleSelector from './MembershipRoleSelector';
import { useUserSession } from '~/core/hooks/use-user-session';
import { GroupMember } from '~/lib/groups/types/group';

type InviteModel = ReturnType<typeof memberFactory>;

const InviteMembersForm: React.FCC<{ groupId: string }> = ({
  groupId = '',
}) => {
  const { t } = useTranslation('group');
  const router = useRouter();

  const user = useUserSession();
  const { trigger, isMutating } = useInviteMembers(groupId);

  const { register, handleSubmit, setValue, control, clearErrors, watch } =
    useForm({
      defaultValues: {
        members: [memberFactory()],
      },
      shouldUseNativeValidation: true,
      shouldFocusError: true,
      shouldUnregister: true,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
    shouldUnregister: true,
  });

  const watchFieldArray = watch('members');

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const navigateToMembersPage = useCallback(() => {
    void router.push(`/group/${groupId}/members`);
  }, [router, groupId]);

  const onSubmit = useCallback(
    async ({ members }: { members: InviteModel[] }) => {
      const promise = trigger(members);
      await toast.promise(promise, {
        success: t(`inviteMembersSuccess`),
        error: t(`inviteMembersError`),
        loading: t(`inviteMembersLoading`),
      });

      navigateToMembersPage();
    },
    [navigateToMembersPage, trigger, t]
  );

  return (
    <form
      className={'flex flex-col space-y-4'}
      data-cy={'invite-members-form'}
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
    >
      <div className="flex flex-col space-y-2">
        {controlledFields.map((field, index) => {
          const emailInputName = `members.${index}.email` as const;
          const roleInputName = `members.${index}.role` as const;

          // register email control
          const emailControl = register(emailInputName, {
            required: true,
            validate: (value) => {
              const invalid = getFormValidator(watchFieldArray)(value, index);

              if (invalid) {
                return t<string>(`duplicateInviteEmailError`);
              }

              const isSameAsCurrentUserEmail = user?.auth?.email === value;

              if (isSameAsCurrentUserEmail) {
                return t<string>(`invitingOwnAccountError`);
              }

              return true;
            },
          });

          // register role control
          register(roleInputName, {
            value: field.role,
          });

          return (
            <Fragment key={field.id}>
              <div className={'flex items-center space-x-0.5 md:space-x-2'}>
                <div className={'w-7/12 md:w-8/12'}>
                  <TextField.Input
                    data-cy={'invite-email-input'}
                    placeholder="member@email.com"
                    type="email"
                    required
                    {...emailControl}
                  />
                </div>

                <div className={'w-4/12 md:w-3/12'}>
                  <MembershipRoleSelector
                    value={field.role}
                    onChange={(role) => {
                      setValue(roleInputName, role);
                    }}
                  />
                </div>

                <If condition={fields.length > 1}>
                  <div className={'w-1/12'}>
                    <Tooltip
                      className={'flex justify-center'}
                      content={t<string>('removeInviteButtonLabel')}
                    >
                      <IconButton
                        data-cy={'remove-invite-button'}
                        label={t<string>('removeInviteButtonLabel')}
                        onClick={() => {
                          remove(index);
                          clearErrors(emailInputName);
                        }}
                      >
                        <XMarkIcon className={'h-4 lg:h-5'} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </If>
              </div>
            </Fragment>
          );
        })}

        <div>
          <Button
            data-cy={'append-new-invite-button'}
            type={'button'}
            color={'transparent'}
            size={'small'}
            onClick={() => append(memberFactory())}
          >
            <span className={'flex items-center space-x-2'}>
              <PlusCircleIcon className={'h-5'} />

              <span>
                <Trans i18nKey={'organization:addAnotherMemberButtonLabel'} />
              </span>
            </span>
          </Button>
        </div>
      </div>

      <div>
        <Button
          className={'w-full lg:w-auto'}
          data-cy={'send-invites-button'}
          type={'submit'}
          loading={isMutating}
        >
          <Trans i18nKey={'organization:inviteMembersSubmitLabel'} />
        </Button>
      </div>
    </form>
  );
};

function memberFactory() {
  return {
    email: '',
    role: GroupMember.member,
  };
}

function getFormValidator(members: InviteModel[]) {
  return function isValueInvalid(value: string, index: number) {
    const emails = members.map((member) => member.email);
    const valueIndex = emails.indexOf(value);

    return valueIndex >= 0 && valueIndex !== index;
  };
}

export default InviteMembersForm;