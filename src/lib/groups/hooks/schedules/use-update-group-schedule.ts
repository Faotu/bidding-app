import { FirebaseError } from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  FieldValue,
  updateDoc,
} from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { useCallback } from 'react';

import { useRequestState } from '~/core/hooks/use-request-state';
import { Schedule } from '~/lib/groups/types/group';
import {
  GROUPS_COLLECTION,
  SCHEDULES_COLLECTION,
} from '~/lib/firestore-collections';

/**
 * @name useUpdateGroupSchedule
 * @description Hook to update a group's schdule information
 */
export function useUpdateGroupSchedule(groupId: string) {
  const { state, setError, setData, setLoading } =
    useRequestState<
      Partial<WithId<Schedule | { attendees: FieldValue }>>
    >();

  const firestore = useFirestore();

  const updateGroupSchdule = useCallback(
    async (schedule: WithId<Partial<Schedule>>) => {
      setLoading(true);
      try {
        const group = doc(firestore, GROUPS_COLLECTION, groupId);
        const ref = doc(group, SCHEDULES_COLLECTION, schedule.id);
        await updateDoc(ref, schedule);

        setData(schedule);
      } catch (e) {
        setError((e as FirebaseError).message);
        throw e;
      }
    },
    [firestore, setData, setError, setLoading, groupId]
  );

  const deleteGroupSchdule = useCallback(
    async (scheduleId: string) => {
      setLoading(true);
      try {
        const group = collection(firestore, GROUPS_COLLECTION, groupId);
        const ref = doc(
          firestore,
          group.path,
          SCHEDULES_COLLECTION,
          scheduleId
        );
        await deleteDoc(ref);
      } catch (e) {
        setError((e as FirebaseError).message);
        throw e;
      }
    },
    [firestore, setError, setLoading, groupId]
  );

  return [updateGroupSchdule, deleteGroupSchdule, state] as [
    typeof updateGroupSchdule,
    typeof deleteGroupSchdule,
    typeof state
  ];
}
