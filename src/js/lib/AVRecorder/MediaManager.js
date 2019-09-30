
export default class MediaManager{

    static videoPlayer = null;
    static streamVideo = null;
    static recorder = null;
    
    static initCamera(domObject){
        MediaManager.videoPlayer = domObject;
        if (this.hasGetUserMedia()) {
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true})
                .then((streamData)=>{    
                    this.stream = streamData;
                    this.startPlaying();
                });
            }
        }else{
            alert('getUserMedia() is not supported by your browser');
        }
    }

    static hasGetUserMedia = ()=> {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    static startPlaying(){
        this.videoPlayer.srcObject = this.stream;
        this.videoPlayer.play();
    }

    static stopPlaying(){
        this.videoPlayer.pause();
        if (this.stream){
            this.stream.getTracks().forEach(function(track) {
               track.stop();
            });
        }
    }

    startRecordingVideo(){
        recorder = new MediaRecorder(this.stream);
        recorder.start();
    }

    stopRecording(){
        recorder.ondataavailable = e => {
            let fileName = ['video_', (new Date() + '').slice(4, 28), '.webm'].join('');
            return URL.createObjectURL(e.data);
        };
        recorder.stop();
    }

    static captureImage=()=>{
        const canvas = document.createElement('canvas');
        canvas.width = MediaManager.videoPlayer.videoWidth;
        canvas.height = MediaManager.videoPlayer.videoHeight;
        canvas.getContext('2d').drawImage(MediaManager.videoPlayer, 0, 0);
        return canvas.toDataURL('image/png');
    }
    
}