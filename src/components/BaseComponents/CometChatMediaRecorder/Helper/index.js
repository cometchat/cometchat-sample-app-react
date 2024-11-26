import Microphone from './microphone.js';

const defaultConfig = {
  nFrequencyBars: 255,
  onAnalysed: null,
};

const microphoneConfigOptions = ['bufferLen', 'numChannels', 'mimeType'];

class Recorder {
  constructor(audioContext, config = {}) {
    this.config = Object.assign({}, defaultConfig, config);

    this.audioContext = audioContext;
    this.audioInput = null;
    this.realAudioInput = null;
    this.inputPoint = null;
    this.audioRecorder = null;
    this.rafID = null;
    this.analyserContext = null;
    this.recIndex = 0;
    this.stream = null;

    this.microphoneConfig = microphoneConfigOptions.reduce((a, c) => {
      if (config[c]) {
        a[c] = config[c];
      }
      return a;
    }, {});

    this.updateAnalysers = this.updateAnalysers.bind(this);
  }

  init(stream) {
    return new Promise((resolve) => {
      this.inputPoint = this.audioContext.createGain();

      this.stream = stream;

      this.realAudioInput = this.audioContext.createMediaStreamSource(stream);
      this.audioInput = this.realAudioInput;
      this.audioInput.connect(this.inputPoint);

      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 2048;
      this.inputPoint.connect(this.analyserNode);

      this.audioRecorder = new Microphone(this.inputPoint, this.microphoneConfig);

      const zeroGain = this.audioContext.createGain();
      zeroGain.gain.value = 0.0;

      this.inputPoint.connect(zeroGain);
      zeroGain.connect(this.audioContext.destination);

      this.updateAnalysers();

      resolve();
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      if (!this.audioRecorder) {
        reject('Not currently recording');
        return;
      }

      this.audioRecorder.clear();
      this.audioRecorder.record();

      resolve(this.stream);
    });
  }

  stop() {
    return new Promise((resolve) => {
      this.audioRecorder.stop();

      this.audioRecorder.getBuffer((buffer) => {
        this.audioRecorder.exportWAV(blob => resolve({buffer, blob}));
      });
    });
  }

  updateAnalysers() {
    if (this.config.onAnalysed) {
      requestAnimationFrame(this.updateAnalysers);

      const freqByteData = new Uint8Array(this.analyserNode.frequencyBinCount);

      this.analyserNode.getByteFrequencyData(freqByteData);

      const data = new Array(255);
      let lastNonZero = 0;
      let datum;

      for (let idx = 0; idx < 255; idx += 1) {
        datum = Math.floor(freqByteData[idx]) - (Math.floor(freqByteData[idx]) % 5);

        if (datum !== 0) {
          lastNonZero = idx;
        }

        data[idx] = datum;
      }

      this.config.onAnalysed({data, lineTo: lastNonZero});
    }
  }

  setOnAnalysed(handler) {
    this.config.onAnalysed = handler;
  }
}

Recorder.download = function download(blob, filename = 'audio') {
  Microphone.forceDownload(blob, `${filename}.wav`);
};

export default Recorder;