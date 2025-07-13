let ID = 0;
export const createId = (type: string) => {
  return `${type}__${ID++}`;
};
