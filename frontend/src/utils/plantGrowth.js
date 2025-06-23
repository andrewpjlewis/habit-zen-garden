export function getPlantStage(level) {
  if (level < 2) return 'phase1';
  if (level < 4) return 'phase2';
  return 'phase3';
}