export function getPlantStage(progress) {
  if (progress >= 6) return 'stage3';
  if (progress >= 3) return 'stage2';
  return 'stage1';
}
