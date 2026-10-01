/**
 * Drop dates are stored as timestamptz and always entered/displayed in
 * Nigerian time. Africa/Lagos is WAT (UTC+1) with no daylight saving, so the
 * offset is constant — which is what makes the fixed "+01:00" below exact.
 */
const LAGOS_TZ = "Africa/Lagos";
const LAGOS_OFFSET = "+01:00";

/** Pull Y/M/D/h/m for an instant as they read in Lagos. */
function lagosParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: LAGOS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    // en-GB gives "24" for midnight; <input type="datetime-local"> wants "00".
    hour: get("hour") === "24" ? "00" : get("hour"),
    minute: get("minute"),
  };
}

/**
 * timestamptz → the "YYYY-MM-DDTHH:mm" an <input type="datetime-local">
 * expects, in Lagos time. The admin sees WAT whatever their device is set to.
 */
export function toDateTimeInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const { year, month, day, hour, minute } = lagosParts(iso);
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/**
 * The reverse: a datetime-local value is read as Lagos wall-clock time and
 * returned as a UTC ISO string for the database.
 */
export function fromDateTimeInput(value: string): string | null {
  if (!value) return null;
  // Accept both "YYYY-MM-DDTHH:mm" and a bare "YYYY-MM-DD" (legacy rows).
  const withTime = value.includes("T") ? value : `${value}T00:00`;
  const d = new Date(`${withTime}:00${LAGOS_OFFSET}`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** "1 October 2026" — Lagos time. */
export function formatDropDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    timeZone: LAGOS_TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "1 October 2026, 18:00 WAT" — Lagos time. */
export function formatDropDateTime(iso: string): string {
  const date = formatDropDate(iso);
  const time = new Date(iso).toLocaleTimeString("en-GB", {
    timeZone: LAGOS_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date}, ${time} WAT`;
}
