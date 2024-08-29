// Chillwave/Trap Music Simulation

// Set up the beats per minute (BPM) for the entire composition to 80
// Setting it to 80 means the track will have a slow, relaxed pace.
Tone.Transport.bpm.value = 80;

const audioUrls = {
  digitalCurrency: "/content/ca666064f776995d96c5f1bc6f4a1aad31e2216ec22fb06e3c94a0a44f4331bai0", // https://www.ord.io/1481
  melody: "/content/e47f4f20f7d8729748f3e80a36b9e2d600b642880139bffb8394ead26136652ei0" // https://www.ord.io/35155658
};


// Define instruments
// Create a membrane synthesizer for drum sounds and route output to speakers
// (ideal for creating percussive sounds like kicks)
const drums = new Tone.MembraneSynth().toDestination();

// Create a polyphonic synthesizer with a sine wave for melodic content
// Polyphony means it can play multiple notes at once.
const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: 'sine'
  }
}).toDestination();

// Create another polyphonic synthesizer set up like a piano with sine waves
const piano = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: 'sine'
  }
}).toDestination();

// Set up a monophonic synthesizer for bass lines with a square wave oscillator
// Monophonic means it can only play one note at a time.
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

// Create a choir-like sound using a polyphonic synthesizer with a sawtooth wave
// The volume is set lower to blend well with other instruments.
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
// Apply reverb to create a sense of space, connected to main audio output
// Reverb is an effect that simulates the way sound bounces off walls and objects in a space
const reverb = new Tone.Reverb({
  decay: 2.5,
  preDelay: 0.3
}).toDestination();

// Connect instruments to reverb effect
// These lines connect the synthesizer, piano, and choir to the reverb effect,
// meaning their sounds will be processed through the reverb before reaching the speakers.
synth.connect(reverb);
piano.connect(reverb);
choir.connect(reverb);

// Define musical content
// Arrays of notes for melody, chords, bass line, etc
const melodyNotes = ["B4", "D5", "F#4", "E5", "B4", "D5", "F#4", "F#4", "E5"];
const chordNotes = ["B3", "D4", "F#3", "B3", "D4", "F#3", "B3", "D4"];
const bassNotes = ["B1", "D2", "F#1", "B1"];
const chorNotes = ["D5", "F#5", "A5", "C#6"];
const drumNotes = ["C2"];

// Create sequence to play synth melody
// It triggers each note for an eighth note duration (8n)
// and moves to the next note every sixteenth note (16n).
const melodyPart = new Tone.Sequence((time, note) => { synth.triggerAttackRelease(note, "8n", time); }, melodyNotes, "16n");

// Create sequence for piano chords, each note is held for a quarter note (4n) and changes every half note (2n).
const chordPart = new Tone.Sequence((time, note) => { piano.triggerAttackRelease(note, "4n", time); }, chordNotes, "2n");

// Create sequence for bass pattern, each note held for a half note
const bassPattern = new Tone.Sequence((time, note) => { bass.triggerAttackRelease(note, "2n", time); }, bassNotes, "2n");

// Create sequence for choir pattern, holding each note for a whole note duration
const choirPattern = new Tone.Sequence((time, note) => { choir.triggerAttackRelease(note, "4n", time); }, chorNotes, "1n");

// Create drum pattern, triggering a drum hit at each upward pattern step
const drumPattern = new Tone.Pattern((time, note) => { drums.triggerAttackRelease(note, "8n", time); }, drumNotes, "up");




// Preload buffer and initialize all components but do not start anything yet
var players = [];

// Setup audio by loading buffers and preparing players
function setupAudio(urls) {

  const buffers = new Tone.Buffers(urls, () => {
    console.log("All audio buffers are now available.");
    document.getElementById('playButton').disabled = false;
    setupPlayers(buffers);
  });
}

// Function to setup players using the loaded buffers
function setupPlayers(buffers) {

  Object.keys(audioUrls).forEach(name => {
    players[name] = new Tone.Player(buffers.get(name)).toDestination();
  });

  // Log that players are setup and ready to use
  console.log("Players are setup and ready to play:", players);
}


/**
 * Plays a sample based on a scheduler
 *
 * @param {string} name - The name of the sample to play.
 * @param {number} sampleOffset - The offset from the beginning of the sample to start at.
 * @param {number} sampleDuration - How long the sample should play, in seconds.
 * @param {string} startTime - The musical notation for when to start the initial playback (e.g., "1m").
 * @param {string} interval - The musical notation for the interval between repeats (e.g., "4n").
 * @param {string} duration - How long to continue repeating, expressed in musical notation (e.g., "8m").
 */
function playSample(name, sampleOffset, sampleDuration, startTime, interval, duration) {
  const player = players[name];

  // scheduleRepeat(callback, interval, startTime, duration)
  // Schedule an event to be invoked repeatedly:
  // 1. `interval`: The time interval between each invocation (e.g., "4n").
  // 2. `startTime`: When to start the first invocation (e.g., "1m").
  // 3. `duration`: How long from `startTime` to keep repeating the event.
  // The duration should be calculated as the total time from the start, not the duration of each individual event.
  Tone.Transport.scheduleRepeat(function(time) {
      // `time` is the precise time when this callback is fired, which aligns with the transport's timeline
      // Use the exact `time` provided for precise synchronization
      console.log('Play', name, 'at', time);
      player.start(time, sampleOffset, sampleDuration);
  }, interval, startTime, duration);
}

// Call setupAudio early in your page load
setupAudio(audioUrls);


// Add Play / Stop functionality to button on web page
document.getElementById('playButton').addEventListener('click', async () => {

  await Tone.start();  // Start the Audio Context
  console.log("Playback started");

  if (Tone.Transport.state === 'stopped') {
    // Start all sequences and patterns if the Transport is stopped
    Tone.Transport.start();

    melodyPart.start(0);
    chordPart.start('2m');
    bassPattern.start('4m');
    choirPattern.start('8m');
    drumPattern.start('1m');

    playSample('digitalCurrency', 1, 2.4, "4n", "1m", "2m");
    // playSample('melody', 11, 11, "1m", "4m", "4m");

  } else {
    // Stop all sequences and patterns if the Transport is running
    Tone.Transport.stop();
    melodyPart.stop();
    chordPart.stop();
    bassPattern.stop();
    choirPattern.stop();
    drumPattern.stop();
  }

});
