// Define synthesizers and effects
const kick = new Tone.MembraneSynth().toDestination();
const snare = new Tone.NoiseSynth({
    noise: {
        type: 'white'
    },
    envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0
    }
}).toDestination();

// Define loops for kick and snare
const kickLoop = new Tone.Loop(time => {
    kick.triggerAttackRelease('C1', '8n', time);
}, '2n');

const snareLoop = new Tone.Loop(time => {
    snare.triggerAttackRelease('16n', time);
}, '2n').start('4n'); // Start snare offset by an 8th note

// Button controls
document.getElementById('playButton').addEventListener('click', async () => {
    // Start audio context on user interaction
    await Tone.start();
    console.log('Audio context started');

    // Play or stop the Transport
    if (Tone.Transport.state === 'stopped') {
        Tone.Transport.bpm.value = 120; // Set BPM
        Tone.Transport.start();
        kickLoop.start(0);
    } else {
        Tone.Transport.stop();
        kickLoop.stop();
        snareLoop.stop();
    }
});