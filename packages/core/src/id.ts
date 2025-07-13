/**
 * ID generation utility for creating unique identifiers
 * Used internally by the state management system
 */

let ID = 0;

/**
 * Creates a unique ID with a type prefix
 * @param type - The type prefix for the ID
 * @returns A unique string ID in format "type__number"
 */
export const createId = (type: string) => {
  return `${type}__${ID++}`;
};
