import classNames from 'classnames';
import { Menu, Transition } from '@headlessui/react';
import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  UserPlusIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useUserId } from '~/core/hooks/use-user-id';
import Button from '~/core/ui/Button';
import { GroupData } from '~/lib/groups/hooks/use-group-data';
import { useUpdateGroup } from '~/lib/groups/hooks/use-update-group';

const GroupBanner: React.FC<{ groupData: GroupData }> = ({ groupData }) => {
  const router = useRouter();
  const { t } = useTranslation('group');
  const userId = useUserId() as string;
  const { isOwner, isMember, settings, members } = groupData;
  const membersCount = useMemo(
    () => Object.keys(members || {}).length,
    [members]
  );
  const [_updateGroup, _state, handleGroupMembership] = useUpdateGroup();
  const handleLeaveGroup = useCallback(async () => {
    if (!groupData) return false;
    const promise = handleGroupMembership(
      groupData.groupId,
      userId,
      groupData.members
    );
    await toast.promise(promise, {
      loading: t(`updateGroupLoadingMessage`),
      success: t(`updateGroupSuccessMessage`),
      error: t(`updateGroupErrorMessage`),
    });
  }, [t, handleGroupMembership, groupData, userId]);

  return (
    <div className=" mt-2 flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow">
      <div className="min-w-0 flex-1 p-3">
        <h2 className="sr-only" id="group-overview-title">
          Group Overview
        </h2>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {settings?.name}
        </h2>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <UserGroupIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            {membersCount ? `${membersCount} members` : null}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            {settings?.isPublic ? (
              <GlobeAltIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <LockClosedIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
            )}
            {settings?.isPublic ? 'Public' : 'Private'}
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-x-4 sm:gap-x-6 lg:ml-4 lg:mt-0">
        {isOwner && (
          <>
            <Link
              href={`/group/${groupData.groupId}/members`}
              className="hidden text-sm font-semibold leading-6 text-gray-900 sm:flex"
            >
              <UserGroupIcon className="mr-2 h-6 w-6 text-gray-800" />
              Members
            </Link>
            <Link
              href={`/group/${groupData.groupId}/settings`}
              className="hidden text-sm font-semibold leading-6 text-gray-900 sm:flex"
            >
              <Cog6ToothIcon className="mr-2 h-6 w-6 text-gray-800" />
              Settings
            </Link>
            <span className="sm:ml-3">
              <Button
                onClick={() =>
                  router.push(`/group/${groupData.groupId}/members/invite`)
                }
              >
                <UserPlusIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Invite members
              </Button>
            </span>
          </>
        )}
        {!isOwner && isMember ? (
          <Button
            variant="outline"
            color="danger"
            onClick={() => handleLeaveGroup()}
          >
            <ArrowLeftOnRectangleIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
            Leave group
          </Button>
        ) : (
          <Menu as="div" className="relative ml-3 sm:hidden">
            <Menu.Button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
              More
              <ChevronDownIcon
                className="-mr-1 ml-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="ring-black absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-opacity-5 focus:outline-none">
                {isOwner && (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`/group/${groupData.groupId}/members`}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Members
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`/group/${groupData.groupId}/settings`}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                  </>
                )}
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  );
};

export default GroupBanner;
