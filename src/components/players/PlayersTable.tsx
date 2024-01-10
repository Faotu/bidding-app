import React from 'react';

const PlayersTable: React.FCC = ({ children }) => {
  return (
    <div className="relative rounded-sm border border-slate-200 shadow-lg">
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            {/* Table header */}
            <thead className="border-t border-b border-slate-200 text-xs font-semibold uppercase dark:text-white">
              <tr>
                <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
                  <div className="text-left font-semibold">Username</div>
                </th>
                <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
                  <div className="text-left font-semibold">Timezone</div>
                </th>
                <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
                  <div className="font-semibold">Fluent in</div>
                </th>
                <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
                  <div className="text-left font-semibold">
                    Preferred Duration
                  </div>
                </th>
                <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
                  <div className="text-left font-semibold">
                    Years in industry
                  </div>
                </th>
                <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
                  <div className="font-semibold">
                    Years of role play experience
                  </div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="divide-y divide-slate-200 text-sm">
              {children}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayersTable;
