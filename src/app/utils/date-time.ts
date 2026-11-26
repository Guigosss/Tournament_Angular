const pad = (n: number): string => String(n).padStart(2, '0');

//- Date -> "2026-11-25T14:00" (local time, like the old datetime local)
export function toLocalDateTime(value: Date | string | null): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

//- "2026-11-25T14:00" -> Date (to prefill the form in edit mode)
export function fromLocalDateTime(value: string | null): Date | null {
  return value ? new Date(value) : null;
}
