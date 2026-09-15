// The battle canvas publishes its clock and tallies here every frame so page overlays
// (readouts, the name burst) can react without React re-renders.

export const BEATS = { advance: .6, contact: 3.8, arrive: 6.1, fire: 6.5, spread: 2.6, wave: 7.4, end: 13.5 };
export const WAVE_SPEED = 1.6; // blast front, in planet radii per second
export const FLEET_SIZE = 48;

export const battle = {
  t: 0,
  fleet: FLEET_SIZE,
  formics: 0,
  // Planet centre and radius in viewport pixels
  anchorX: 0,
  anchorY: 0,
  unit: 0,
  // Story time by which the name has fully re-formed after the blast; the battle doesn't end before it.
  nameHome: 0,
};
