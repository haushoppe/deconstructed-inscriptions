
// Chillwave/Trap Music Simulation

// Setup BPM and scale
Tone.Transport.bpm.value = 80.75;

// Define instruments
const drums = new Tone.MembraneSynth().toDestination();
const synth = new Tone.PolySynth({
    voice: Tone.Synth,
    options: {
        oscillator: {
            type: 'sine'
        }
    }
}).toDestination();
const piano = new Tone.PolySynth({
    voice: Tone.Synth,
    options: {
        oscillator: {
            type: 'sine'
        }
    }
}).toDestination();
synth.volume.value = -12;  // Lower the synth volume
piano.volume.value = -8;  // Lower the piano volume

// Reverb and Delay effects
const reverb = new Tone.Reverb({
    decay: 2.5,
    preDelay: 0.3
}).toDestination();
synth.connect(reverb);
piano.connect(reverb);

// Define melody and chord progression in B minor
const melody = ["B4", "D5", "F#4", "E5", "B4", "D5", "F#4", "E5"];
const chords = ["B3", "D4", "F#3", "B3", "D4", "F#3", "B3", "D4"];

// Sequence for synth melody
const melodyPart = new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, "8n", time);
}, melody, "16n");

// Sequence for piano chords
const chordPart = new Tone.Sequence((time, note) => {
    piano.triggerAttackRelease(note, "4n", time);
}, chords, "2n");

// Drum pattern
const drumPattern = new Tone.Pattern((time) => {
    drums.triggerAttackRelease("C2", "8n", time);
}, ["C2"], "up");

// Play / Stop Button
document.getElementById('playButton').addEventListener('click', async () => {
    await Tone.start();  // Start the Audio Context
    console.log("Playback started");

    if (Tone.Transport.state === 'stopped') {
        Tone.Transport.start();
        melodyPart.start(0);
        chordPart.start(0);
        drumPattern.start(0);
    } else {
        Tone.Transport.stop();
        melodyPart.stop();
        chordPart.stop();
        drumPattern.stop();
    }
});