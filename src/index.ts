export function isAgaza(date: Date = new Date()): boolean {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  const day = date.getDay();
  return day === 5 || day === 6;
}
