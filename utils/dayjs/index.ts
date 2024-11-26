import dayjs from 'dayjs';
import 'dayjs/locale/de';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { locale } from '../../i18n';
import { Timestamp } from '../../protos/google/protobuf/timestamp';

dayjs.extend(LocalizedFormat);

export const FormatDate = (
  timestamp?: Timestamp,
  format: string = 'llll',
): string =>
  !timestamp ? '' : dayjs.unix(timestamp.seconds).locale(locale).format(format);

export const toISOString = (timestamp?: Timestamp): string | undefined =>
  !timestamp ? undefined : dayjs.unix(timestamp.seconds).toISOString();

export const toTimestamp = (date: string): Timestamp => ({
  seconds: dayjs(date).unix(),
  nanos: 0,
});

export const isAfterNow = (timestamp?: Timestamp): boolean =>
  !timestamp ? false : dayjs(timestamp.seconds).isAfter(dayjs());

export const nowIsBetweenTimestampTodayAndEndOfDay = (
  timestamp?: Timestamp,
): boolean => {
  if (!timestamp) {
    return false;
  }

  const startOfDay = dayjs().startOf('day');
  const dayAfterAt2AM = dayjs().add(1, 'day').startOf('day').add(2, 'hours');

  return (
    dayjs.unix(timestamp.seconds).isAfter(startOfDay) &&
    dayjs().isAfter(dayjs.unix(timestamp.seconds)) &&
    dayjs.unix(timestamp.seconds).isBefore(dayAfterAt2AM)
  );
};
