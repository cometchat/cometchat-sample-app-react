import { localize } from "../../resources/CometChatLocalize/cometchat-localize";
import { CometChatButton } from "../BaseComponents/CometChatButton/CometChatButton";
import closeIcon from "../../assets/close.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import { DatePatterns, MessageBubbleAlignment, MessageStatus } from "../../Enums/Enums";
import { CometChatUIKitLoginListener } from "../../CometChatUIKit/CometChatUIKitLoginListener";
import { MessageUtils } from "../../utils/MessageUtils";
import { CometChatMessageTemplate } from "../../modals";
import { CometChatUIKit } from "../../CometChatUIKit/CometChatUIKit";
import { CometChatDate } from "../BaseComponents/CometChatDate/CometChatDate";
import { CometChatUIKitConstants } from "../../constants/CometChatUIKitConstants";
import { CollaborativeDocumentConstants } from "../Extensions/CollaborativeDocument/CollaborativeDocumentConstants";
import { CollaborativeWhiteboardConstants } from "../Extensions/CollaborativeWhiteboard/CollaborativeWhiteboardConstants";
import { StickersConstants } from "../Extensions/Stickers/StickersConstants";
import { CometChatMessageEvents, IMessages } from "../../events/CometChatMessageEvents";

interface ThreadedMessagePreviewProps {
    title?: string;
    parentMessage: CometChat.BaseMessage;
    template?: CometChatMessageTemplate;
    bubbleView?: (messageObject: CometChat.BaseMessage) => void | JSX.Element;
    onClose?: () => void;
}

const CometChatThreadedMessagePreview = (props: ThreadedMessagePreviewProps) => {
    const {
        title = localize("THREAD"),
        parentMessage,
        bubbleView,
        onClose
    } = props;

    const loggedInUser = useRef<CometChat.User | null>(null);
    const [replyCount, setReplyCount] = useState<number>(0);

    useEffect(() => {
        setReplyCount(parentMessage?.getReplyCount() ?? 0);
    }, [parentMessage, setReplyCount]);

    useEffect(() => {
        loggedInUser.current = CometChatUIKitLoginListener.getLoggedInUser();
    }, []);

    const addListener = useCallback(() => {
        const onTextMessageReceived =
            CometChatMessageEvents.onTextMessageReceived.subscribe(
                (message: CometChat.TextMessage) => {
                    if (
                        message?.getParentMessageId() &&
                        message.getParentMessageId() == parentMessage.getId()
                    ) {
                        setReplyCount((prevCount) => prevCount + 1);
                    }
                }
            );
        const onMediaMessageReceived =
            CometChatMessageEvents.onMediaMessageReceived.subscribe(
                (message: CometChat.MediaMessage) => {
                    if (
                        message?.getParentMessageId() &&
                        message.getParentMessageId() == parentMessage.getId()
                    ) {
                        setReplyCount((prevCount) => prevCount + 1);
                    }
                }
            );
        const onCustomMessageReceived =
            CometChatMessageEvents.onCustomMessageReceived.subscribe(
                (message: CometChat.CustomMessage) => {
                    if (
                        message?.getParentMessageId() &&
                        message.getParentMessageId() == parentMessage.getId()
                    ) {
                        setReplyCount((prevCount) => prevCount + 1);
                    }
                }
            );

        return () => {
            onTextMessageReceived?.unsubscribe();
            onMediaMessageReceived?.unsubscribe();
            onCustomMessageReceived?.unsubscribe();
        };
    }, [parentMessage]);

    const subscribeToEvents = useCallback(() => {
        const ccMessageSent = CometChatMessageEvents.ccMessageSent.subscribe(
            ({ status, message }: IMessages) => {
                if (
                    status === MessageStatus.success &&
                    message?.getParentMessageId() === parentMessage?.getId()
                ) {
                    setReplyCount((prevCount) => prevCount + 1);
                }
            }
        );

        return () => {
            ccMessageSent?.unsubscribe();
        };
    }, [parentMessage]);

    useEffect(() => {
        if (loggedInUser) {
            const removeListener = addListener();
            const unsubscribeFromEvents = subscribeToEvents();
            return () => {
                removeListener();
                unsubscribeFromEvents();
            };
        }
    }, [loggedInUser, addListener, subscribeToEvents]);

    /* This function returns close button view. */
    function getCloseBtnView() {
        return (
            <CometChatButton
                iconURL={closeIcon}
                hoverText={localize("CLOSE")}
                onClick={onClose}
            />
        );
    }

    /* This function returns Message bubble view of which information is getting viewed. */
    const getBubbleView = useCallback(() => {
        let alignment = MessageBubbleAlignment.right;
        if (parentMessage && loggedInUser.current) {
            if (bubbleView) return bubbleView(parentMessage);
            else {
                const templatesArray = CometChatUIKit.getDataSource()?.getAllMessageTemplates();
                const template = templatesArray?.find((template: CometChatMessageTemplate) => template.type === parentMessage.getType() && template.category === parentMessage.getCategory());
                if (!template) {
                    return <></>
                }
                if (parentMessage.getSender()?.getUid() !== loggedInUser.current?.getUid()) {
                    alignment = MessageBubbleAlignment.left;
                } else {
                    alignment = MessageBubbleAlignment.right;
                }

                const view = new MessageUtils().getMessageBubble(
                    parentMessage,
                    template,
                    alignment
                );
                return view;
            }
        }
        return null;
    }, [parentMessage, bubbleView]);

    const getAdditionalClassName = useCallback(() => {
        const messageTypes = [CometChatUIKitConstants.MessageTypes.audio, CometChatUIKitConstants.MessageTypes.file, CometChatUIKitConstants.MessageTypes.text, CollaborativeDocumentConstants.extension_document, CollaborativeWhiteboardConstants.extension_whiteboard, StickersConstants.sticker];
        if (parentMessage && messageTypes.includes(parentMessage.getType())) return "cometchat-threaded-message-preview__message-small";
    }, [parentMessage]);


    return (
        <div className="cometchat">
            <div className="cometchat-threaded-message-preview">
                <div className="cometchat-threaded-message-preview__header">
                    <div className="cometchat-threaded-message-preview__header-title">
                        {title}
                    </div>
                    <div className="cometchat-threaded-message-preview__header-close">
                        {getCloseBtnView()}
                    </div>

                </div>
                <div className="cometchat-threaded-message-preview__content">
                    <div className="cometchat-threaded-message-preview__content-time">
                        <CometChatDate
                            timestamp={parentMessage.getSentAt()}
                            pattern={DatePatterns.DayDate}
                        ></CometChatDate>
                    </div>
                    <div className={`cometchat-threaded-message-preview__message ${parentMessage.getSender()?.getUid() !== loggedInUser.current?.getUid() ? "cometchat-threaded-message-preview__message-incoming" : "cometchat-threaded-message-preview__message-outgoing"} ${getAdditionalClassName()}`}>
                        {getBubbleView()}
                    </div>

                    <div className="cometchat-threaded-message-preview__footer">
                        <div className="cometchat-threaded-message-preview__footer-reply-count">
                            {replyCount + " "}
                            {
                                (replyCount === 0 || replyCount > 1) ? localize("REPLIES") : localize("REPLY")
                            }
                        </div>
                        <div className="cometchat-threaded-message-preview__footer-divider" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { CometChatThreadedMessagePreview }