
export class MediaManager{

    static videoPlayer = NULL;
    static streamVideo = NULL;
    static recorder = NULL;



    initCamera(domObject){

        this.videoPlayer = domObject;

        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
           
            navigator.mediaDevices.getUserMedia({ video: true, audio:true })
            .then((streamData)=>{
                this.stream = streamData;
                this.startPlaying();

            });
        }
    }

    startPlaying(){
        videoPlayer.srcObject = stream;
        videoPlayer.play();
    }

    startRecordingVideo(){
        recorder = new MediaRecorder(stream);
        recorder.start();
    }

    stopRecording(){

        recorder.ondataavailable = e => {    
                   
            let fileName = ['video_', (new Date() + '').slice(4, 28), '.webm'].join('');
            
            return URL.createObjectURL(e.data);
            
        };

        recorder.stop();
    }
    
}

