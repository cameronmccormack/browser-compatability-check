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

export const getChunkedArray = <T>(array: T[], chunkSize: number): T[][] =>
  array.reduce((resultArray: T[][], item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
