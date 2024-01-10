import { ChangeEvent, useCallback, useEffect, useReducer } from 'react';
import { Disclosure } from '@headlessui/react';
import {
  Action,
  ActionTypes,
  OptionalPanelState,
  Options,
  Section,
} from './types';
// import DropdownWithCheckboxes from './DropdownWithCheckboxes';
import TitlePanel from './TitlePanel';

const initialState: OptionalPanelState = {
  filters: null,
};

function optionsPanelReducer(
  state: OptionalPanelState,
  action: Action
): OptionalPanelState {
  const { id, value } = action.payload;
  switch (action.type) {
    case ActionTypes.ADD_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [id]: [...(state?.filters?.[id] ?? []), value],
        },
      };
    case ActionTypes.REMOVE_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [id]: state?.filters?.[id].filter((v) => v !== value) || [],
        },
      };
    default:
      return state;
  }
}

const OptionsPanel = ({
  section,
  handleChange,
}: {
  section: Section;
  handleChange: Function;
}) => {
  const [state, dispatch] = useReducer(optionsPanelReducer, initialState);
  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const { checked, value } = evt.target;
      dispatch({
        type: checked ? ActionTypes.ADD_FILTER : ActionTypes.REMOVE_FILTER,
        payload: {
          id: section.id,
          value,
        },
      });
    },
    [dispatch, section.id]
  );
  useEffect(() => {
    if (state.filters !== null) {
      handleChange(state.filters);
    }
  }, [state.filters, handleChange]);

  const renderTitlePanel = useCallback(
    (name: string, open: boolean) => <TitlePanel title={name} open={open} />,
    []
  );

  const renderOptionsPanel = useCallback(
    (option: Options, optionIdx: number) => (
      <label
        htmlFor={`filter-${section.id}-${optionIdx}`}
        key={option.value}
        className="flex items-center cursor-pointer "
      >
        <input
          id={`filter-${section.id}-${optionIdx}`}
          name={`${section.id}[]`}
          defaultValue={option.value}
          type="checkbox"
          defaultChecked={state.filters?.[section.id]?.includes(option.value)}
          onChange={onChange}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="ml-3 text-sm dark:text-gray-300 text-gray-600 hover:text-gray-500 hover:dark:text-gray-200">{option.label}</span>
      </label>
    ),
    [onChange, section.id, state.filters]
  );
  switch (section.type) {
    case 'dropdown':
      return (
        // <DropdownWithCheckboxes label={section.name} items={section.options.map(renderOptionsPanel)} />
        <></>
      );
    default:
      return (
        <Disclosure
          as="div"
          key={section.id}
          className="lg:border-t-none border-t border-gray-200 p-4 lg:border-b lg:px-0"
        >
          {({ open }) => (
            <>
              <h3 className="-mx-2 -my-3 flow-root lg:-my-3 lg:-mx-0">
                {renderTitlePanel(section.name, open)}
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-2 lg:space-y-3">
                  {section.options.map(renderOptionsPanel)}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      );
  }
};
export default OptionsPanel;
