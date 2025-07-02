export function getPlantStage(level, witherLevel = 0) {
  if (witherLevel === 1) return 'withered1';
  if (witherLevel === 2) return 'withered2';
  if (witherLevel >= 3) return 'withered3';

  if (level >= 10) return 'phase3';
  if (level >= 4) return 'phase3';
  if (level >= 2) return 'phase2';
  return 'phase1';
}