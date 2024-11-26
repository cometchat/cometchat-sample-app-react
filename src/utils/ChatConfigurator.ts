import { MessagesDataSource } from "./MessagesDataSource";
import { DataSource } from "./DataSource";

/**
 * Class to initialize the cometchat datasource, to access getters and properties related to message components.
 * It is used in CometChatComposer, CometChatMessageComposer, CometChatMessageHeader, CometChatMessageList and AI module components.
 */
export class ChatConfigurator {
    static dataSource: DataSource;
    static names: Array<string> = ["message utils"];

    static init(initialSource?: DataSource) {
        this.dataSource = initialSource ?? new MessagesDataSource();
        if (!initialSource) {
            this.names = [];
        }
        this.names.push(this.dataSource.getId());
    }

    static enable(callback: (dataSource: DataSource) => DataSource) {
        let oldSource: DataSource = this.dataSource;
        let newSource: DataSource = callback(oldSource);

        if (!this.names.find(nm => nm === newSource.getId())) {
            this.dataSource = newSource;
            this.names.push(this.dataSource.getId());
        }
    }

    static getDataSource(): DataSource {
        return this.dataSource;
    }
}
