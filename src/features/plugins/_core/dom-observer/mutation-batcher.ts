export function batchMutations(mutations: MutationRecord[]): MutationRecord[] {
  // Group mutations by target
  const batchMap = new Map<Node, MutationRecord[]>();

  for (const mutation of mutations) {
    const existingMutations = batchMap.get(mutation.target) || [];
    existingMutations.push(mutation);
    batchMap.set(mutation.target, existingMutations);
  }

  // Return array of mutations, one per target
  return Array.from(batchMap.values()).map(
    (targetMutations) => targetMutations[0],
  );
}
