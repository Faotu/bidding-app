'use client';

import * as React from 'react';
import { format } from 'date-fns';

import cn from 'classnames';
import Button from '~/core/ui/Button';
import { Calendar, CalendarProps } from '~/core/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/core/ui/Popover';
import { CalendarIcon } from '@heroicons/react/24/outline';

type DatePickerProps = typeof Popover.defaultProps & {
  className?: string;
  value?: Date;
  onChange?: (event: Date | undefined) => void;
  disabled?: CalendarProps['disabled'];
  fromYear?: number;
  toYear?: number;
  captionLayout?: CalendarProps['captionLayout'];
};

export function DatePicker({
  className,
  value,
  onChange,
  ...props
}: DatePickerProps) {
  return (
    <Popover open={props.open} onOpenChange={props.onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          color="secondary"
          className={cn(
            'h-[38px] w-[280px] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          disabled={props.disabled}
          captionLayout={props.captionLayout}
          fromYear={props.fromYear}
          toYear={props.toYear}
        />
      </PopoverContent>
    </Popover>
  );
}
