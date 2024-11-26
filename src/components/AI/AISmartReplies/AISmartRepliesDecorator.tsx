/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { DataSource } from "../../../utils/DataSource";
import { DataSourceDecorator } from "../../../utils/DataSourceDecorator";
import { CometChatButton } from "../../BaseComponents/CometChatButton/CometChatButton";
import { AISmartRepliesView } from "./AISmartRepliesView";
import { AISmartRepliesConfiguration } from "./AISmartRepliesConfiguration";
import { CometChatActionsView, CometChatMessageComposerAction } from "../../../modals";
import { CometChatUIKitConstants } from "../../../constants/CometChatUIKitConstants";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";
import SmartReplyIcon from '../../../assets/ai_suggest_reply.svg';
import { CometChatUIEvents } from "../../../events/CometChatUIEvents";
import { CometChatMessageEvents } from "../../../events/CometChatMessageEvents";
export class AISmartRepliesDecorator extends DataSourceDecorator {
    public configuration?: AISmartRepliesConfiguration;
    public newDataSource!: DataSource;
    public loggedInUser!: CometChat.User | null;
    public user!: CometChat.User;
    public group!: CometChat.Group;
    public buttonRef: any;
    public isModalClosed: boolean = true;
    private closeCallback?: () => void;

    constructor(
        dataSource: DataSource,
        configuration?: AISmartRepliesConfiguration
    ) {
        super(dataSource);
        this.newDataSource = dataSource;
        this.configuration = configuration!;
        setTimeout(() => {
            this.addMessageListener();
        }, 1000);
    }

    override getId(): string {
        return "aismartreplies";
    }

    editReply(reply: string) {
        CometChatUIEvents.ccComposeMessage.next(reply);
    }

    closeIfMessageReceived(message: CometChat.BaseMessage) {
        if (message?.getReceiverId() === this.loggedInUser?.getUid()) {
            if (this.closeCallback) {
                if (!this.isModalClosed) {
                    this.closeCallback();
                    this.isModalClosed = true;
                }

            }
        }
    }

    getSmartReplies = (): Promise<string[]> => {
        return new Promise(async (resolve, reject) => {
            try {
                let receiverId: string = this.user
                    ? this.user?.getUid()
                    : this.group?.getGuid();
                let receiverType: string = this.user
                    ? CometChatUIKitConstants.MessageReceiverType.user
                    : CometChatUIKitConstants.MessageReceiverType.group;
                let configuration;

                if (this.configuration?.apiConfiguration) {
                    configuration = await this.configuration?.apiConfiguration(
                        this.user,
                        this.group
                    );
                }
                const response: any = await CometChat.getSmartReplies(
                    receiverId,
                    receiverType,
                    configuration ? configuration : {}
                );

                return resolve(response);
            } catch (e) {
                reject(e);
            }
        });
    };

    override getAIOptions(user: CometChat.User | null, group: CometChat.Group | null, id?: any): (CometChatMessageComposerAction | CometChatActionsView)[] {
        this.user = user!;
        this.group = group!;
        if (!id?.parentMessageId) {
            const messageComposerActions: (CometChatMessageComposerAction | CometChatActionsView)[] = super.getAIOptions(user, group, id);

            let newAction: CometChatActionsView = new CometChatActionsView({
                title: localize("SUGGEST_A_REPLY"),
                customView: (callback: any) => {

                    this.isModalClosed = false;
                    this.closeCallback = callback;
                    return <AISmartRepliesView title={localize("SUGGEST_A_REPLY")} configuration={this.configuration} getSmartRepliesCallback={this.getSmartReplies} editReplyCallback={this.editReply} closeCallback={callback} backCallback={callback} />
                },
                id: "ai-smart-replies",
                iconURL: SmartReplyIcon,
            });
            messageComposerActions.push(newAction);
            return messageComposerActions;
        } else {
            return super.getAIOptions(user, group, id);
        }
    }

    private addMessageListener(): void {
        CometChat.getLoggedinUser().then((user: CometChat.User | null) => {
            if (user) {
                this.loggedInUser = user;
            }
        });

        CometChatMessageEvents.onTextMessageReceived.subscribe((message) => {
            this.closeIfMessageReceived(message);
        });

        CometChatMessageEvents.onCustomMessageReceived.subscribe((message) => {
            this.closeIfMessageReceived(message);
        });

        CometChatMessageEvents.onMediaMessageReceived.subscribe((message) => {
            this.closeIfMessageReceived(message);
        });
    }
}
