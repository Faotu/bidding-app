import { useEffect, useMemo, useRef } from 'react';
import useSWRMutation from 'swr/mutation';
import type { User } from 'firebase/auth';

import { useApiRequest } from '~/core/hooks/use-api';

/**
 * @name useFetchMeetingAttendeesMetadata
 * @param scheduledMeetingId
 */
export function useFetchMeetingAttendeesMetadata(
  groupId?: string,
  scheduledMeetingId?: string
) {
  const requestDone = useRef<boolean>(false);
  const path = getFetchAttendeesPath(groupId, scheduledMeetingId);
  const fetcher = useApiRequest<void, User[]>();
  const { trigger, ...mutationState } = useSWRMutation(path, (path) => {
    return fetcher({
      path,
      method: 'GET',
    });
  });

  const state = useMemo(() => {
    return {
      data: mutationState.data,
      error: mutationState.error,
      loading: mutationState.isMutating,
      success: !mutationState.isMutating && mutationState.data,
    };
  }, [mutationState]);

  useEffect(() => {
    // prevent repeated requests in dev mode
    if (requestDone.current || !path) {
      return;
    }

    if (path) {
      void trigger();
    }

    requestDone.current = true;
  }, [scheduledMeetingId, trigger, path]);

  return state;
}

function getFetchAttendeesPath(groupId?: string, scheduledMeetingId?: string) {
  if (!groupId || !scheduledMeetingId) {
    return undefined;
  }
  return `/api/groups/${groupId}/schedules/${scheduledMeetingId}/attendees`;
}
