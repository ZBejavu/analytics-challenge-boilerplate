export function getDateInFormat(dateNow:number): string{
  let year = new Date(dateNow).getFullYear()
  let day = new Date(dateNow).getDate()
  let month = new Date(dateNow).getMonth() +1;
  return `${year}/${month}/${day}`;
}
export function getStartOfDay(dateNow: number): number {
  const startOfDay = new Date(dateNow).setHours(0, 0, 0);
  return startOfDay;
}
export const today = Date.now();

export function FromStringToDayOffset(date: string): number {
  const offsetInDate = new Date(date).getTime();
  const now = getStartOfDay(today);
  return Math.floor((now - offsetInDate) / (1000 * 60 * 60 * 24));
}
