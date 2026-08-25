/**
 * Gym Companion v1.0 — Lightweight Synthetic Audio Beeps & AI Workout Beat Generator
 * Generates crisp timer beeps, completion chimes, and procedural high-energy workout WAV audio tracks.
 */

class SoundGenerator {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playTimerBeep() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 high beep

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // Ignore audio errors
    }
  }

  public playRestFinishedChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Two rapid cheerful tones
      const freqs = [660, 880];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0.2, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.3);
      });
    } catch (e) {
      // Ignore
    }
  }

  public playAlarmBeepSequence() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Loud crystal alarm bell & chime sequence
      const chimeNotes = [
        { freq: 1046.5, delay: 0.0, dur: 0.3, vol: 0.25 }, // C6
        { freq: 1318.5, delay: 0.15, dur: 0.35, vol: 0.3 }, // E6
        { freq: 1567.98, delay: 0.3, dur: 0.5, vol: 0.35 }, // G6 bell
        { freq: 2093.0, delay: 0.5, dur: 0.8, vol: 0.4 }, // C7 resonant finish
      ];

      chimeNotes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.delay);

        gain.gain.setValueAtTime(0, now + note.delay);
        gain.gain.linearRampToValueAtTime(note.vol, now + note.delay + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.delay + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.delay);
        osc.stop(now + note.delay + note.dur);
      });
    } catch (e) {
      // Ignore
    }
  }

  public playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Generates a procedural PCM WAV audio data URL containing either a high-octane workout beat
   * or a soothing ambient focus soundscape (binaural 432Hz/528Hz waves & brown noise)
   */
  public generateWorkoutBeatAudioDataUrl(genre: string = 'Phonk Cyberpunk', bpm: number = 150, isAmbient: boolean = false): string {
    const isAmbientType = isAmbient || /ambient|foco|binaural|chuva|zen|ruído|natureza|soundscape/i.test(genre);
    const sampleRate = 22050;
    const durationSec = 12; // 12 second seamless loop
    const numSamples = sampleRate * durationSec;
    const buffer = new Float32Array(numSamples);

    if (isAmbientType) {
      // Ambient Soundscape Generation: Binaural 432Hz/528Hz Harmonics + Soft Brown Noise
      const carrierFreq = genre.includes('528') ? 528 : 432;
      const binauralBeatFreq = 10; // 10Hz Alpha/Beta focus wave
      let brownNoiseState = 0;

      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;

        // 1. Dual Tone Carrier Waves (Left/Right Binaural simulation)
        const toneLeft = Math.sin(2 * Math.PI * carrierFreq * t) * 0.25;
        const toneRight = Math.sin(2 * Math.PI * (carrierFreq + binauralBeatFreq) * t) * 0.25;
        
        // 2. Harmonic Ambient Pad (Subtle warm 5th)
        const padHarmonic = Math.sin(2 * Math.PI * (carrierFreq * 1.5) * t) * 0.08;

        // 3. Smooth Brown Noise (Deep relaxing ocean/rain rumble)
        const white = Math.random() * 2 - 1;
        brownNoiseState = (brownNoiseState + 0.02 * white) / 1.02;
        const brownNoise = brownNoiseState * 0.12;

        // 4. Slow LFO Pulsing for organic breathing feel
        const lfo = 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.1 * t);

        const val = (toneLeft + toneRight + padHarmonic + brownNoise) * lfo;
        buffer[i] = Math.max(-0.95, Math.min(0.95, val));
      }

      return createWavDataUrlFromAudioBuffer(buffer, sampleRate);
    }

    // High-Energy Beat Generation
    const bps = bpm / 60;
    const beatIntervalSamples = Math.floor(sampleRate / bps);

    // Tone frequencies according to genre
    let baseNote = 55; // A1
    if (genre.includes('Hardstyle')) baseNote = 65.41; // C2
    if (genre.includes('Funk')) baseNote = 73.42; // D2
    if (genre.includes('Techno')) baseNote = 49.0; // G1
    if (genre.includes('Metal')) baseNote = 41.2; // E1

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const sampleInBeat = i % beatIntervalSamples;
      const beatNum = Math.floor(i / beatIntervalSamples);

      let val = 0;

      // 1. Heavy Kick Drum on beat start
      if (sampleInBeat < sampleRate * 0.25) {
        const kickT = sampleInBeat / sampleRate;
        const kickFreq = 160 * Math.exp(-kickT * 30) + 40;
        const kickGain = Math.exp(-kickT * 12);
        val += Math.sin(2 * Math.PI * kickFreq * kickT) * kickGain * 0.6;
      }

      // 2. Snare / Clap on beats 2 and 4 (beatNum % 2 === 1 or beatNum % 4 === 2)
      if (beatNum % 2 === 1 && sampleInBeat < sampleRate * 0.2) {
        const snareT = sampleInBeat / sampleRate;
        const noise = Math.random() * 2 - 1;
        const snareGain = Math.exp(-snareT * 20);
        val += noise * snareGain * 0.35;
      }

      // 3. Hi-Hats every 1/8th note
      const halfBeatSamples = Math.floor(beatIntervalSamples / 2);
      const halfBeatSample = i % halfBeatSamples;
      if (halfBeatSample < sampleRate * 0.05) {
        const hatT = halfBeatSample / sampleRate;
        const hatNoise = Math.random() * 2 - 1;
        const hatGain = Math.exp(-hatT * 60);
        val += hatNoise * hatGain * 0.15;
      }

      // 4. Bassline / Synth lead
      const bassFreq = baseNote * (beatNum % 4 === 3 ? 1.25 : 1.0);
      const bassVal = Math.sin(2 * Math.PI * bassFreq * t) > 0 ? 0.2 : -0.2; // Square wave
      const bassGain = 0.25;
      val += bassVal * bassGain;

      // Master Limiter
      buffer[i] = Math.max(-0.95, Math.min(0.95, val));
    }

    // Convert Float32Array to 16-bit PCM WAV Data URL
    return createWavDataUrlFromAudioBuffer(buffer, sampleRate);
  }
}

function createWavDataUrlFromAudioBuffer(samples: Float32Array, sampleRate: number): string {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * (bitsPerSample / 8);
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, totalSize - 8, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (1 = PCM) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate */
  view.setUint32(28, byteRate, true);
  /* block align */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitsPerSample, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, dataSize, true);

  /* Write PCM samples */
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  /* Base64 encode arrayBuffer */
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = typeof window !== 'undefined' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
  return `data:audio/wav;base64,${base64}`;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export const soundGenerator = new SoundGenerator();

