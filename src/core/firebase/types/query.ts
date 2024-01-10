import { WhereFilterOp } from 'firebase/firestore';

export type FilterType = {
  field: string;
  op: WhereFilterOp;
  value: any;
};
