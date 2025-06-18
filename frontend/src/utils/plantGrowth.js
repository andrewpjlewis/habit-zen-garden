export function getPlantStage(level) {
  if (level >= 3) return 'phase3'; // full bloom
  if (level >= 2) return 'phase2'; // sprouting
  return 'phase1'; // seedling
}