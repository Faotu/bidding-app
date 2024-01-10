import { InboxIcon } from '@heroicons/react/24/outline';

const EmptyData = ({ title }: { title: string }) => {
  return (
    <div className="w-full max-w-md bg-transparent">
      <div className="mb-2 flex items-center justify-start text-gray-400">
        <InboxIcon className="h-8 w-8" />
      </div>
      <h1 className="text-md mb-2 font-semibold text-gray-800">{title}</h1>
      <p className="text-gray-600">
        We couldn&apos;t find any data for this section.
      </p>
    </div>
  );
};

export default EmptyData;
