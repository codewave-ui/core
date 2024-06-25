import { Duration } from 'luxon';

export function convertTimeMillisToPrettyString(time: number) {
  const durationInstance = Duration.fromMillis(time).shiftTo('days', 'hours', 'minutes', 'seconds');
  let result = '';
  if (durationInstance.days) {
    result += `${durationInstance.days} day(s) `;
  }

  if (durationInstance.hours) {
    result += `${durationInstance.hours} hour(s) `;
  }
  if (durationInstance.minutes) {
    result += `${durationInstance.minutes} minute(s) `;
  }
  result += `${durationInstance.seconds} second(s)`;
  return result;
}
