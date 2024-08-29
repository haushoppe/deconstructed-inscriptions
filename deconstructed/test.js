
// Chillwave/Trap Music Simulation

// Setup BPM
Tone.Transport.bpm.value = 80;

// Define instruments
const drums = new Tone.MembraneSynth().toDestination();

const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
        type: 'sine'
    }
}).toDestination();

const piano = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
        type: 'sine'
    }
}).toDestination();

const bass = new Tone.MonoSynth({
    oscillator: {
        type: 'square'
    },
    envelope: {
        attack: 0.1,
        decay: 0.3,
        release: 2
    }
}).toDestination();

const choir = new Tone.PolySynth(Tone.Synth, {
    volume: -10,
    oscillator: {
        type: 'sawtooth'
    },
    envelope: {
        attack: 0.5,
        decay: 0.1,
        sustain: 0.3,
        release: 1
    }
}).toDestination();

// Effects
const reverb = new Tone.Reverb({
    decay: 2.5,
    preDelay: 0.3
}).toDestination();
synth.connect(reverb);
piano.connect(reverb);
choir.connect(reverb);

// const scratch = new Tone.FeedbackDelay("8n", 0.5).toDestination();
// synth.connect(scratch);

// Melody and chord progression
const melody = ["B4", "D5", "F#4", "E5", "B4", "D5", "F#4", "E5"];
const chords = ["B3", "D4", "F#3", "B3", "D4", "F#3", "B3", "D4"];
const bassLine = ["B1", "D2", "F#1", "B1"];

// Sequence for synth melody
const melodyPart = new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, "8n", time);
}, melody, "16n");

// Sequence for piano chords
const chordPart = new Tone.Sequence((time, note) => {
    piano.triggerAttackRelease(note, "4n", time);
}, chords, "2n");

// Bass pattern
const bassPattern = new Tone.Sequence((time, note) => {
    bass.triggerAttackRelease(note, "2n", time);
}, bassLine, "2n");

// Choir pattern
const choirPattern = new Tone.Sequence((time, note) => {
    choir.triggerAttackRelease(note, "4n", time);
}, ["D5", "F#5", "A5", "C#6"], "1n");

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
        chordPart.start('2m');
        bassPattern.start('4m');
        choirPattern.start('8m');
        drumPattern.start('1m');
    } else {
        Tone.Transport.stop();
        melodyPart.stop();
        chordPart.stop();
        bassPattern.stop();
        choirPattern.stop();
        drumPattern.stop();
    }
});