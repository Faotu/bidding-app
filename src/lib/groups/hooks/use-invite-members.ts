import useSWRMutation from 'swr/mutation';
import { useApiRequest } from '~/core/hooks/use-api';
import { GroupMember } from '../types/group';

interface Invite {
  email: string;
  role: GroupMember;
}

export function useInviteMembers(groupId: string) {
  const endpoint = `/api/groups/${groupId}/invite`;
  const fetcher = useApiRequest<void, Invite[]>();

  return useSWRMutation(endpoint, (path, { arg: body }: { arg: Invite[] }) => {
    return fetcher({
      path,
      body,
    });
  });
}
