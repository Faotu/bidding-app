import { useCallback } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { updateProfile } from 'firebase/auth';
import { useRequestState } from '~/core/hooks/use-request-state';
import { ProfileInfo, UserData } from '~/core/session/types/user-data';
import {
  CollectionReference,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { USERS_COLLECTION } from '~/lib/firestore-collections';
import { FirebaseError } from 'firebase-admin';

export function useUpdateProfile() {
  const { data: user } = useUser();
  const firestore = useFirestore();
  const { state, setLoading, setData, setError } =
    useRequestState<Partial<ProfileInfo>>();

  const updateProfileCallback = useCallback(
    async (info: Maybe<Partial<ProfileInfo>>) => {
      if (!user || !info) {
        return;
      }
      setLoading(true);
      if ((info?.displayName || info?.photoURL) && user) {
        try {
          await updateProfile(user, info);
        } catch (e) {
          setError(`Could not update Profile`);
          throw e;
        }
      }
      try {
        const collectionRef = collection(
          firestore,
          USERS_COLLECTION
        ) as CollectionReference<UserData>;
        const ref = doc(collectionRef, user?.uid);
        await updateDoc(ref, info);
        setData(info);
      } catch (e) {
        setError((e as FirebaseError).message);
        throw e;
      }
    },
    [firestore, setData, setError, setLoading, user]
  );

  return [updateProfileCallback, state] as [
    typeof updateProfileCallback,
    typeof state
  ];
}
