export const getComplementSet = <T extends { id: string }>(
  a?: T[],
  b?: T[],
) => {
  if (!a) {
    return [];
  }

  if (!b) {
    return a;
  }

  const bIds = b.map((act) => act.id);
  return a.filter((act) => !bIds.includes(act.id));
};
