export class PollsConfiguration {
    private createPollIconURL: string;
    private deleteIconURL: string;
    private closeIconURL: string;
    private optionIconURL: string;
    private addAnswerIconURL: string;

    constructor(configuration: { createPollIconURL?: string, deleteIconURL?: string, closeIconURL?: string, optionIconURL?: string, addAnswerIconURL?: string }) {
        let { createPollIconURL, deleteIconURL, closeIconURL, optionIconURL, addAnswerIconURL } = configuration;
        this.createPollIconURL = (createPollIconURL as string);
        this.deleteIconURL = (deleteIconURL as string);
        this.closeIconURL = (closeIconURL as string);
        this.optionIconURL = (optionIconURL as string);
        this.addAnswerIconURL = (addAnswerIconURL as string);
    }

    getCreatePollIconURL(): string {
        return this.createPollIconURL;
    }

    getDeleteIconURL(): string {
        return this.deleteIconURL;
    }

    getCloseIconURL(): string {
        return this.closeIconURL;
    }

    getOptionIconURL(): string {
        return this.optionIconURL;
    }

    getAddAnswerIconURL(): string {
        return this.addAnswerIconURL;
    }


}