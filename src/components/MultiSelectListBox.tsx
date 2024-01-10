import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import classNames from 'classnames';

interface MultiSelectListBoxItem {
  value: string;
  label: string;
}

type Props = {
  items: MultiSelectListBoxItem[];
  buttonClassname?: string;
};

const MultiSelectListBox = <T extends FieldValues>(
  props: Props & UseControllerProps<T>
) => {
  const {
    field: { value, onChange },
  } = useController(props);
  const { buttonClassname } = props;

  return (
    <div className="TextFieldInputContainer">
      <div className="TextFieldInput w-72 flex-1">
        <Listbox value={value} onChange={onChange} multiple>
          <div className="relative mt-1">
            <Listbox.Button
              className={classNames(
                'bg-e relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm',
                buttonClassname
              )}
            >
              <span className="block truncate">
                {value.length === 0
                  ? 'Select'
                  : value.length === 1
                  ? value[0]
                  : `${value[0]} + ${value.length - 1} more`}
              </span>
              <span className="itesms-center pointer-events-none absolute inset-y-0 right-0 mt-2 flex pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="ring-black absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-opacity-5 focus:outline-none sm:text-sm">
                {props.items.map((item) => (
                  <Listbox.Option
                    key={item.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`
                    }
                    value={item.label}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {item.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default MultiSelectListBox;
