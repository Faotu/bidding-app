import { useCallback } from 'react';
import { useFirestore } from 'reactfire';

import {
  where,
  getCountFromServer,
  query,
  collection,
  CollectionReference,
} from 'firebase/firestore';
import { UserData } from '~/core/session/types/user-data';
import { useUserId } from '~/core/hooks/use-user-id';
import { USERS_COLLECTION } from '~/lib/firestore-collections';

function useFetchPlayersCount() {
  const firestore = useFirestore();
  const userId = useUserId() as string;

  return useCallback(() => {
    const constraints = [
      where('userId', '!=', userId),
      where('public', '==', true),
    ];
    const collectionRef = collection(
      firestore,
      USERS_COLLECTION
    ) as CollectionReference<WithId<UserData>>;
    return getCountFromServer(query(collectionRef, ...constraints));
  }, [firestore, userId]);
}

export default useFetchPlayersCount;
