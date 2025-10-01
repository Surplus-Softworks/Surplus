export const aimState = {
  lastAimPos: null,
  aimTouchMoveDir: null,
  aimTouchDistanceToEnemy: null,
};

export const resetAimState = () => {
  aimState.lastAimPos = null;
  aimState.aimTouchMoveDir = null;
  aimState.aimTouchDistanceToEnemy = null;
};
