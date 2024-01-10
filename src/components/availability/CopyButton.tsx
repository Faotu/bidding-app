import React, { useEffect, useRef, useState } from 'react';
import { CopyIcon } from "~/components/availability/Icons";
import classNames from "classnames";
import { availabilityDayLabels } from "~/components/availability/utils";
import { useOutsideClickHandler } from "~/components/availability/useOutsideClickHandler";
import { AvailabilityDay } from '~/core/session/types/user-data';

interface CopyButtonProps {
  day: AvailabilityDay,

  onClickApply(copyFrom: AvailabilityDay, selectedDays: AvailabilityDay[]): void,
}

const CopyButton: React.FC<CopyButtonProps> = (props) => {
  const { day, onClickApply } = props;
  const dropdownRef = useRef<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [checkedDays, setCheckedDays] = useState<AvailabilityDay[]>([]);

  const handleClick = () => setOpen(!open);

  const checkUncheckDaySelection = (day: AvailabilityDay) => {
    const newSelectedDays = [...checkedDays];
    const dayIndex = newSelectedDays.indexOf(day);

    if (dayIndex === -1) {
      newSelectedDays.push(day);
    } else {
      newSelectedDays.splice(dayIndex, 1);
    }

    setCheckedDays(() => newSelectedDays);
  };

  const isDaySelected = (day: AvailabilityDay) => {
    return checkedDays.indexOf(day) > -1;
  };

  const handleClickApply = () => {
    if(onClickApply) {
      onClickApply(day, checkedDays);
      setOpen(false);
    }
  };

  useOutsideClickHandler(dropdownRef, () => setOpen(false));

  useEffect(() => {
    if(!open) {
      setCheckedDays(() => []);
    }
  }, [open]);

  return (
    <div className={"inline-block relative"}>
      <button
        className={classNames("p-[6px] hover:bg-[#eeeeee] rounded", {
          "bg-[#eeeeee]": open,
        })}
        onClick={handleClick}
      >
        <CopyIcon />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={"bg-white border border-[#dddddd] rounded-[5px] shadow-md absolute z-[9999] right-0 top-[100%] mt-[7px] w-[180px]"}>
          <div className={"py-[20px] px-[15px] pb-[1px] text-[11px] text-[#1a1a1a9c]"}>COPY TIMES TO</div>

          {Object.entries(availabilityDayLabels)?.map(([key, value], index) => (
            <label
              key={index}
              className={classNames("flex w-[100%] justify-between py-[8px] px-[15px] hover:bg-[#eae9fc]", {
                "hover:bg-white cursor-default text-[#1a1a1a9c]": day === key,
                "cursor-pointer": day !== key,
              })}
            >
              <span className={"text-[14px]"}>{value}</span>
              <input
                type={"checkbox"}
                checked={day !== key ? isDaySelected(key as AvailabilityDay) : true}
                disabled={day === key}
                onChange={() => {
                  if(day !== key) {
                    checkUncheckDaySelection(key as AvailabilityDay);
                  }
                }}
              />
            </label>
          ))}

          <div className={"text-center px-[15px] py-[10px]"}>
            <button
              className={"p-[3px] outline-none transition-all focus:ring-2 ring-offset-1 dark:focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 ring-primary-200 bg-primary-500 dark:focus:ring-primary-500/70 text-primary-contrast hover:bg-primary-600 active:bg-primary-700 dark:text-primary-contrast rounded-md text-[14px] w-[100%]"}
              onClick={handleClickApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyButton;
