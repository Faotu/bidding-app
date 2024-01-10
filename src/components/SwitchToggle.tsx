import { Switch } from '@headlessui/react';
import { useState, useEffect } from 'react';

interface SwitchProps {
  defaultChecked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

const SwitchToggle = ({ defaultChecked, onChange, label }: SwitchProps) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    onChange?.(newCheckedState);
  };

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  return (
    <div>
      <Switch
        checked={checked}
        onChange={handleToggle}
        className={`${checked ? 'bg-blue-500' : 'bg-gray-200'}
        relative inline-flex h-[22px] w-[40px] items-center rounded-full`}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`${checked ? 'translate-x-5' : 'translate-x-[2px]'}
          inline-block h-[17px] w-[17px] transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
};

export default SwitchToggle;
