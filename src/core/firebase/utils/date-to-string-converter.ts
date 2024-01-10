import { QueryDocumentSnapshot } from 'firebase/firestore';

export const dateToStringConverter = {
  toFirestore: function (data: any) {
    // Convert all Date fields to strings
    let transformed = { ...data };
    for (let field in transformed) {
      if (transformed[field] instanceof Date) {
        transformed[field] = transformed[field].toISOString();
      }
    }
    return transformed;
  },
  fromFirestore: function (snapshot: QueryDocumentSnapshot) {
    const data = snapshot.data();
    let transformed = { ...data };
    for (let field in transformed) {
      if (
        typeof transformed[field] === 'string' &&
        transformed[field].match(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        )
      ) {
        transformed[field] = new Date(transformed[field]);
      }
    }
    return transformed;
  },
};
