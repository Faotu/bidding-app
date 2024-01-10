export type Options = {
  value: string;
  label: string;
  checked?: boolean;
};
export type Section = {
  id: string;
  type?: string;
  name: string;
  options: Options[];
};

export type OptionalPanelState = {
  filters: Record<string, string[]> | null;
};

export enum ActionTypes {
  ADD_FILTER = 'ADD_FILTER',
  REMOVE_FILTER = 'REMOVE_FILTER',
}

export type Action = {
  type: ActionTypes;
  payload: { id: string; value: string };
};
