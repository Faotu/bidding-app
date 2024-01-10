'use client';

import * as React from 'react';
import cn from 'classnames';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getClassNameBuilder } from './Button';

const buttonVariants = getClassNameBuilder();
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// import 'react-day-picker/dist/style.css';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {

  const css = `
  .my-selected:not([disabled]) { 
    font-weight: bold; 
    background: #6366f1;
    color: white;
  }
  .my-selected:hover:not([disabled]) { 
    opacity: 0.8;
  }
  `;

  return (
    <>
      <style>{css}</style>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn('relative', className)}
        classNames={{
          months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
          month: 'space-y-4 border border-gray-300 p-3 rounded-md shadow-sm',
          dropdown:
            'appearance-none absolute z-10 top-0 bottom-0 left-0 w-full m-0 p-0 cursor-auto opacity-0 border-0 bg-transparent font-sans text-base leading-5',
          dropdown_year: 'relative inline-flex items-center',
          dropdown_month: 'relative inline-flex items-center',
          dropdown_icon: 'ml-1',
          vhidden:
            'box-border p-0 m-0 bg-transparent border-0 appearance-none absolute top-0 w-1 h-1 overflow-hidden',
          caption: 'flex justify-between items-center p-0 text-left',
          caption_label:
            'text-sm font-medium relative inline-flex items-center nowrap m-0 p-0 px-1 whitespace-nowrap text-current',
          caption_dropdowns: 'relative inline-flex',
          nav: 'space-x-1 flex items-center',
          nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
          ),
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex',
          head_cell:
            'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: cn(
            buttonVariants({ variant: 'normal', color: 'secondary' }),
            'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
          ),
          day_selected: cn(
            buttonVariants({ variant: 'normal', color: 'primary' }),
            'h-9 w-9 p-0 font-normal'
          ),
          day_today: 'bg-accent text-accent-foreground',
          day_outside: 'text-muted-foreground opacity-50',
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle:
            'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
        }}
        {...props}
        modifiersClassNames={{
          selected: 'my-selected',
          today: 'my-today'
        }}
      />
    </>
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
