import { parseISO, format } from 'date-fns';

type Props = {
  dateString: string;
  dateFormat?: string;
};

const DateFormatter = ({ dateString, dateFormat = 'PP' }: Props) => {
  const date = parseISO(dateString);

  return <time dateTime={dateString}>{format(date, dateFormat)}</time>;
};

export default DateFormatter;
