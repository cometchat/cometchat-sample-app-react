
export class OutgoingCallConfiguration {
    disableSoundForCalls?: boolean = false;
    customSoundForCalls?: string;
    customView?: any;
    onError?: Function;
    onCloseClicked?: Function;
    constructor(configuration: OutgoingCallConfiguration) {
        this.disableSoundForCalls = configuration?.disableSoundForCalls;
        this.customView = configuration?.customView;
        this.onError = configuration?.onError;
        this.onCloseClicked = configuration?.onCloseClicked;
    }
}
