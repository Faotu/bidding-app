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
  WhereFilterOp,
  QueryConstraint,
} from 'firebase/firestore';
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollection,
} from 'reactfire';
import { UserData } from '~/core/session/types/user-data';
import { useUserId } from '~/core/hooks/use-user-id';
import { USERS_COLLECTION } from '~/lib/firestore-collections';

const filterOperator: Record<string, WhereFilterOp> = {
  gender: 'in',
  timezone: 'in',
  firstLanguage: 'in',
  languagesFluentIn: 'array-contains-any',
  personalityType: 'array-contains-any',
  yearsOfIndustryExperience: 'in',
  yearsOfRolePlayExperience: 'in',
};

/**
 * @name useFetchPlayers
 * @description Fetch the all users/players.
*
 * Usage:
 * const { data: players } = useFetchPlayers();
 *
 * console.log(players);
 *
 * NB: It's best to wrap
 * components that use this component with {@link ErrorBoundary} as userId
 * can become undefined, which will throw a Firestore error
 */
function useFetchPlayers(params: {
  cursor: Maybe<DocumentSnapshot>;
  itemsPerPage: number;
  filters: Record<string, string[]>;
}): ObservableStatus<QuerySnapshot<UserData>> {
  const firestore = useFirestore();
  const userId = useUserId() as string;

  const collectionRef = collection(
    firestore,
    USERS_COLLECTION
  ) as CollectionReference<UserData>;
  const whereConstraints = [
    where('userId', '!=', userId),
    where('public', '==', true),
  ];
  for (const id in params.filters) {
    if (params.filters[id] && params.filters[id].length) {
      whereConstraints.push(where(id, filterOperator[id], params.filters[id]));
    }
  }
  const constraints: QueryConstraint[] = [
    orderBy('userId'),
    ...whereConstraints,
    limit(params.itemsPerPage),
  ];

  // if cursor is not undefined (e.g. not initial query)
  // we pass it as a constraint
  if (params.cursor) {
    constraints.push(startAfter(params.cursor));
  }

  const usersQuery = query(collectionRef, ...constraints);
  return useFirestoreCollection(usersQuery, { idField: 'id' });
}

export default useFetchPlayers;
