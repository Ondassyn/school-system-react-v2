import { getYear, getMonth, subYears, addYears } from 'date-fns';

const currentDate = new Date();
const currentMonth = getMonth(currentDate);
export const CurrentYear =
  currentMonth < 7
    ? getYear(subYears(currentDate, 1)) + '-' + getYear(currentDate)
    : getYear(currentDate) + '-' + getYear(addYears(currentDate, 1));

export const PreviousYear =
  currentMonth < 7
    ? getYear(subYears(currentDate, 2)) +
      '-' +
      getYear(subYears(currentDate, 1))
    : getYear(subYears(currentDate, 1)) + '-' + getYear(currentDate);
