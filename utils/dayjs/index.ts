import dayjs from 'dayjs';
import 'dayjs/locale/de';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { locale } from '../../i18n';
import { Timestamp } from '../../protos/google/protobuf/timestamp';

dayjs.extend(LocalizedFormat);

export const FormatDate = (
  timestamp?: Timestamp,
  format: string = 'llll',
): string => {
  if (!timestamp) {
    return '';
  }

  return dayjs.unix(timestamp.seconds).locale(locale).format(format);
};

export const toISOString = (timestamp?: Timestamp): string | undefined => {
  if (!timestamp) {
    return undefined;
  }

  return dayjs.unix(timestamp.seconds).toISOString();
};

export const toTimestamp = (date: string): Timestamp => ({
  seconds: dayjs(date).unix(),
  nanos: 0,
});
