export const getUniqueObjectArray = <T>(array: T[]): T[] =>
  array.filter((value, index) => {
    const stringifiedValue = JSON.stringify(value);
    return (
      index ===
      array.findIndex((item) => {
        return JSON.stringify(item) === stringifiedValue;
      })
    );
  });
