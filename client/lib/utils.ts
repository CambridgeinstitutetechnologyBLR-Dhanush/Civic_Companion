const formatter = new Intl.DateTimeFormat('en-IN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

export function formatDate(date: string | number | Date): string {
  return formatter.format(new Date(date));
}
