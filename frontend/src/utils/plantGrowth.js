export function getPlantStage(level, witheredLevel = 0) {
  if (witheredLevel === 1) return 'withered1';
  if (witheredLevel === 2) return 'withered2';
  if (witheredLevel >= 3) return 'withered3';

  if (level >= 10) return 'phase3';
  if (level >= 4) return 'phase3';
  if (level >= 2) return 'phase2';
  return 'phase1';
}