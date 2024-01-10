import {
  collection,
  CollectionReference,
  query,
  orderBy,
  where,
  QuerySnapshot,
  DocumentSnapshot,
  startAfter,
  limit,
  QueryConstraint,
} from 'firebase/firestore';
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollection,
} from 'reactfire';
import { GROUPS_COLLECTION } from '~/lib/firestore-collections';
import { Group } from '../types/group';
import { FilterType } from '~/core/firebase/types/query';

/**
 * @name useFetchGroups
 * @description Fetch the all groups
 *
 * Usage:
 * const { data: players } = useFetchGroups();
 *
 * console.log(players);
 *
 * NB: It's best to wrap
 * components that use this component with {@link} as userId
 * can become undefined, which will throw a Firestore error
 */
function useFetchGroups(params: {
  cursor?: Maybe<DocumentSnapshot>;
  itemsPerPage?: number;
  filters?: FilterType[];
}): ObservableStatus<QuerySnapshot<Group>> {
  const firestore = useFirestore();

  const collectionRef = collection(
    firestore,
    GROUPS_COLLECTION
  ) as CollectionReference<Group>;
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

  if (params.itemsPerPage) {
    constraints.push(limit(params.itemsPerPage));
  }

  // if cursor is not undefined (e.g. not initial query)
  // we pass it as a constraint
  if (params.cursor) {
    constraints.push(startAfter(params.cursor));
  }

  const groupsQuery = query(collectionRef, ...constraints);
  return useFirestoreCollection(groupsQuery, { idField: 'id' });
}

export default useFetchGroups;
