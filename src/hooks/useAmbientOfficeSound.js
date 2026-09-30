import { useCallback, useRef, useState } from "react";

export function useAmbientOfficeSound() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef(null);

  const start = useCallback(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0.045;
    master.connect(context.destination);

    const hum = context.createOscillator();
    hum.type = "sine";
    hum.frequency.value = 58;
    const humGain = context.createGain();
    humGain.gain.value = 0.28;
    hum.connect(humGain);
    humGain.connect(master);

    const fan = context.createOscillator();
    fan.type = "triangle";
    fan.frequency.value = 118;
    const fanFilter = context.createBiquadFilter();
    fanFilter.type = "lowpass";
    fanFilter.frequency.value = 360;
    const fanGain = context.createGain();
    fanGain.gain.value = 0.08;
    fan.connect(fanFilter);
    fanFilter.connect(fanGain);
    fanGain.connect(master);

    const lfo = context.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = context.createGain();
    lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);

    hum.start();
    fan.start();
    lfo.start();

    audioRef.current = { context, oscillators: [hum, fan, lfo], master };
    setEnabled(true);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.master.gain.setTargetAtTime(0, audio.context.currentTime, 0.08);
    window.setTimeout(() => {
      audio.oscillators.forEach((oscillator) => oscillator.stop());
      audio.context.close();
    }, 180);

    audioRef.current = null;
    setEnabled(false);
  }, []);

  const toggleSound = useCallback(() => {
    if (audioRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  return { enabled, toggleSound };
}
