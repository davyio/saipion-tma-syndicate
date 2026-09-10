/**
 * SENSORY ENGINE (JONY IVE / APPLE AUDIO-TACTILE ETHOS)
 * Procedural Web Audio API synthesis coupled with Telegram WebApp Haptic feedback.
 * Zero external audio assets (MP3/WAV) required; synthesized in sub-millisecond real-time.
 */

class SensoryEngine {
  private ctx: AudioContext | null = null;
  private binauralOscLeft: OscillatorNode | null = null;
  private binauralOscRight: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Mechanical dial tick (Apple Watch crown feel)
   */
  public tick() {
    this.init();
    this.haptic("selection");
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.012);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.012);
    } catch (_) {}
  }

  /**
   * Tactile slide friction during drags/adjustments
   */
  public slide(progress: number) {
    this.init();
    this.haptic("light");
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = 260 + Math.min(progress, 1) * 600;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (_) {}
  }

  /**
   * Apple Pay style harmonic completion chime
   */
  public successChime() {
    this.init();
    this.notification("success");
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const tones = [587.33, 880.0]; // D5 and A5 harmonics

      tones.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.06;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (_) {}
  }

  /**
   * Deep vault / lock sub-bass thud
   */
  public lockThud() {
    this.init();
    this.haptic("rigid");
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.09);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (_) {}
  }

  /**
   * Start 40Hz Gamma wave generator for Silence focus app
   */
  public startSilenceSoundscape() {
    this.init();
    if (!this.ctx) return;

    try {
      if (this.binauralGain) return; // already running

      const now = this.ctx.currentTime;
      this.binauralGain = this.ctx.createGain();
      this.binauralGain.gain.setValueAtTime(0.05, now);
      this.binauralGain.connect(this.ctx.destination);

      // Left ear 200 Hz, Right ear 240 Hz -> 40 Hz Gamma wave
      this.binauralOscLeft = this.ctx.createOscillator();
      this.binauralOscRight = this.ctx.createOscillator();

      this.binauralOscLeft.type = "sine";
      this.binauralOscLeft.frequency.setValueAtTime(200, now);
      this.binauralOscLeft.connect(this.binauralGain);

      this.binauralOscRight.type = "sine";
      this.binauralOscRight.frequency.setValueAtTime(240, now);
      this.binauralOscRight.connect(this.binauralGain);

      this.binauralOscLeft.start(now);
      this.binauralOscRight.start(now);
    } catch (_) {}
  }

  public stopSilenceSoundscape() {
    try {
      if (this.binauralOscLeft) {
        this.binauralOscLeft.stop();
        this.binauralOscLeft.disconnect();
        this.binauralOscLeft = null;
      }
      if (this.binauralOscRight) {
        this.binauralOscRight.stop();
        this.binauralOscRight.disconnect();
        this.binauralOscRight = null;
      }
      if (this.binauralGain) {
        this.binauralGain.disconnect();
        this.binauralGain = null;
      }
    } catch (_) {}
  }

  private haptic(type: "light" | "medium" | "rigid" | "selection") {
    try {
      const tg = (window as any).Telegram?.WebApp?.HapticFeedback;
      if (!tg) return;
      if (type === "selection") tg.selectionChanged();
      else tg.impactOccurred(type);
    } catch (_) {}
  }

  private notification(type: "success" | "warning" | "error") {
    try {
      (window as any).Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
    } catch (_) {}
  }
}

export const sensory = new SensoryEngine();
