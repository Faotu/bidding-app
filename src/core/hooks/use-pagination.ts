import { useReducer } from 'react';

type InitialStateType = {
  page: number;
  itemsPerPage: number;
};

function reducer(state: InitialStateType, action: any) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.page };
    case 'SET_ITEMS_PER_PAGE':
      return { ...state, itemsPerPage: action.itemsPerPage };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function usePagination(
  props: React.PropsWithChildren<{ itemsPerPage: number }>
) {
  const [state, dispatch] = useReducer<
    (state: InitialStateType, dispatch: any) => InitialStateType
  >(reducer, {
    page: 1,
    itemsPerPage: props.itemsPerPage,
  });

  const setPage = (page: number) => {
    dispatch({ type: 'SET_PAGE', page });
  };

  const setItemsPerPage = (itemsPerPage: number) => {
    dispatch({ type: 'SET_ITEMS_PER_PAGE', itemsPerPage });
  };

  return {
    page: state.page,
    itemsPerPage: state.itemsPerPage,
    setPage,
    setItemsPerPage,
  };
}
