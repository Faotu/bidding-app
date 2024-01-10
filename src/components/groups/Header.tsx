import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { PlusCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '~/core/ui/Button';
import CreateGroupModal from './CreateGroupModal';

const Header = ({ featured }: { featured: boolean }) => {
  const [openNewGroupModal, setOpenNewGroupModal] = useState<boolean>(false);
  const router = useRouter();
  return (
    <>
      <div className="mb-3 px-6 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          {!featured ? (
            <a
              role="button"
              className="flex w-[140px] items-center p-0 underline"
              onClick={() => router.back()}
            >
              <ChevronLeftIcon className="h-7 w-7" />
              <span>Go back</span>
            </a>
          ) : (
            <h2 className="text-lg font-bold leading-6 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
              Groups
            </h2>
          )}
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() => setOpenNewGroupModal(true)}
          >
            <UserPlusIcon className="mr-2 h-6 w-6" aria-label='hidden' />
            Create group
          </Button>
        </div>
      </div>
      <CreateGroupModal
        isOpen={openNewGroupModal}
        setIsOpen={setOpenNewGroupModal}
        onCreate={console.log}
      />
    </>
  );
};

export default Header;
