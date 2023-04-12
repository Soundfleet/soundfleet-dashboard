import { format, getDay, parse, startOfWeek } from "date-fns";
import { dateFnsLocalizer } from "react-big-calendar";


const locales = {
  'en-US': require('date-fns/locale/en-US'),
}

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})