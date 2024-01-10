import { useEffect, useMemo, useRef } from 'react';
import useSWRMutation from 'swr/mutation';

import { useApiRequest } from '~/core/hooks/use-api';

export function useFetchGroupMembersRequest(groupId: string) {
  const fetcher = useApiRequest<void, any>();
  const path = getFetchMembersPath(groupId);
  return useSWRMutation(path, (path) => {
    return fetcher({
      path,
      method: 'GET',
    });
  });
}

/**
 * @name useFetchGroupMembersMetadata
 * @param groupId
 */
export function useFetchGroupMembersMetadata(groupId: string) {
  const { trigger, ...mutationState } = useFetchGroupMembersRequest(groupId);

  const state = useMemo(() => {
    return {
      data: mutationState.data,
      error: mutationState.error,
      loading: mutationState.isMutating,
      success: !mutationState.isMutating && mutationState.data,
    };
  }, [mutationState]);

  const requestDone = useRef<boolean>(false);

  useEffect(() => {
    // prevent repeated requests in dev mode
    if (requestDone.current) {
      return;
    }

    void trigger();

    requestDone.current = true;
  }, [groupId, trigger]);

  return state;
}

function getFetchMembersPath(groupId: string) {
  return `/api/groups/${groupId}/members`;
}
