import { User } from 'firebase/auth';
import { Fragment } from 'react';

const AttendeesList = ({
  pairedAttendees,
  loading,
}: {
  pairedAttendees: User[][];
  loading: boolean;
}) => {
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pair
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pairedAttendees.map((pair, index) => (
                <tr key={index}>
                  {pair.map((attendee) => (
                    <Fragment key={attendee.uid}>
                      <td className="whitespace-nowrap px-6 py-4">
                        {attendee.displayName}
                      </td>
                    </Fragment>
                  ))}
                  {pair.length === 1 && (
                    <td className="whitespace-nowrap px-6 py-4">-</td>
                  )}
                  <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AttendeesList;
