import { useCallback, useMemo } from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '~/core/ui/Select';

interface SelectListBoxItem {
  value?: string;
  label: string;
  description?: string;
}

type Props = {
  items: SelectListBoxItem[];
  onChange?: (value: string) => void;
  buttonClassname?: string;
  containerClassName?: string;
};

const SelectListBox = <T extends FieldValues>(
  props: Props & UseControllerProps<T>
) => {
  const { buttonClassname } = props;
  const getLabel = useCallback(
    (value: string) => {
      const item = props.items.find((item) => item.value === value);
      return item?.label;
    },
    [props.items]
  );
  return (
    <Controller
      {...props}
      render={({ field: { onChange, value, name } }) => {
        const label = getLabel(value?.toString()) || 'Select';
        return (
          <Select
            value={value?.toString()}
            onValueChange={(value) =>
              onChange({ target: { name, value } } as any)
            }
          >
            <SelectTrigger
              className={buttonClassname}
              data-cy={'item-selector-trigger'}
            >
              <SelectValue asChild>
                <span>{label}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {props.items.map((item) => {
                return (
                  <SelectItem
                    key={item.value}
                    data-cy={`item-item-${item.value}`}
                    value={!!item.value ? item.value.toString() : ''}
                  >
                    <span className={'text-sm'}>{item.label}</span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );
      }}
    />
  );
};

export default SelectListBox;
