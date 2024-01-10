import {
  ArrowRightCircleIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useUserId } from '~/core/hooks/use-user-id';
import { useUpdateGroup } from '~/lib/groups/hooks/use-update-group';
import { Group } from '~/lib/groups/types/group';

// const TinyAvatarList = ({ avatars }) => {
//   return (
//     <div className="flex flex-row overflow-hidden">
//       {avatars.map((avatar, idx) => (
//         <div
//           key={avatar.id}
//           className="relative"
//           style={{ marginLeft: idx === 0 ? 0 : -14.4 }}
//         >
//           <img
//             src={avatar.image}
//             alt={avatar.name}
//             className="h-8 w-8 scale-90 transform rounded-full border-2 border-white transition duration-300 ease-in-out hover:scale-100"
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

const GroupCard: React.FCC<{ group: Group }> = ({ group }) => {
  const [_updateGroup, _state, handleGroupMembership] = useUpdateGroup();
  const { t } = useTranslation('group');
  const userId = useUserId() as string;
  const isOwner = useMemo(() => group?.ownerId === userId, [group, userId]);
  const isMember = useMemo(
    () => group?.members && Object.keys(group?.members).includes(userId),
    [group, userId]
  );
  const handleLeaveGroup = useCallback(async () => {
    const promise = handleGroupMembership(
      group.groupId,
      userId,
      group?.members
    );
    await toast.promise(promise, {
      loading: t(`updateGroupLoadingMessage`),
      success: t(`updateGroupSuccessMessage`),
      error: t(`updateGroupErrorMessage`),
    });
  }, [t, group?.groupId, group?.members, userId, handleGroupMembership]);
  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-lg leading-6 font-medium text-gray-900">
              {group?.settings?.name}
            </h3>
          </div>
          <p className="mt-1 truncate text-sm text-gray-500">
            {group?.settings?.description}
          </p>
        </div>
        {/* <Image
          className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
          src={person.imageUrl}
          alt=""
        /> */}
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          {!isOwner && !isMember ? (
            <div className="flex w-0 flex-1">
              <a
                href={`#`}
                onClick={() => handleLeaveGroup()}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                <PlusCircleIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Join group
              </a>
            </div>
          ) : (
            <div className="flex w-0 flex-1">
              <Link
                href={`/group/${group.groupId}/details`}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                <ArrowRightCircleIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                View details
              </Link>
            </div>
          )}
          {!isOwner && isMember && (
            <div className="-ml-px flex w-0 flex-1">
              <a
                href={`#`}
                onClick={() => handleLeaveGroup()}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                <XMarkIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Leave group
              </a>
            </div>
          )}
          {isOwner && (
            <div className="-ml-px flex w-0 flex-1">
              <Link
                href={`/group/${group.groupId}/settings`}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                <Cog6ToothIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Manage group
              </Link>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default GroupCard;
