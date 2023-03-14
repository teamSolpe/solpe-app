export const trimHash = (
  hash: string,
  startCount: number = 4,
  endCount = 4,
) => {
  return (
    hash?.slice(0, startCount) +
    '...' +
    hash?.substring(hash?.length - endCount, hash?.length)
  );
};
