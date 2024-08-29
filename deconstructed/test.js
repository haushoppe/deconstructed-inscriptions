  // Define synthesizers and effects
  const kick = new Tone.MembraneSynth({
    volume: -10
}).toDestination();

const snare = new Tone.NoiseSynth({
    volume: -5,
    noise: {
        type: 'white'
    },
    envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.05,
        release: 0.01
    }
}).toDestination();

const bassSynth = new Tone.MonoSynth({
    volume: -10,
    oscillator: {
        type: 'square'
    },
    envelope: {
        attack: 0.1,
        decay: 0.3,
        release: 2
    }
}).toDestination();

const pluckSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -8,
    oscillator: {
        type: "sine"
    },
    envelope: {
        attack: 0.5,
        decay: 0.1,
        sustain: 0.3,
        release: 1
    }
}).toDestination();

// Rhythmic patterns
const kickPattern = new Tone.Pattern((time) => {
    kick.triggerAttackRelease('C1', '8n', time);
}, ['C1'], "up");

const snarePattern = new Tone.Pattern((time) => {
    snare.triggerAttackRelease('16n', time);
}, [''], "random", '2n');

const bassPattern = new Tone.Sequence((time, note) => {
    bassSynth.triggerAttackRelease(note, '16n', time);
}, ["C2", "G1", "C1", "E1"], "4n");

const pluckPattern = new Tone.Sequence((time, note) => {
    pluckSynth.triggerAttackRelease(note, '8n', time);
}, ["E4", "G4", "B4", "D5"], "4n");

// Control Play/Stop
document.getElementById('playButton').addEventListener('click', async () => {
    await Tone.start();  // Required to start audio context
    if (Tone.Transport.state === 'stopped') {
        Tone.Transport.bpm.value = 128;
        Tone.Transport.start();
        kickPattern.start(0);
        snarePattern.start('1m'); // Start snare one measure in
        bassPattern.start('2m');  // Start bass two measures in
        pluckPattern.start('3m'); // Start pluck three measures in
    } else {
        Tone.Transport.stop();
        kickPattern.stop();
        snarePattern.stop();
        bassPattern.stop();
        pluckPattern.stop();
    }
});