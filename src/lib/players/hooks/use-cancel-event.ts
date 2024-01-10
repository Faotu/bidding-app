import { useFirestore } from 'reactfire';
import { deleteDoc, doc } from 'firebase/firestore';
import { useCallback } from 'react';

import { EVENTS_COLLECTION } from '~/lib/firestore-collections';

export function useCancelEvent() {
  const firestore = useFirestore();

  return useCallback(
    (eventId: string) => {
      const path = getCancelEventPath(eventId);
      const docRef = doc(firestore, path);

      return deleteDoc(docRef);
    },
    [firestore]
  );
}

/**
 * @name getCancelEventPath
 * @param organizationId
 * @param eventId
 * @description Builds path to the API to cancel
 * an events: /api/organizations/{ORGANIZATION_ID}/eventss/{EVENT_ID}
 */
function getCancelEventPath(eventId: string) {
  return [EVENTS_COLLECTION, eventId].join('/');
}
