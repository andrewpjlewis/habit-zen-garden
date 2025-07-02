export function getPlantStage(level = 0, witheredLevel = 0) {
  let stage = 'phase1';
  let witheredStage = null;

  if (level >= 10) stage = 'phase3';
  else if (level >= 4) stage = 'phase3';
  else if (level >= 2) stage = 'phase2';

  if (witheredLevel === 1) witheredStage = 'withered1';
  else if (witheredLevel === 2) witheredStage = 'withered2';
  else if (witheredLevel >= 3) witheredStage = 'withered3';

  return { stage, witheredStage };
}
