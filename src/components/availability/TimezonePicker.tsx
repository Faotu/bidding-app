import React, { Fragment, useEffect, useState } from 'react';
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { timezones } from "~/components/availability/utils";

interface TimezonePicker {
  value?: string,

  onChange?(value: string): void,
}

const TimezonePicker: React.FC<TimezonePicker> = (props) => {
  const { value, onChange } = props;
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filteredTime =
    query === ''
      ? timezones
      : timezones.filter((time) =>
        time?.value
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      );

  useEffect(() => {
    setSelected(value ?? null);
  }, [value]);

  return (
    <>
      <div className={"mb-[5px]"}>Timezone</div>
      <Combobox value={selected as any} onChange={(value) => {
        setSelected(value);
        if(onChange) {
          onChange(value);
        }
      }}>
        <div className="relative">
          <div
            className="relative w-full cursor-default border border-gray rounded-[7px] outline-0 w-[100%] text-[14px]">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 rounded-[7px] outline-0"
              displayValue={(time: any) => time}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options
              className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredTime.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredTime.map((timeZone, index) => (
                  <Combobox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-8 pr-4 ${
                        active ? 'bg-[#4F45E4] text-white' : 'text-gray-900'
                      }`
                    }
                    value={timeZone?.value as any}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {timeZone?.label}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-2 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </>
  )
}

export default TimezonePicker;
