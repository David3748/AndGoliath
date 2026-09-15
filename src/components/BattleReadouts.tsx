import { useEffect, useRef } from 'react';
import { BEATS, battle } from '../lib/battleState';

// Command School readouts: the sim's own numbers, dim in the corner.
const status = (t: number, formics: number) => {
  if (t < BEATS.contact) return 'Closing';
  if (t < BEATS.fire - .5) return 'Engaged';
  if (t < BEATS.fire) return 'M.D. device armed';
  return formics > 0 ? 'Field spreading' : 'No contacts';
};

const clock = (t: number) => {
  const delta = t - BEATS.contact;
  const seconds = Math.abs(delta);
  const minutes = Math.floor(seconds / 60);
  return `T${delta < 0 ? '−' : '+'}${String(minutes).padStart(2, '0')}:${(seconds % 60).toFixed(1).padStart(4, '0')}`;
};

export default function BattleReadouts() {
  const statusRef = useRef<HTMLDivElement>(null);
  const fleetRef = useRef<HTMLElement>(null);
  const formicsRef = useRef<HTMLElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const shown = ['', '', '', ''];
    const set = (index: number, element: HTMLElement | null, value: string) => {
      if (!element || shown[index] === value) return;
      shown[index] = value;
      element.textContent = value;
    };
    const tick = () => {
      frame = requestAnimationFrame(tick);
      set(0, statusRef.current, status(battle.t, battle.formics));
      set(1, fleetRef.current, String(battle.fleet));
      set(2, formicsRef.current, battle.formics.toLocaleString('en-US'));
      set(3, clockRef.current, clock(battle.t));
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="battle-readout" aria-hidden="true">
      <div className="battle-readout-status" ref={statusRef} />
      <dl>
        <dt>Fleet</dt>
        <dd data-kind="fleet" ref={fleetRef} />
        <dt>Formics</dt>
        <dd ref={formicsRef} />
      </dl>
      <div className="battle-readout-clock" ref={clockRef} />
    </div>
  );
}
