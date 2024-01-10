import { useCallback } from 'react';
import { useFirestore } from 'reactfire';
import {
  where,
  getCountFromServer,
  query,
  collection,
  CollectionReference,
  QueryConstraint,
  orderBy,
} from 'firebase/firestore';
import { GROUPS_COLLECTION } from '~/lib/firestore-collections';
import { FilterType } from '~/core/firebase/types/query';
import { Group } from '~/lib/groups/types/group';

function useFetchGroupsCount(params: { filters?: FilterType[] }) {
  const firestore = useFirestore();
  return useCallback(() => {
    const collectionRef = collection(
      firestore,
      GROUPS_COLLECTION
    ) as CollectionReference<WithId<Group>>;
    let constraints: any = [];

    const otherConstraints = params.filters?.reduce((acc, filter) => {
      const { field, op, value } = filter;
      if (['!=', 'not-in'].includes(op)) acc.push(orderBy(field));
      if (value !== undefined) acc.push(where(field, op, value));
      return acc;
    }, [] as QueryConstraint[]);
    if (otherConstraints) {
      constraints = [...constraints, ...otherConstraints];
    }

    return getCountFromServer(query(collectionRef, ...constraints));
  }, [firestore, params]);
}

export default useFetchGroupsCount;
