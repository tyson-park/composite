export function parseDate(dateString: string): string | null {
  if (!dateString || !/^\d{2}\.\d{2}\.\d{2}$/.test(dateString)) {
    return null;
  }

  const [day, month, year] = dateString.split(".");
  const fullYear = `20${year}`;
  const parsedDate = new Date(`${fullYear}-${month}-${day}`);

  if (isNaN(parsedDate.getTime())) {
    return null; // Invalid date
  }

  return parsedDate.toISOString();
}