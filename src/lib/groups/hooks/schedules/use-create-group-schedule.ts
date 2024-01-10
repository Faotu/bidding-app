import { FirebaseError } from 'firebase/app';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import { useCallback } from 'react';

import { useRequestState } from '~/core/hooks/use-request-state';
import { Schedule } from '~/lib/groups/types/group';
import {
  GROUPS_COLLECTION,
  SCHEDULES_COLLECTION,
} from '~/lib/firestore-collections';
import { useUser } from 'reactfire';
import { dateToStringConverter } from '~/core/firebase/utils/date-to-string-converter';

/**
 * @name useCreateGroupSchedule
 * @description Hook to update a group's information
 */
export function useCreateGroupSchedule() {
  const user = useUser();
  const userId = user.data?.uid as string;
  const { state, setError, setData, setLoading } =
    useRequestState<Partial<Schedule>>();

  const firestore = getFirestore();
  const batch = writeBatch(firestore);

  const createGroupSchedule = useCallback(
    async (schedule: Schedule) => {
      setLoading(true);

      try {
        const group = doc(firestore, GROUPS_COLLECTION, schedule.groupId);
        const schedules = collection(group, SCHEDULES_COLLECTION).withConverter(
          dateToStringConverter
        );;
        const scheduleDoc = doc(schedules);
        const scheduleData: WithId<Schedule> = {
          ...schedule,
          ownerId: userId,
          id: scheduleDoc.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        batch.set(scheduleDoc, scheduleData);
        await batch.commit();
        setData(schedule);
      } catch (e) {
        setError((e as FirebaseError).message);
        throw e;
      }
    },
    [firestore, setData, setError, setLoading, batch, userId]
  );

  return [createGroupSchedule, state] as [
    typeof createGroupSchedule,
    typeof state
  ];
}
