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
export const today = getStartOfDay(Date.now());

export function getOffsetFromString(date: string): number {
  const offsetInDate = new Date(date).getTime();
  return Math.floor((today - offsetInDate) / (1000 * 60 * 60 * 24));
}
