import { PRIZES, MILESTONES } from './data';

export const calcPrize = (correctCount, reason) => {
  if (reason === 'stop') {
    return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  }

  const passedMilestones = MILESTONES.filter((m) => m <= correctCount);
  if (passedMilestones.length === 0) return 0;

  const highestMilestone = Math.max(...passedMilestones);
  return PRIZES[highestMilestone - 1];
};