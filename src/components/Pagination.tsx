import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Button from '~/core/ui/Button';

type PaginationType = {
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  pageChanged: Function;
};

function Pagination(props: PaginationType) {
  const totalPages = props.totalCount
    ? Math.ceil(props.totalCount / props.itemsPerPage)
    : 1;
  const canGoBack = props.currentPage >= 2;
  const canGoNext = props.currentPage < totalPages;

  if (props.totalCount === 0) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <nav
        className="mb-4 sm:order-1 sm:mb-0"
        role="navigation"
        aria-label="Navigation"
      >
        <ul className="flex justify-center">
          <li className="ml-3 first:ml-0">
            <Button
              disabled={!canGoBack}
              variant="flat"
              onClick={() => props.pageChanged(props.currentPage - 1)}
            >
              <ChevronLeftIcon className="h-5 w-5" aria-label="hidden" />
              Previous
            </Button>
          </li>
          <li className="ml-3 first:ml-0">
            <Button
              disabled={!canGoNext}
              variant="flat"
              onClick={() => props.pageChanged(props.currentPage + 1)}
            >
              Next <ChevronRightIcon className="h-5 w-5" aria-label="hidden" />
            </Button>
          </li>
        </ul>
      </nav>
      {
        <div className="text-center text-sm dark:text-white sm:text-left">
          Showing{' '}
          <span className="font-medium text-slate-600">
            {(props.currentPage - 1) * props.itemsPerPage + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium text-slate-600">
            {Math.min(props.currentPage * props.itemsPerPage, props.totalCount)}
          </span>
          {totalPages > 1 ? (
            <>
              {' '}
              of{' '}
              <span className="font-medium text-slate-600">
                {props.totalCount}
              </span>{' '}
              results
            </>
          ) : null}
        </div>
      }
    </div>
  );
}

export default Pagination;
