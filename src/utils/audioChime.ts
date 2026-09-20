/**
 * Subtle environmental acoustic chime synthesizer using Web Audio API.
 * Avoids any external audio asset dependencies.
 */
export function playEnvironmentalAlertChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Dual-tone harmonic chime (E5 -> G#5) for an environmental advisory
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc1.frequency.exponentialRampToValueAtTime(830.61, now + 0.18); // G#5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(329.63, now); // E4 harmonic

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.46);
    osc2.stop(now + 0.46);
  } catch {
    // Graceful fallback if Web Audio is blocked by browser policy
  }
}
