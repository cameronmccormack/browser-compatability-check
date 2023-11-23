import { CompatStatement, Identifier } from '@mdn/browser-compat-data/types';

export const findCompatNode = (
  targetNodeName: string,
  currentNode: Identifier,
): CompatStatement | null => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __compat, ...currentNodeWithoutCompatStatement } = currentNode;

  const compatStatement =
    currentNodeWithoutCompatStatement[targetNodeName]?.__compat;
  if (compatStatement) {
    return compatStatement;
  }

  for (const node of Object.values(currentNodeWithoutCompatStatement)) {
    const foundCompatNode = findCompatNode(targetNodeName, node);
    if (foundCompatNode) {
      return foundCompatNode;
    }
  }
  return null;
};
