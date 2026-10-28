import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TaskType } from "./definitions";

dayjs.extend(customParseFormat);

export const DATE_FORMAT = "YYYY-MM-DD";

export const todayKey = () => dayjs().format(DATE_FORMAT);

export const dayKey = (offset: number) =>
  dayjs().add(offset, "day").format(DATE_FORMAT);

// Hours were stored as "hh:mm A" by older versions and "HH:mm" now.
export function parseTime(value: string | null | undefined) {
  if (!value) return null;
  const parsed = dayjs(value.trim(), ["hh:mm A", "h:mm A", "HH:mm", "H:mm"], true);
  return parsed.isValid() ? parsed : null;
}

export function formatTime(value: string | null | undefined) {
  return parseTime(value)?.format("HH:mm") ?? "";
}

export function formatTimeRange(task: Pick<TaskType, "hourfrom" | "hourto">) {
  const from = formatTime(task.hourfrom);
  const to = formatTime(task.hourto);
  if (from && to) return `${from} – ${to}`;
  return from || to;
}

function minutes(value: string | null | undefined) {
  const t = parseTime(value);
  return t ? t.hour() * 60 + t.minute() : -1;
}

// By date, then tasks without hours first, then by start time.
export function compareTasks(a: TaskType, b: TaskType) {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  return minutes(a.hourfrom) - minutes(b.hourfrom);
}

export function relativeDayLabel(date: string) {
  if (date === todayKey()) return "Today";
  if (date === dayKey(1)) return "Tomorrow";
  if (date === dayKey(-1)) return "Yesterday";
  return dayjs(date).format("dddd D MMMM");
}

export default dayjs;
