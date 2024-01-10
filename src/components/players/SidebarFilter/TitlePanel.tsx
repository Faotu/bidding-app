import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

const TitlePanel = ({ title, open }: { title: string; open: boolean }) => (
  <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm dark:text-gray-300 text-gray-600 hover:text-gray-500 hover:dark:text-gray-200">
    <span className="font-medium">{title}</span>
    <span className="ml-6 flex items-center">
      {open ? (
        <MinusIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </span>
  </Disclosure.Button>
);

export default TitlePanel;
