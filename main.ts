
function parseFIO(input: string): { lastName: string; firstName: string; middleName?: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/).filter(part => part.length > 0);

  if (parts.length < 2 || parts.length > 3) return null;

  const isValidPart = (str: string) => /^[А-ЯЁ][а-яё]*$/.test(str);
  if (!parts.every(isValidPart)) return null;

  const [lastName, firstName, middleName] = parts;
  return { lastName, firstName, middleName: parts.length === 3 ? middleName : undefined };
}

function formatSignature(fio: { lastName: string; firstName: string; middleName?: string }): string {
  const firstInitial = fio.firstName[0] + '.';
  const middleInitial = fio.middleName ? ' ' + fio.middleName[0] + '.' : '';
  return `${firstInitial}${middleInitial} ${fio.lastName}`;
}
