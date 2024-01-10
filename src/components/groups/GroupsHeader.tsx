import Link from 'next/link';

const GroupsHeader: React.FCC<{
  title: string;
  featured: boolean;
  showAllLink: string;
}> = ({ title, showAllLink }) => {
  return (
    <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-3 px-6">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        {title}
      </h3>
      <div className="mt-3 flex sm:ml-4 sm:mt-0">
        {showAllLink ? (
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              href={showAllLink}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Show all
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GroupsHeader;
