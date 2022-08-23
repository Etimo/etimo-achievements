export const KICKBACK = 0.1;
export const MAXIMUM_KICKBACK_POINTS = 50;

export function getKickback(pts: number) {
  return Math.floor(Math.min(KICKBACK * pts, MAXIMUM_KICKBACK_POINTS));
}
