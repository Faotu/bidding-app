import { Fragment, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// components
// import TitlePanel from './TitlePanel';
import OptionsPanel from './OptionsPanel';
import { Section } from './types';
import Heading from '~/core/ui/Heading';

export default function SidebarFilter({
  filters,
  handleChange,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}: {
  filters: Section[];
  handleChange: Function;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (value: boolean) => void;
}) {
  const renderOptionsPanel = useCallback(
    (section: Section) => (
      <OptionsPanel
        key={section.id}
        section={section}
        handleChange={handleChange}
      />
    ),
    [handleChange]
  );
  return (
    <>
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-black fixed inset-0 bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-4 pb-12 shadow-xl dark:bg-black-400">
                <div className="flex items-center justify-between px-4">
                  <Heading type={4}>Filters</Heading>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4 pt-2">
                  <h3 className="sr-only">Filters</h3>
                  {filters.map((section) => renderOptionsPanel(section))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <form className="hidden lg:block">
        <h3 className="sr-only">Categories</h3>
        {filters.map((section) => renderOptionsPanel(section))}
      </form>
    </>
  );
}
