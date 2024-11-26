import { BaseMessage, CometChat } from "@cometchat/chat-sdk-javascript";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useCometChatErrorHandler,
  useRefSync,
} from "../../CometChatCustomHooks";
import { Subscription } from "rxjs";

import { ChatConfigurator } from "../../utils/ChatConfigurator";
import { CometChatList } from "../BaseComponents/CometChatList/CometChatList";
import { CometChatMessageBubble } from "../BaseComponents/CometChatMessageBubble/CometChatMessageBubble";
import { CometChatMessageInformation } from "../CometChatMessageInformation/CometChatMessageInformation";
import { useCometChatMessageList } from "./useCometChatMessageList";
import { MessageListManager } from "./CometChatMessageListController";
import { CometChatUIKitUtility } from "../../CometChatUIKit/CometChatUIKitUtility";
import { CometChatActionsIcon, CometChatActionsView, CometChatMessageTemplate } from "../../modals";
import { DatePatterns, MessageBubbleAlignment, MessageListAlignment, MessageStatus, PanelAlignment, Receipts, States, TimestampAlignment } from "../../Enums/Enums";
import { CometChatUIKitConstants } from "../../constants/CometChatUIKitConstants";
import { localize } from "../../resources/CometChatLocalize/cometchat-localize";
import { CometChatTextFormatter } from "../../formatters/CometChatFormatters/CometChatTextFormatter";
import CometChatReactions from "../Reactions/CometChatReactions/CometChatReactions";
import { CometChatDate } from "../BaseComponents/CometChatDate/CometChatDate";
import { CometChatEmojiKeyboard } from "../BaseComponents/CometChatEmojiKeyboard/CometChatEmojiKeyboard";
import { CometChatAvatar } from "../BaseComponents/CometChatAvatar/CometChatAvatar";
import { CometChatButton } from "../BaseComponents/CometChatButton/CometChatButton";
import repliesRightIcon from '../../assets/subdirectory_arrow_right.svg';
import downArrow from '../../assets/dropdown-arrow.svg';
import ErrorStateIcon from '../../assets/list_error_state_icon.svg'
import ErrorStateIconDark from '../../assets/list_error_state_icon_dark.svg'
import { CometChatUIEvents, IDialog, IPanel, IShowOngoingCall } from "../../events/CometChatUIEvents";
import { CometChatCallEvents } from "../../events/CometChatCallEvents";
import { CometChatMessageEvents, IMessages } from "../../events/CometChatMessageEvents";
import { CometChatGroupEvents, IGroupLeft, IGroupMemberAdded, IGroupMemberKickedBanned, IGroupMemberScopeChanged } from "../../events/CometChatGroupEvents";
import CometChatToast from "../BaseComponents/CometChatToast/CometChatToast";
import { getThemeMode } from "../../utils/util";
/**
 * Props for the MessageList component.
 */
interface MessageListProps {
  /**
   * Unique identifier of the parent message for displaying threaded conversations.
   */
  parentMessageId?: number;

  /**
   * CometChat User object, representing the participant of the chat whose details are displayed.
   */
  user?: CometChat.User;

  /**
   * CometChat Group object, representing the group whose chat messages are displayed.
   */
  group?: CometChat.Group;

  /**
   * Custom empty state view to display when there are no messages.
   */
  emptyStateView?: JSX.Element;

  /**
   * Custom error state view to display when an error occurs while retrieving messages.
   */
  errorStateView?: JSX.Element;

  /**
   * Custom loading state view to display while messages are being fetched.
   */
  loadingStateView?: JSX.Element;

  /**
   * Boolean to toggle visibility of read receipts in the message list.
   * @default false
   */
  hideReceipt?: boolean;

  /**
   * Specifies the alignment of the messages in the list (left, right, etc.).
   * @default 'standard'
   */
  alignment?: MessageListAlignment;

  /**
   * User-defined date format for the message timestamp.
   */
  datePattern?: DatePatterns;

  /**
   * User-defined date format for the separators between dates in the message list.
   */
  DateSeparatorPattern?: DatePatterns;

  /**
   * Boolean to toggle visibility of the date separator in the message list.
   * @default false
   */
  hideDateSeparator?: boolean;

  /**
   * Array of message templates to define how various types of messages (e.g., text, image, video) should be displayed.
   */
  templates?: CometChatMessageTemplate[];

  /**
   * Instance of the CometChat MessagesRequestBuilder for building the request to fetch messages.
   */
  messagesRequestBuilder?: CometChat.MessagesRequestBuilder;

  /**
   * Text to display as a new message indicator.
   */
  newMessageIndicatorText?: string;

  /**
   * Boolean to indicate whether the message list should scroll to the bottom when a new message arrives.
   * @default false
   */
  scrollToBottomOnNewMessages?: boolean;

  /**
   * Threshold value for triggering certain actions (e.g., loading more messages) as the user scrolls.
   */
  thresholdValue?: number;

  /**
   * Callback function that is triggered when the user clicks on a thread reply.
   * @param parentMessageId - The ID of the parent message to which replies belong.
   */
  onThreadRepliesClick?: Function;

  /**
   * Custom header view component for the message list.
   */
  headerView?: JSX.Element;

  /**
   * Custom footer view component for the message list.
   */
  footerView?: JSX.Element;

  /**
   * Callback triggered when an error occurs during the message fetching process.
   * @param error - CometChatException object representing the error.
   */
  onError?: ((error: CometChat.CometChatException) => void) | null;

  /**
   * Boolean to hide or show errors in the message list.
   * @default false
   */
  hideError?: boolean;

  /**
   * Instance of the CometChat ReactionsRequestBuilder for managing message reactions.
   */
  reactionsRequestBuilder?: CometChat.ReactionsRequestBuilder;

  /**
   * Callback function that triggers when a reaction is clicked.
   * @param reaction - The reaction object.
   * @param message - The message associated with the reaction.
   */
  onReactionClick?: (reaction: CometChat.ReactionCount, message: CometChat.BaseMessage) => void;

  /**
   * Callback function that triggers when an item in the reaction list is clicked.
   * @param reaction - The reaction object.
   * @param message - The message associated with the reaction.
   */
  onReactionListItemClick?: (reaction: CometChat.Reaction, message: CometChat.BaseMessage) => void;

  /**
   * Boolean to disable message reactions.
   * @default false
   */
  disableReactions?: boolean;

  /**
   * Boolean to disable mentions in text messages.
   * @default false
   */
  disableMentions?: boolean;

  /**
   * Array of text formatters for custom styling or formatting of text bubbles.
   */
  textFormatters?: CometChatTextFormatter[];
}
const defaultProps: MessageListProps = {
  parentMessageId: 0,
  user: undefined,
  group: undefined,
  emptyStateView: undefined,
  errorStateView: undefined,
  loadingStateView: undefined,
  hideReceipt: false,
  alignment: MessageListAlignment.standard,
  datePattern: DatePatterns.time,
  DateSeparatorPattern: DatePatterns.DayDate,
  hideDateSeparator: false,
  templates: [],
  messagesRequestBuilder: undefined,
  newMessageIndicatorText: "",
  scrollToBottomOnNewMessages: false,
  thresholdValue: 1000,
  onThreadRepliesClick: () => { },
  headerView: undefined,
  footerView: undefined,
  onError: (error: CometChat.CometChatException) => {
    console.log(error);
  },
  hideError: false,
  reactionsRequestBuilder: undefined,
  onReactionClick: undefined,
  onReactionListItemClick: undefined,
  disableReactions: false,
  disableMentions: false,
  textFormatters: [],
};
const CometChatMessageList = (props: MessageListProps) => {
  const {
    parentMessageId,
    user,
    group,
    emptyStateView,
    errorStateView,
    loadingStateView,
    hideReceipt,
    alignment,
    datePattern,
    DateSeparatorPattern,
    hideDateSeparator,
    templates,
    messagesRequestBuilder,
    newMessageIndicatorText,
    scrollToBottomOnNewMessages,
    thresholdValue,
    onThreadRepliesClick,
    headerView,
    footerView,
    onError,
    hideError,
    reactionsRequestBuilder,
    onReactionClick,
    onReactionListItemClick,
    disableReactions,
    disableMentions,
    textFormatters,
  } = { ...defaultProps, ...props };
  /**
   * All the useState useCometChatMessageList are declaired here. These trigger a rerender when updated.
   */
  const [messageList, setMessageList] = useState<BaseMessage[]>([]);
  const [scrollListToBottom, setScrollListToBottom] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [messageListState, setMessageListState] = useState<States>(
    States.loading
  );
  const [showCallScreen, setShowCallscreen] = useState<boolean>(false);
  const [showMessageInfoPopup, setShowMessageInfoPopup] = useState<boolean>(false);
  const [activeMessageInfo, setActiveMessageInfo] =
    useState<CometChat.BaseMessage | null>(null); // should be state.
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [ongoingCallView, setOngoingCallView] = useState<any>(null);
  const [showNewMessagesBanner, setShowNewMessagesBanner] = useState<boolean>(false);
  const [showFooterPanelView, setShowFooterPanelView] = useState<boolean>(false);
  const [showHeaderPanelView, setShowHeaderPanelView] = useState<boolean>(false);
  const [dateHeader, setDateHeader] = useState<number>(0);


  /**
  * All the useRef useCometChatMessageList are declaired here. These do not trigger a rerender. They are used to get the updated values wherever required in the code.
   */
  const dateHeaderRef = useRef<number>(0);

  const loggedInUserRef = useRef<CometChat.User | null>(null);
  const isFirstReloadRef = useRef<boolean>(false);
  const elementRefs = useRef<any>({});
  const messageListManagerRef = useRef<any>(null);
  const messageIdRef = useRef({ prevMessageId: 0, nextMessageId: 0 });
  const totalMessagesCountRef = useRef<number>(0);
  const UnreadMessagesRef = useRef<CometChat.BaseMessage[]>([]);
  const newMessageTextRef = useRef<string>("");
  const toastTextRef = useRef<string>("");
  const imageModerationDialogRef = useRef<any>(null);
  const userRef = useRefSync<CometChat.User | undefined>(user);
  const groupRef = useRefSync<CometChat.Group | undefined>(group);
  const parentMessageIdRef = useRefSync<number | undefined>(parentMessageId);
  const smartReplyViewRef = useRef<any>(null);
  const headerViewRef = useRef<any>(null);
  const isConnectionReestablishedRef = useRef<boolean>(false);
  const isOnBottomRef = useRef<boolean>(false);
  const messageListenerId: string = "message_" + new Date().getTime();

  const renderShimmerBubble = (align: 'start' | 'end', key: number) => {
    return user || align == 'end' ? (
      <div key={key} className="cometchat-message-list__shimmer-body" style={{
        alignSelf: `flex-${align}`
      }}>
        <div className="cometchat-message-list__shimmer-item" />
      </div>
    ) : (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start"
      }}>
        <div className="cometchat-message-list__shimmer-leading-view"></div>


        <div key={key} className="cometchat-message-list__shimmer-body" style={{
          alignSelf: `flex-${align}`
        }}>
          <div className="cometchat-message-list__shimmer-item-header" />          <div className="cometchat-message-list__shimmer-item" />
        </div></div>
    );
  };

  const renderDateShimmer = () => (
    <div className="cometchat-message-list__shimmer-header">
      <div className="cometchat-message-list__shimmer-item" />
    </div>
  );
  const getShimmer = (count: number) => {
    const shimmers = [];
    shimmers.push(renderDateShimmer());
    for (let i = 1; i <= count; i++) {
      const align = i % 2 === 0 ? 'start' : 'end';
      shimmers.push(renderShimmerBubble(align, i));
    }

    return <>{shimmers}</>;
  };



  /**
  * All the Private variables are declaired here for internal use.
   */
  const onErrorCallback = useCometChatErrorHandler(onError);
  let keepRecentMessages: boolean = true,
    timestampEnum: any = TimestampAlignment,
    isFetchingPreviousMessages = false,
    threadedAlignment: MessageBubbleAlignment = MessageBubbleAlignment.left;
  const getLoaderHtml: JSX.Element = useMemo(() => {
    if (loadingStateView) {
      return (
        <div className='cometchat-message-list__loading-state-view'>
          {loadingStateView}
        </div>
      );
    } else {
      return (
        <div className="cometchat-message-list__shimmer">
          {getShimmer(8)}
        </div>
      );
    }
  }, [loadingStateView]);

  const getErrorHtml: JSX.Element = useMemo(() => {
    const isDarkMode = getThemeMode() == "dark" ? true : false;

    if (errorStateView) {
      return (
        <div className='cometchat-message-list__error-state-view'>
          {errorStateView}
        </div>
      );
    } else {
      return (
        <div className='cometchat-message-list__error-state-view'>
          <img className='cometchat-message-list__error-state-view-icon' src={isDarkMode ? ErrorStateIconDark : ErrorStateIcon}>

          </img>
          <div className='cometchat-message-list__error-state-view-body'>
            <div className='cometchat-message-list__error-state-view-body-title'>
              {localize("OOPS!")}
            </div>
            <div className='cometchat-message-list__error-state-view-body-description'>
              {localize("LOOKS_LIKE_SOMETHING_WENT_WRONG")}
            </div>
          </div>
        </div>
      );
    }
  }, [errorStateView]);

  const getEmptyHtml: JSX.Element | undefined = useMemo(() => {
    if (emptyStateView) {
      return (
        <div className='cometchat-message-list__empty-state-view'>
          {emptyStateView}
        </div>
      );
    } else {
      return undefined;
    }
  }, [emptyStateView]);
  const messagesTemplate = useMemo(() => {
    return templates && templates.length > 0
      ? templates
      : ChatConfigurator.getDataSource().getAllMessageTemplates({
        disableMentions: disableMentions,
        textFormatters: textFormatters,
      });
  }, [templates]);
  const messagesTypesMap: any = useMemo(() => {
    let messagesTypesArray: { [key: string]: CometChatMessageTemplate } = {};
    messagesTemplate.forEach((el: CometChatMessageTemplate) => {
      messagesTypesArray[el.category + "_" + el.type] = el;
    });
    return messagesTypesArray;
  }, [messagesTemplate]);

  /*
  * isPartOfCurrentChatForUIEvent: To check if the message belongs for this list and is not part of thread even for current list
    it only runs for UI event because it assumes logged in user is always sender
  * @param: message: CometChat.BaseMessage
*/
  const isPartOfCurrentChatForUIEvent: (message: CometChat.BaseMessage) => boolean | undefined = useCallback(
    (message: CometChat.BaseMessage) => {
      const receiverId = message?.getReceiverId();
      const receiverType = message?.getReceiverType();
      if (parentMessageIdRef.current) {
        if (message.getParentMessageId() === parentMessageIdRef.current) {
          return true;
        }
      } else {
        if (message.getParentMessageId()) {
          return false
        }

        if (userRef.current) {
          if (receiverType === CometChatUIKitConstants.MessageReceiverType.user && receiverId === userRef.current.getUid()) {
            return true
          }
        } else if (groupRef.current) {
          if (receiverType === CometChatUIKitConstants.MessageReceiverType.group && receiverId === groupRef.current.getGuid()) {
            return true
          }
        }

        return false

      }
    },
    []
  );

  /**
 * Function to validate if a transient message belongs to the current message list.
 * It checks if the message is not part of a thread even for the current list.
 * It only runs for SDK event because it needs senderId to check if the message is sent by the same user.
 * @param {CometChat.TransientMessage} message - The transient message to be validated
 * @returns {boolean | undefined} - Returns true if the message belongs to the current list, false otherwise
 */
  const validateTransientMessage: (message: CometChat.TransientMessage) => boolean | undefined = useCallback(
    (message: CometChat.TransientMessage) => {
      const receiverId = message?.getReceiverId();
      const receiverType = message?.getReceiverType();
      const senderId = message?.getSender()?.getUid();
      if (parentMessageIdRef.current) {
        return false;
      } else {
        if (userRef.current) {
          if (receiverType === CometChatUIKitConstants.MessageReceiverType.user && (receiverId === userRef.current.getUid() || senderId === userRef.current.getUid())) {
            return true
          }
        } else if (groupRef.current) {
          if (receiverType === CometChatUIKitConstants.MessageReceiverType.group && (receiverId === groupRef.current.getGuid())) {
            return true
          }
        }
        return false

      }
    }, []
  )

  /*
    * isPartOfCurrentChatForSDKEvent: To check if the message belongs for this list and is not part of thread even for current list
      it only runs for SDK event because it needs senderId to check if the message is sent by the same user
    * @param: message: CometChat.BaseMessage
  */
  const isPartOfCurrentChatForSDKEvent: (message: CometChat.BaseMessage) => boolean | undefined = useCallback(
    (message: CometChat.BaseMessage) => {
      const receiverId = message?.getReceiverId();
      const receiverType = message?.getReceiverType();
      const senderId = message?.getSender()?.getUid();
      if (parentMessageIdRef.current) {
        if (message.getParentMessageId() === parentMessageIdRef.current) {
          return true;
        }
      } else {
        if (message.getParentMessageId()) {
          return false
        }
        if (userRef.current) {
          if (receiverType === CometChatUIKitConstants.MessageReceiverType.user && (receiverId === userRef.current.getUid() || senderId === userRef.current.getUid())) {
            return true
          }
        } else if (groupRef.current) {
          if (receiverType === CometChatUIKitConstants.MessageReceiverType.group && (receiverId === groupRef.current.getGuid())) {
            return true
          }
        }

        return false

      }
    }, []
  )

  /*
    * isThreadOfCurrentChatForUIEvent: To check if the message belongs thread of this list,
      it only runs for UI event because it assumes logged in user is always sender
    * @param: message: CometChat.BaseMessage
  */
  const isThreadOfCurrentChatForUIEvent: (message: CometChat.BaseMessage) => boolean | undefined = useCallback(
    (message: CometChat.BaseMessage) => {
      if (!message.getParentMessageId()) {
        return false
      }

      const receiverId = message?.getReceiverId();

      if (userRef.current) {
        if (receiverId === userRef.current.getUid()) {
          return true
        }
      } else if (groupRef.current) {
        if (receiverId === groupRef.current.getGuid()) {
          return true
        }
      }

      return false
    }, []
  );


  /*
    * isThreadOfCurrentChatForSDKEvent: To check if the message belongs thread of this list,
      it only runs for SDK event because it needs senderId to check if the message is sent by the same user
    * @param: message: CometChat.BaseMessage
  */
  const isThreadOfCurrentChatForSDKEvent: (message: CometChat.BaseMessage) => boolean | undefined = useCallback(
    (message: CometChat.BaseMessage) => {
      if (!message.getParentMessageId()) {
        return false;
      }

      const receiverId = message?.getReceiverId();
      const senderId = message?.getSender()?.getUid();

      if (userRef.current) {
        if (receiverId === userRef.current.getUid() || senderId === userRef.current.getUid()) {
          return true;
        }
      } else if (groupRef.current) {
        if (receiverId === groupRef.current.getGuid()) {
          return true;
        }
      }

      return false;
    },
    []
  );

  /**
  * Function to retrieve a specific message by its ID from the message list.
  * If the message is not found, the function will return 'undefined'.
  *
  * @param {number} id The ID of the message to be retrieved.
  * @returns {CometChat.BaseMessage | undefined} Returns the message object if found, otherwise 'undefined'.
  */
  const getMessageById: (id: number) => CometChat.BaseMessage | undefined = useCallback(
    (id: number) => {
      try {
        const messageObject = messageList.find(
          (m: CometChat.BaseMessage) =>
            m?.getId()?.toString() === id?.toString()
        );
        return messageObject;
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [messageList, onErrorCallback]
  );

  /**
 * Opens the thread view for a given message.
 * @param {CometChat.BaseMessage} message - The message object for which the thread view should be opened.
 * @returns {void}
 */
  const openThreadView: (message: CometChat.BaseMessage) => void = useCallback(
    (message: CometChat.BaseMessage) => {
      try {
        if (onThreadRepliesClick) {
          onThreadRepliesClick(message, getThreadedMessageBubble);
        }
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [onThreadRepliesClick, onErrorCallback, isOnBottomRef]
  );

  /**
 * Function to monitor the scrollbar position and update the 'isOnBottom' property.
 * This helps in showing the unread messages count in the message list if a new message is received while the scrollbar is not at the bottom.
 * @param {boolean | undefined} isOnBottom - Indicates whether the scrollbar has reached the bottom or not.
 * @returns {void}
 */
  const updateIsOnBottom: (isOnBottom?: boolean | undefined) => void = useCallback(
    (hasScrolled?: boolean) => {
      if (hasScrolled !== undefined) {
        isOnBottomRef.current = hasScrolled;
      }
    },
    [isOnBottomRef]
  );

  /**
* Function to convert the user ID (UID) to the actual name of the mentioned user. This prevents the user's UID from being exposed when the message text is copied.
* @param {CometChat.TextMessage} message - The message object, which contains the text with user mentions represented as UIDs.
* @returns {string} The message text, with  mention replaced by the actual name of the user.
*/
  const getMentionsTextWithoutStyle: (message: CometChat.TextMessage) => string = (message: CometChat.TextMessage) => {
    const regex = /<@uid:(.*?)>/g;
    let messageText = message.getText();
    let messageTextTmp = message.getText();
    let match = regex.exec(messageText);
    let mentionedUsers = message.getMentionedUsers();
    while (match !== null) {
      let user;
      for (let i = 0; i < mentionedUsers.length; i++) {
        if (match[1] === mentionedUsers[i].getUid()) {
          user = mentionedUsers[i];
        }
      }
      if (user) {
        messageTextTmp = messageTextTmp.replace(match[0], "@" + user.getName());
      }
      match = regex.exec(messageText);
    }
    return messageTextTmp;
  };

  /**
 * Function to find the message in the list and replace it by matching the muid. This works when we send the message  in the ui before the success of the api for optmistic ui and then replace the message with actual message object by matching muid because message id is not generated before the api success.
 * @param {CometChat.BaseMessage} message - The message object, which needs to be replaced in the list.
 * @returns {void}
 */
  const updateMessageByMuid: (message: CometChat.BaseMessage) => void = useCallback(
    (message: CometChat.BaseMessage) => {
      try {
        setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
          const messages = prevMessageList.map((m: CometChat.BaseMessage) => {
            if (m.getMuid() === message.getMuid()) {
              return message;
            } else {
              return m;
            }
          });
          return messages;
        });
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [onErrorCallback]
  );


  /**
 * Function to find a message in the list and replace it by matching the message ID. This function is useful when we need to edit, delete or update a message object and update it in the UI in real-time.
 * @param {CometChat.BaseMessage} message - The message object that needs to be replaced in the list.
 * @returns {void}
 */
  const updateMessageByMessageId: (message: CometChat.BaseMessage) => void = useCallback(
    (message: CometChat.BaseMessage) => {
      try {
        setScrollListToBottom(false);
        setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
          const messages = prevMessageList.map((m: CometChat.BaseMessage) => {
            if (m?.getId() === message?.getId()) {
              return message;
            } else {
              return m;
            }
          });
          return messages;
        });
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [onErrorCallback]
  );

  /**
   * Function to handle when a message is edited
   * @param {CometChat.BaseMessage} editedMessage - The message that was edited.
   * @returns {void}
   */
  const replaceUpdatedMessage: (message: CometChat.BaseMessage) => void = useCallback(
    (editedMessage: CometChat.BaseMessage) => {
      try {
        if (isPartOfCurrentChatForSDKEvent(editedMessage)) {
          updateMessageByMessageId(editedMessage);
        }
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [updateMessageByMessageId, onErrorCallback, isPartOfCurrentChatForSDKEvent]
  );

  /**
   * Function to find a message in the list and replace it, matching either the message ID or MUID based on the boolean flag. The corresponding function for updating the message is then called.
   * @param {CometChat.BaseMessage} message - The message object to be replaced in the list.
   * @param {boolean} replaceByMuid - Optional flag to determine whether replacement should use MUID. If not provided, defaults to `false`.
   * @returns {void}
   */
  const updateMessage: (message: CometChat.BaseMessage, replaceByMuid?: boolean) => void = useCallback(
    (message: CometChat.BaseMessage, replaceByMuid: boolean = false) => {
      try {
        if (replaceByMuid) {
          setScrollListToBottom(true);
          updateMessageByMuid(message);
        } else {
          setScrollListToBottom(false);
          updateMessageByMessageId(message);
        }
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [
      updateMessageByMuid,
      updateMessageByMessageId,
      onErrorCallback,
    ]
  );

  /**
   * Function to add a selected reaction to a specific message in the list.
   * @param {string} emoji - The reaction to add to the specified message.
   * @param {CometChat.BaseMessage} message - The message object to which the reaction will be added.
   * @returns {void}
   */
  const reactToMessages: (emoji: string, messageObject: CometChat.BaseMessage) => void = useCallback(
    (emoji: string, messageObject: CometChat.BaseMessage) => {
      const messageId = messageObject?.getId();
      const msgObject = getMessageById(messageId) as CometChat.BaseMessage;
      const reactions = msgObject?.getReactions() || [];
      const emojiObject = reactions?.find((reaction: any) => {
        return reaction?.reaction === emoji;
      });

      if (emojiObject && emojiObject?.getReactedByMe()) {
        const updatedReactions: CometChat.ReactionCount[] = [];
        reactions.forEach((reaction) => {
          if (reaction?.getReaction() === emoji) {
            if (reaction?.getCount() === 1) {
              return;
            } else {
              reaction.setCount(reaction?.getCount() - 1);
              reaction.setReactedByMe(false);
              updatedReactions.push(reaction);
            }
          } else {
            updatedReactions.push(reaction);
          }
        });
        const newMessageObj = CometChatUIKitUtility.clone(msgObject);
        newMessageObj.setReactions(updatedReactions);
        updateMessage(newMessageObj);
        CometChat.removeReaction(messageId, emoji)
          .then((message) => { })
          .catch((error) => {
            updateMessage(msgObject);
            console.log(error);
          });
      } else {
        const updatedReactions = [];
        const reactionAvailable = reactions.find((reaction) => {
          return reaction?.getReaction() === emoji;
        });

        reactions.forEach((reaction) => {
          if (reaction?.getReaction() === emoji) {
            reaction.setCount(reaction?.getCount() + 1);
            reaction.setReactedByMe(true);
            updatedReactions.push(reaction);
          } else {
            updatedReactions.push(reaction);
          }
        });
        if (!reactionAvailable) {
          const react: CometChat.ReactionCount = new CometChat.ReactionCount(emoji, 1, true);
          updatedReactions.push(react);
        }

        const newMessageObj = CometChatUIKitUtility.clone(msgObject);
        newMessageObj.setReactions(updatedReactions);
        updateMessage(newMessageObj);
        if(newMessageObj.getReactions() && newMessageObj.getReactions().length == 1 && isOnBottomRef.current){
          scrollToBottom()
        }
        CometChat.addReaction(messageId, emoji)
          .then(() => { })
          .catch((error: CometChat.CometChatException) => {
            onErrorCallback(error);
            updateMessage(msgObject);
          });
      }
    }, [getMessageById, onErrorCallback, updateMessage]
  );

  /**
   * Default Callback functions for message options.
   */

  /**
   *Function fetches a specific message from the message list using its ID. If the message is found, the selected reaction is added beneath the message.
   * @param {number} id - The ID of the message to be retrieved.
   * @returns {void}
   */
  const onReactMessage: (id: number) => (closePopover: Function) => JSX.Element = useCallback(
    (id: number) => {
      const messageObject: CometChat.BaseMessage = getMessageById(
        id
      ) as CometChat.BaseMessage;
      return (closePopover: any) => {
        return <CometChatEmojiKeyboard
          onEmojiClick={(args: any) => {
          if(closePopover){
            closePopover()
          }
            reactToMessages(args, messageObject);
          }}
        />

      }
    },
    [getMessageById, reactToMessages]
  );

  /**
 *Function to retrieve a specific message, identified by its ID, from the message list. If the message is found, the text content of that message will be copied to the clipboard.
 * @param {number} id - The ID of the message to be retrieved.
 * @returns {void}
 */
  const onCopyMessage: (id: number) => void = useCallback(
    (id: number) => {
      try {
        let message: CometChat.TextMessage = getMessageById(id) as CometChat.TextMessage;
        if (message) {
          let text = message.getText();
          if (
            !disableMentions &&
            message.getMentionedUsers() &&
            message.getMentionedUsers().length
          ) {
            text = getMentionsTextWithoutStyle(message);
          }
          toastTextRef.current = localize("MESSAGE_COPIED");
          setShowToast(true);
          navigator?.clipboard?.writeText(text);
        }

      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [getMessageById, onErrorCallback,setShowToast]
  );

  /**
 * Function to retrieve a specific message by its ID from the message list.
 * If the message is found, the CometChatMessageInformation component will be opened.
 *
 * @param {number} id - The ID of the message to be retrieved.
 * @returns {void}
 */
  const onOpenMessageInfo: (id: number) => void = useCallback(
    (id: number) => {
      try {
        let message: CometChat.BaseMessage | undefined = getMessageById(id);
        if (message) {
          isOnBottomRef.current = false;
          setScrollListToBottom(false);
          setActiveMessageInfo(message);
          setShowMessageInfoPopup(true);
        }

      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [onErrorCallback, isOnBottomRef, getMessageById]
  );

  /**
 * Function to retrieve a specific message by its ID from the message list.
 * If the message is found, the CometChatThreadedMessages component will be opened.
 *
 * @param {number} id - The ID of the message to be retrieved.
 * @returns {void}
 */
  const onOpenThread: (id: number) => void = useCallback(
    (id: number) => {
      try {
        let messageObject: CometChat.BaseMessage | undefined = getMessageById(id);
        if (messageObject) {
          openThreadView(messageObject);

        }
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [openThreadView, onErrorCallback, getMessageById]
  );

  /**
  * Function to retrieve a specific message by its ID from the message list.
  * If the message is found, the chat will be opened for the particular user of that group to chat privately.
  *
  * @param {number} id - The ID of the message to be retrieved.
  * @returns {void}
  */
  const onMessagePrivately: (id: number) => void = useCallback(
    (id: number) => {
      try {
        const messageObject: CometChat.BaseMessage | undefined = getMessageById(id);
        if (messageObject) {
          const user: CometChat.User = messageObject.getSender();
          CometChatUIEvents.ccOpenChat.next({
            user: user,
          });

        }
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [getMessageById, onErrorCallback]
  );

  /**
 * Function to retrieve a specific message by its ID from the message list.
 * If  found, the message would be deleted.
 * @param {number} id - The ID of the message to be retrieved.
 * @returns {void}
 */
  const onDeleteMessage: (id: number) => void = useCallback(
    (id: number) => {
      try {
        let message: CometChat.BaseMessage | undefined = getMessageById(id);
        if (message) {
          const messageId: any = message.getId();
          CometChat.deleteMessage(messageId).then(
            (deletedMessage: CometChat.BaseMessage) => {
              replaceUpdatedMessage(deletedMessage)
              CometChatMessageEvents.ccMessageDeleted.next(deletedMessage);
              toastTextRef.current = localize("MESSAGE_DELETED_TEXT");
              setShowToast(true);
            },
            (error: CometChat.CometChatException) => {
              onErrorCallback(error);
            }
          );
        }
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [replaceUpdatedMessage, onErrorCallback, getMessageById]
  );

  /**
* Function to retrieve a specific message by its ID from the message list.
* If found, the Edit preview will be opened to edit that particular message.
* @param {number} id - The ID of the message to be retrieved.
* @returns {void}
*/
  const onEditMessage: (id: number) => void = useCallback(
    (id: number) => {
      try {
        let message: CometChat.BaseMessage | undefined = getMessageById(id);
        if (message) {
          CometChatMessageEvents.ccMessageEdited.next({
            message: message,
            status: MessageStatus.inprogress,
          });

        }

      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [onErrorCallback, getMessageById]
  );

  /**
 * Function to set a default callback for each message option if none exists. This is called when default CometChatMessageTemplates for supported messages are fetched.
 * @param {(CometChatActionsIcon | CometChatActionsView)[]} options - The array of message options.
 * @param {number} id - Optional parameter. The ID of the option to which the options belong.
 * @returns {(CometChatActionsIcon | CometChatActionsView)[]} - Returns the array of message options with assigned callback functions.
 */
  const setDefaultOptionsCallback: (options: (CometChatActionsIcon | CometChatActionsView)[], id?: number) => (CometChatActionsIcon | CometChatActionsView)[] = useCallback(
    (options: (CometChatActionsIcon | CometChatActionsView)[], id?: number) => {
      try {
        options.forEach(
          (element: CometChatActionsIcon | CometChatActionsView) => {
            switch (element.id) {
              case CometChatUIKitConstants.MessageOption.deleteMessage:
                if (element instanceof CometChatActionsIcon && !element.onClick) {
                  element.onClick = onDeleteMessage;
                }
                break;
              case CometChatUIKitConstants.MessageOption.editMessage:
                if (element instanceof CometChatActionsIcon && !element.onClick) {
                  element.onClick = onEditMessage;
                }
                break;
              case CometChatUIKitConstants.MessageOption.copyMessage:
                if (element instanceof CometChatActionsIcon && !element.onClick) {
                  element.onClick = onCopyMessage;
                }
                break;
              case CometChatUIKitConstants.MessageOption.replyInThread:
                if (element instanceof CometChatActionsIcon && !element.onClick) {
                  element.onClick = onOpenThread;
                }
                break;
              case CometChatUIKitConstants.MessageOption.messageInformation:
                if (element instanceof CometChatActionsIcon && !element.onClick) {
                  element.onClick = onOpenMessageInfo;
                }
                break;
              case CometChatUIKitConstants.MessageOption.sendMessagePrivately:
                if (element instanceof CometChatActionsIcon && !element.onClick) {
                  element.onClick = onMessagePrivately;
                }
                break;
              case CometChatUIKitConstants.MessageOption.reactToMessage:
                if (element instanceof CometChatActionsView && !element?.customView) {
                  element.customView = onReactMessage(id!);
                }
                break;
              default:
                break;
            }
          }
        );
        return options;
      } catch (error: any) {
        onErrorCallback(error);
        return options;
      }
    },
    [
      onErrorCallback,
      onDeleteMessage,
      onEditMessage,
      onOpenThread,
      onCopyMessage,
      onOpenMessageInfo,
      onMessagePrivately,
      onReactMessage,
    ]
  );

  /**
   * Function to check if the reaction option should be added in the Message options by checking if the reactions feature is enabled or disabled
   * @param {Array<CometChatActionsIcon | CometChatActionsView>} options - The array of message options.
   * @returns {Array<CometChatActionsIcon | CometChatActionsView>} - Returns the array of message options with assigned callback functions.
   */
  const validateReactionOption: (options: Array<CometChatActionsIcon | CometChatActionsView>) => Array<CometChatActionsIcon | CometChatActionsView> = useCallback(
    (options: Array<CometChatActionsIcon | CometChatActionsView>) => {
      if (!disableReactions) {
        return options;
      }

      return options.filter(
        (option: CometChatActionsIcon | CometChatActionsView) => {
          return (
            option.id !== CometChatUIKitConstants.MessageOption.reactToMessage
          );
        }
      );
    },
    [disableReactions]
  );

  /**
    * Function to get message options for each message based on the message type.
    * @param {CometChat.BaseMessage} msgObject - The message for which the options are to be retrieved.
    * @returns {Array<CometChatActionsIcon | CometChatActionsView>} - Returns the array of appropriate message options.
    */
  const getMessageOptions: (msgObject: CometChat.BaseMessage) => (CometChatActionsIcon | CometChatActionsView)[] = useCallback(
    (
      msgObject: CometChat.BaseMessage
    ): (CometChatActionsIcon | CometChatActionsView)[] => {
      let options: (CometChatActionsIcon | CometChatActionsView)[] = [];
      if (!msgObject.getId()) {
        return options;
      }
      try {
        if (
          messagesTemplate &&
          messagesTemplate.length > 0 &&
          !msgObject.getDeletedAt() &&
          msgObject.getType() !==
          CometChatUIKitConstants.MessageTypes.groupMember &&
          msgObject?.getCategory() !==
          CometChatUIKitConstants.MessageCategory.call
        ) {
          messagesTemplate.forEach((element: any) => {
            if (
              element.type === msgObject.getType() &&
              element.category === msgObject.getCategory()
            ) {
              options = setDefaultOptionsCallback(
                element?.options?.(loggedInUserRef.current, msgObject,groupRef.current),
                msgObject?.getId()
              );
            }
          });
        }
        options = validateReactionOption(options);
        return options;
      } catch (error: any) {
        onErrorCallback(error);
        return options;
      }
    },
    [
      messagesTemplate,
      validateReactionOption,
      setDefaultOptionsCallback,
      onErrorCallback,
    ]
  );

  /**
      * Function to set the alignment of the message bubble based on message list alignment and the sender of the message. The MessageBubble then adjusts itself based on the passed alignment.
      * @param {CometChat.BaseMessage} message - Message for which the alignment is to be determined.
      * @returns {MessageBubbleAlignment} - Returns the alignment for the message.
      */
  const setBubbleAlignment: (message: CometChat.BaseMessage) => MessageBubbleAlignment = useCallback(
    (message: CometChat.BaseMessage) => {
      let bubbleAlignment = MessageBubbleAlignment.center;
      try {
        if (alignment === MessageListAlignment.left && message.getType() !== CometChatUIKitConstants.MessageTypes.groupMember) {
          bubbleAlignment = MessageBubbleAlignment.left;
        } else {
          if (
            message?.getType() === CometChatUIKitConstants.MessageTypes.groupMember || message?.getCategory() == CometChatUIKitConstants.MessageCategory.call
          ) {
            bubbleAlignment = MessageBubbleAlignment.center;
          } else if (
            !message.getSender() ||
            (message?.getSender().getUid() === loggedInUserRef.current?.getUid() &&
              message?.getType() !== CometChatUIKitConstants.MessageTypes.groupMember)
          ) {
            bubbleAlignment = MessageBubbleAlignment.right;
          } else {
            bubbleAlignment = MessageBubbleAlignment.left;
          }
        }
        return bubbleAlignment;
      } catch (error: any) {
        onErrorCallback(error);
        return bubbleAlignment;
      }
    },
    [alignment, onErrorCallback]
  );

  /**
       * Function to return the content view for each item based on its type and category.
       * @param {CometChat.BaseMessage} item - The message for which the content view is to be returned.
       * @returns {any} - Returns the content view or null.
       */
  const getContentView: (item: CometChat.BaseMessage) => any = useCallback(
    (item: CometChat.BaseMessage) => {
      try {
        let _alignment = setBubbleAlignment(item);
        if (
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()] &&
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()]?.contentView
        ) {
          return messagesTypesMap[item?.getCategory() + "_" + item?.getType()].contentView(
            item,
            _alignment
          );
        }
        return null;
      } catch (error: any) {
        onErrorCallback(error);
        return null;
      }
    },
    [messagesTypesMap, onErrorCallback, setBubbleAlignment]
  );

  /**
       * Function to return the bottom view for each item based on its type and category.
       * @param {CometChat.BaseMessage} item - The message for which the bottom view is to be returned.
       * @returns {any} - Returns the bottom view or null.
       */
  const getBottomView: (item: CometChat.BaseMessage) => any = useCallback(
    (item: CometChat.BaseMessage) => {
      try {
        let _alignment = setBubbleAlignment(item);
        if (
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()] &&
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()]?.bottomView
        ) {
          return messagesTypesMap[item?.getCategory() + "_" + item?.getType()]?.bottomView(
            item,
            _alignment
          );
        }
        return null;
      } catch (error: any) {
        onErrorCallback(error);
        return null;
      }
    },
    [messagesTypesMap, onErrorCallback, setBubbleAlignment]
  );

  /**
    * Function to return the header view for each item based on its type and category.
    * @param {CometChat.BaseMessage} item - The message for which the header view is to be returned.
    * @returns {any} - Returns the header view or null.
    */
  const getHeaderView: (item: CometChat.BaseMessage) => any = useCallback(
    (item: CometChat.BaseMessage) => {
      try {
        let view: JSX.Element | null = null;
        if (
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()] &&
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()]?.headerView
        ) {
          view =
            messagesTypesMap[item?.getCategory() + "_" + item?.getType()]?.headerView(item);
        }
        return view;
      } catch (error: any) {
        onErrorCallback(error);
        return null;
      }
    },
    [messagesTypesMap, onErrorCallback]
  );

  /**
     * Function to return the footer view for each item based on its type and category.
     * @param {CometChat.BaseMessage} item - The message for which the footer view is to be returned.
     * @returns {any} - Returns the footer view or null.
     */
  const getFooterView: (item: CometChat.BaseMessage) => any = useCallback(
    (item: CometChat.BaseMessage) => {
      try {
        let view: JSX.Element | null = null;
        if (
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()] &&
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()]?.footerView
        ) {
          view =
            messagesTypesMap[item?.getCategory() + "_" + item?.getType()]?.footerView(item);
        }
        return view;
      } catch (error: any) {
        onErrorCallback(error);
        return null;
      }
    },
    [messagesTypesMap, onErrorCallback]
  );

  /**
       * Function to return the bubble wrapper for each item based on its type and category.
       * @param {CometChat.BaseMessage} item - The message for which the bubble wrapper is to be returned.
       * @returns {JSX.Element | null} - Returns the bubble wrapper or null.
       */
  const getBubbleWrapper: (item: CometChat.BaseMessage) => any = useCallback(
    (item: CometChat.BaseMessage) => {
      let view: JSX.Element | null = null;
      try {
        if (
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()] &&
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()].bubbleView
        ) {
          view =
            messagesTypesMap[item?.getCategory() + "_" + item?.getType()].bubbleView(item);
        }
        return view;
      } catch (error: any) {
        onErrorCallback(error);
        return view;
      }
    },
    [messagesTypesMap, onErrorCallback]
  );

  /**
     * Function to mark a given message as read.
     * @param {CometChat.BaseMessage} message - The message to be marked as read.
     * @returns {void}
     */
  const markMessageRead: (message: CometChat.BaseMessage) => void = useCallback((message: CometChat.BaseMessage) => {
    CometChat.markAsRead(message).then(
      () => {
        CometChatMessageEvents.ccMessageRead.next(message);
      },
      (error: unknown) => {
        onErrorCallback(error);
      }
    );
  }, [onErrorCallback])

  /**
     * Function to check and mark a message as read if `hideReceipt` is false and the message is not sent by the logged-in user.
     * @param {CometChat.BaseMessage} message - The message to be checked and marked as read.
     * @returns {void}
     */
  const checkAndMarkMessageAsRead: (message: CometChat.BaseMessage) => void = useCallback(
    (message: CometChat.BaseMessage) => {
      if (!hideReceipt &&
        message.getSender().getUid() !== loggedInUserRef.current?.getUid()) {
        markMessageRead(message);
      }
    }, [hideReceipt, markMessageRead])

  /**
   * Function to clear the count of new messages. If the last unread message exists, it marks it as read.
   * @returns {void}
   */

  const clearNewMessagesCount: () => void = useCallback(() => {
    isOnBottomRef.current = true;
    const lastMessage: CometChat.BaseMessage =
      UnreadMessagesRef.current[UnreadMessagesRef.current.length - 1];
    if (lastMessage) {
      checkAndMarkMessageAsRead(lastMessage);
    }
    UnreadMessagesRef.current = [];
    if (newMessageTextRef.current) {
      newMessageTextRef.current = "";
    }

    if (showNewMessagesBanner) {
      setShowNewMessagesBanner(false)
    }
  }, [checkAndMarkMessageAsRead, showNewMessagesBanner])


  /**
       * Function to reinitialize the Message Request Builder.
       * @returns {void}
       */
  const reinitializeMessagesRequestBuilder: () => void = useCallback(() => {
    try {
      if (keepRecentMessages) {
        setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
          const messages = prevMessageList.slice(-30);
          return messages;
        });
      } else {
        setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
          const messages = prevMessageList.slice(0, 30);
          return messages;
        });
      }
    } catch (error: any) {
      onErrorCallback(error);
    }
  }, [onErrorCallback]);

  /**
    * Function to prepend messages to the beginning of the current message list.
    * @param {CometChat.BaseMessage[]} messages - The messages to be prepended.
    * @returns {Promise<boolean | CometChat.CometChatException>} - Returns a promise that resolves if the operation is successful or rejects with an error if it fails.
    */
  const prependMessages: (messages: CometChat.BaseMessage[]) => Promise<boolean | CometChat.CometChatException> = useCallback(
    (messages: CometChat.BaseMessage[]) => {
      return new Promise((resolve, reject) => {
        if (isPartOfCurrentChatForSDKEvent(messages[0])) {
          try {
            setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
              const updatedMessageList = [...messages, ...prevMessageList];
              return updatedMessageList;
            });
            totalMessagesCountRef.current = totalMessagesCountRef.current + messages.length;
            setMessageListState(States.loaded);
            if (totalMessagesCountRef.current > thresholdValue!) {
              keepRecentMessages = false;
              reinitializeMessagesRequestBuilder();
            }
            resolve(true);
          } catch (error: any) {
            if (messageList?.length <= 0) {
              setMessageListState(States.error);
            }
            onErrorCallback(error);
            reject(error);
          }
        }
        else {
          if (messageList.length == 0) {
            setMessageListState(States.loaded);
          }

          resolve(true);

        }
      });
    },
    [
      messageList,
      thresholdValue,
      reinitializeMessagesRequestBuilder,
      isPartOfCurrentChatForSDKEvent,
      onErrorCallback]
  );

  /**
     * Function to fetch previous messages.
     * @returns {Promise<boolean | CometChat.CometChatException>} - Returns a promise that resolves if the operation is successful or rejects with an error if it fails.
     */
  const fetchPreviousMessages: () => Promise<boolean | CometChat.CometChatException> = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        setMessageListState(States.loading);

        let unreadMessageCount = 0;

        if (userRef?.current) {
          const unreadCountObject: any =
            await CometChat.getUnreadMessageCountForUser(
              userRef.current?.getUid()
            );
          unreadMessageCount =
            unreadCountObject[userRef.current?.getUid()] || 0;
        }

        if (groupRef?.current) {
          const unreadCountObject: any =
            await CometChat.getUnreadMessageCountForGroup(
              groupRef.current?.getGuid()
            );
          unreadMessageCount =
            unreadCountObject[groupRef.current?.getGuid()] || 0;
        }

        if (!isFetchingPreviousMessages) {
          isFetchingPreviousMessages = true;
          if (!messageListManagerRef.current.previous) {
            messageListManagerRef.current.previous = new MessageListManager(
              messagesRequestBuilder,
              userRef.current,
              groupRef.current,
              messageIdRef.current.prevMessageId,
              parentMessageIdRef.current
            );
          }
          messageListManagerRef?.current.previous.fetchPreviousMessages().then(
            (messagesList: CometChat.BaseMessage[]) => {
              if (!parentMessageIdRef.current) {
              }
              if (isFirstReloadRef.current) {
                if(!parentMessageIdRef.current){
                  CometChatUIEvents.ccActiveChatChanged.next({
                    user: userRef.current,
                    group: groupRef.current,
                    message: messagesList.length > 0 ? messagesList[messagesList.length - 1] : undefined,
                    unreadMessageCount
                  });
                }
                isFirstReloadRef.current = false;
                MessageListManager.attachConnectionListener(() => {
                  isConnectionReestablishedRef.current = true;
                  fetchActionMessages().then(() => {
                    fetchNextMessages()
                      .then(
                        (success) => {
                          resolve(success);
                          isConnectionReestablishedRef.current = false;
                        },
                        (error) => {
                          reject(error);
                        }
                      )
                      .catch((error: CometChat.CometChatException) => {
                        onErrorCallback(error);
                      });
                  });
                });
              }

              isFetchingPreviousMessages = false;
              if (messagesList && messagesList.length > 0) {
                let lastMessage: CometChat.BaseMessage =
                  messagesList[messagesList.length - 1];
                let isMyMessage = lastMessage?.getSender().getUid() == loggedInUserRef.current?.getUid()
                if (!lastMessage.getDeliveredAt() && !hideReceipt && !isMyMessage) {
                  CometChat.markAsDelivered(lastMessage).then(() => {
                    messagesList.forEach((m: CometChat.BaseMessage) => {
                      if (
                        m?.getId() <= lastMessage?.getId() &&
                        !isMyMessage &&
                        !m.getDeliveredAt()
                      ) {
                        m.setDeliveredAt(new Date().getTime());
                      }
                      return m;
                    });
                  });
                }
                if (
                  (!lastMessage.getReadAt() && 
                  (!isMyMessage || 
                    lastMessage.getCategory() === CometChat.MessageCategory.CALL || 
                    lastMessage.getCategory() === CometChat.MessageCategory.ACTION))
                ) {
                  if (!hideReceipt) {
                    CometChat.markAsRead(lastMessage).then(() => {
                      messagesList.forEach((m: CometChat.BaseMessage) => {
                        if (
                          m?.getId() <= lastMessage?.getId() &&
                          (!isMyMessage || 
                            m.getCategory() === CometChat.MessageCategory.CALL || 
                            m.getCategory() === CometChat.MessageCategory.ACTION) &&
                          !m.getReadAt()
                        ) {
                          m.setReadAt(new Date().getTime());
                        }
                        return m;
                      });
                      CometChatMessageEvents.ccMessageRead.next(lastMessage);

                    });
                  } else {
                    UnreadMessagesRef.current = [];
                  }
                } else if (!isMyMessage) {
                  CometChatMessageEvents.ccMessageRead.next(lastMessage);

                }

                prependMessages(messagesList).then(
                  (success) => {
                    resolve(success);
                  },
                  (error) => {
                    reject(error);
                  }
                );
              } else {
                if (messagesList.length === 0) {
                  if (totalMessagesCountRef.current === 0) {
                    setMessageListState(States.empty);
                  }
                }
                resolve(true);
              }
            },
            (error: CometChat.CometChatException) => {
              isFetchingPreviousMessages = false;
              if (messageList?.length <= 0) {
                setMessageListState(States.error);
              }
              if (error.code != "REQUEST_IN_PROGRESS") {
                onErrorCallback(error);
                reject(error);
              }
              else {
                setMessageListState(States.loading)
              }
            }
          );
        } else {
          resolve(true);
        }
      } catch (error: any) {
        if (messageList?.length <= 0) {
          setMessageListState(States.error);
        }
        onErrorCallback(error);
      }
    });
  }, [
    hideReceipt,
    onErrorCallback,
    prependMessages,
  ]);

  /**
    * Function to append messages to the end of the current message list.
    * @param {CometChat.BaseMessage[]} messages - The messages to be appended.
    * @returns {Promise<boolean | CometChat.CometChatException>} - Returns a promise that resolves if the operation is successful or rejects with an error if it fails.
    */

  const appendMessages: (messages: CometChat.BaseMessage[]) => Promise<boolean | CometChat.CometChatException> = useCallback(
    (messages: CometChat.BaseMessage[]) => {
      return new Promise((resolve, reject) => {
        try {
          setMessageList((prevMessageList: CometChat.BaseMessage[]): CometChat.BaseMessage[] => {
            const updatedMessageList: CometChat.BaseMessage[] = [
              ...prevMessageList,
              ...messages,
            ];
            return updatedMessageList;
          });
          totalMessagesCountRef.current = totalMessagesCountRef.current + messages.length;
          let id = messages[messages.length - 1]?.getId();
          if (id && messageIdRef.current.prevMessageId !== id) {
            messageIdRef.current.nextMessageId = id;
          }

          if (scrollToBottomOnNewMessages) {
            setTimeout(() => {
              setScrollListToBottom(true);
              isOnBottomRef.current = true;
            }, 100);
          } else {
            if (isConnectionReestablishedRef.current) {
              setScrollListToBottom(isOnBottomRef.current);
              let lastMessage: CometChat.BaseMessage =
                messages[messages?.length - 1];
              if (
                isOnBottomRef.current &&
                lastMessage &&
                lastMessage.getSender().getUid() != loggedInUserRef.current?.getUid() &&
                !lastMessage.getReadAt()
              ) {
                CometChat.markAsRead(lastMessage).then(() => {
                  UnreadMessagesRef.current = [];
                  CometChatMessageEvents.ccMessageRead.next(lastMessage);
                });
              }
            } else {
              setScrollListToBottom(false);
            }
            let countText = newMessageIndicatorText
              ? newMessageIndicatorText
              : UnreadMessagesRef.current.length > 1
                ? localize("NEW_MESSAGES")
                : localize("NEW_MESSAGE");
            UnreadMessagesRef.current.push(...messages);
            newMessageTextRef.current =
              + UnreadMessagesRef.current.length + " " + countText;
            setShowNewMessagesBanner(true);
          }
          setMessageListState(States.loaded);
          if (totalMessagesCountRef.current > thresholdValue!) {
            keepRecentMessages = true;
            reinitializeMessagesRequestBuilder();
          }
          resolve(true);
        } catch (error: any) {
          if (messageList?.length <= 0) {
            setMessageListState(States.error);
          }
          onErrorCallback(error);
          reject(error);
        }
      });
    },
    [
      thresholdValue,
      reinitializeMessagesRequestBuilder,
      onErrorCallback,
      isOnBottomRef,
    ]
  );

  /**
     * Function to fetch action messages.
     * @returns {Promise<boolean | CometChat.CometChatException>} - Returns a promise that resolves if the operation is successful or rejects with an error if it fails.
     */
  const fetchActionMessages: () => Promise<boolean | CometChat.CometChatException> = useCallback(() => {
    return new Promise((resolve, reject) => {
      let requestBuilder = new CometChat.MessagesRequestBuilder()
        .setType(CometChatUIKitConstants.MessageCategory.message)
        .setCategory(CometChatUIKitConstants.MessageCategory.action)
        .setMessageId(messageIdRef.current.nextMessageId)
        .setLimit(30);
      if (userRef.current) {
        requestBuilder.setUID(userRef.current.getUid());
      } else if (groupRef.current) {
        requestBuilder.setGUID(groupRef.current.getGuid());
      }
      requestBuilder
        .build()
        .fetchNext()
        .then((messages) => {
          if (messages && messages.length > 0) {
            messages.forEach((message: CometChat.BaseMessage) => {
              replaceUpdatedMessage(
                (
                  message as CometChat.Action
                ).getActionOn() as CometChat.BaseMessage
              );
            });
            return resolve(true);
          } else {
            return resolve(true);
          }
        })
        .catch((error: CometChat.CometChatException) => {
          onErrorCallback(error);
          if (messageList?.length <= 0) {
            setMessageListState(States.error);
          }
          return reject(error);
        });
    });
  }, [onErrorCallback]);


  /**
      * Function to fetch the next set of messages.
      * @returns {Promise<boolean | CometChat.CometChatException>} - Returns a promise that resolves if the operation is successful or rejects with an error if it fails.
      */

  const fetchNextMessages: () => Promise<boolean | CometChat.CometChatException> = useCallback(() => {
    return new Promise((resolve, reject) => {
      try {
        if (messageIdRef.current.nextMessageId) {
          if (!messageListManagerRef.current.next) {
            messageListManagerRef.current.next = new MessageListManager(
              messagesRequestBuilder,
              userRef.current,
              groupRef.current,
              messageIdRef.current.nextMessageId,
              parentMessageIdRef.current
            );
          }
          setMessageListState(States.loading);
          messageListManagerRef?.current.next.fetchNextMessages().then(
            (messagesList: CometChat.BaseMessage[]) => {
              if (messagesList) {
                if (messagesList.length === 0) {
                  totalMessagesCountRef.current === 0
                    ? setMessageListState(States.empty)
                    : setMessageListState(States.loaded);
                  resolve(true);
                } else {
                  appendMessages(messagesList).then(
                    (success) => {
                      resolve(success);
                    },
                    (error) => {
                      reject(error);
                    }
                  );
                }
              } else {
                resolve(true);
              }
            },
            (error: any) => {
              if (messageList?.length <= 0) {
                setMessageListState(States.error);
              }
              onErrorCallback(error);
              reject(error);
            }
          );
        } else {
          resolve(true);
        }
      } catch (error: any) {
        onErrorCallback(error);
      }
    });
  }, [
    appendMessages,
    onErrorCallback,
    messageList?.length,
    messagesRequestBuilder]);

  /**
   * Function to update the reply count of a message.
   * @param {CometChat.BaseMessage} message - The message for which the reply count is to be updated.
   * @returns {void}
   */

  const updateReplyCount: (message: CometChat.BaseMessage) => void = useCallback(
    (message: CometChat.BaseMessage) => {
      try {
        setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
          const messages = prevMessageList.map((m: CometChat.BaseMessage) => {
            if (m?.getId() === message.getParentMessageId()) {
              if (m.getReplyCount()) {
                m.setReplyCount(m.getReplyCount() + 1);
              } else {
                if(isOnBottomRef.current){
                  checkAndScrollToBottom(true)
                }
                m.setReplyCount(1);
              }
              return m;
            } else {
              return m;
            }
          });
          return messages;
        });
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [onErrorCallback]
  );

  /**
     * Function to update unread reply count for a specific message.
     * @param {CometChat.BaseMessage} message - The message for which the unread reply count is updated.
     * @returns {void}
     */
  const updateUnreadReplyCount: (message: CometChat.BaseMessage) => void = useCallback((message: CometChat.BaseMessage) => {
    try {
      setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
        let messageList: CometChat.BaseMessage[] = [...prevMessageList];
        let messageKey = messageList.findIndex(
          (m) => m.getId() === message.getParentMessageId()
        );
        if (messageKey > -1) {
          const messageObj: CometChat.BaseMessage = messageList[messageKey];
          messageList.splice(messageKey, 1, messageObj);
          prevMessageList = [...messageList];
        }
        return prevMessageList;
      });
    } catch (error: any) {
      onErrorCallback(error);
    }
  }, [onErrorCallback])

  /**
     * Function to add a new message to the current message list.
     * @param {CometChat.BaseMessage} message - The message to be added.
     * @returns {void}
     */
  const addMessage: (message: CometChat.BaseMessage) => void = useCallback(
    (message: CometChat.BaseMessage) => {
      try {
        totalMessagesCountRef.current += 1;
        if (totalMessagesCountRef.current > 0 && messageListState != States.loaded) {
          setMessageListState(States.loaded)
        }
        setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
          const messages = [...prevMessageList, message];
          return messages;
        });
        if (!message.getSender() || (message.getSender().getUid() == loggedInUserRef.current?.getUid())) {
          setScrollListToBottom(true);
        }
        if (totalMessagesCountRef.current > thresholdValue!) {
          keepRecentMessages = true;
          reinitializeMessagesRequestBuilder();
        }
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [thresholdValue, onErrorCallback, scrollListToBottom]
  );





  /**
     * Function to show and increment the count of unread messages.
     * @param {CometChat.BaseMessage} message - The unread message to be counted.
     * @returns {void}
     */
  const showAndIncrementUnreadCount: (message: CometChat.BaseMessage) => void = useCallback((message: CometChat.BaseMessage) => {
    if (!isOnBottomRef.current && message.getSender() && message.getSender().getUid() != loggedInUserRef.current?.getUid()) {
      let countText = newMessageIndicatorText
        ? newMessageIndicatorText
        : UnreadMessagesRef.current.length > 1
          ? localize("NEW_MESSAGES")
          : localize("NEW_MESSAGE");
      UnreadMessagesRef.current.push(message);
      newMessageTextRef.current =
        + UnreadMessagesRef.current.length + " " + countText;
      setShowNewMessagesBanner(true);
    }
  }, [newMessageIndicatorText]);

  /**
    * Function to mark all messages up to a certain point as delivered.
    * @param {CometChat.MessageReceipt} message - The receipt message up to which all messages are marked as delivered.
    * @returns {void}
    */

  const markAllMessagAsDelivered: (message: CometChat.MessageReceipt) => void = useCallback(
    (message: CometChat.MessageReceipt) => {
      try {
        setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
          const messages = prevMessageList.map((m: CometChat.BaseMessage) => {
            if (
              parseInt(m?.getId()?.toString()) <=
              parseInt(message.getMessageId()) &&
              m.getSender().getUid() === loggedInUserRef.current?.getUid() &&
              !m.getDeliveredAt()
            ) {
              m.setDeliveredAt(message.getDeliveredAt());
            }
            return m;
          });
          return messages;
        });
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [onErrorCallback]
  );

  /**
     * Function to mark all messages up to a certain point as read.
     * @param {CometChat.MessageReceipt} message - The receipt message up to which all messages are marked as read.
     * @returns {void}
     */
  const markAllMessageAsRead: (message: CometChat.MessageReceipt) => void = useCallback(
    (message: CometChat.MessageReceipt) => {
      try {
        const listToMarkRead: CometChat.BaseMessage[] = [];
        setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
          const messages = prevMessageList.map((m: CometChat.BaseMessage) => {
            if (
              parseInt(m?.getId()?.toString()) <=
              parseInt(message.getMessageId()) &&
              m.getSender().getUid() === loggedInUserRef.current?.getUid() &&
              !m.getReadAt()
            ) {
              m.setReadAt(message.getReadAt());
              if (
                parseInt(m?.getId()?.toString()) ===
                parseInt(message.getMessageId())
              ) {
                listToMarkRead.push(m);
              }
            }
            return m;
          });
          listToMarkRead.forEach((m) => {
            CometChatMessageEvents.ccMessageRead.next(m);
          });
          return messages;
        });
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [onErrorCallback]
  );

  /**
     * Function to handle the marking of messages as read or delivered
     * @param {CometChat.MessageReceipt} messageReceipt - The receipt message
     * @returns {void}
     */

  const messageReadAndDelivered: (message: CometChat.MessageReceipt) => void = useCallback(
    (messageReceipt: CometChat.MessageReceipt) => {
      try {
        if (
          messageReceipt.getReceiverType() ===
          CometChatUIKitConstants.MessageReceiverType.user &&
          messageReceipt.getSender().getUid() === userRef.current?.getUid() &&
          messageReceipt.getReceiver() === loggedInUserRef.current?.getUid()
        ) {
          messageReceipt.getReceiptType() === "delivery"
            ? markAllMessagAsDelivered(messageReceipt)
            : markAllMessageAsRead(messageReceipt);
        }
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [
      markAllMessagAsDelivered,
      markAllMessageAsRead,
      onErrorCallback]
  );


  /**
    * Function to check whether to scroll to the bottom of the message list
    * @param {boolean} forceScroll - A boolean indicating whether to force the scroll to the bottom
    * @returns {void}
    */
  const checkAndScrollToBottom: (forceScroll?: boolean) => void = useCallback((forceScroll: boolean = false) => {

    if (forceScroll || scrollToBottomOnNewMessages) {
      setTimeout(() => {
        setScrollListToBottom(true);
        isOnBottomRef.current = true;
        UnreadMessagesRef.current = [];
      }, 100);
      return;
    }
  }, [scrollToBottomOnNewMessages]);

  /**
    * Function to handle when a new message is received
    * @param {CometChat.BaseMessage} message - The new message received.
    * @returns {void}
    */
  const messageReceivedHandler: (message: CometChat.BaseMessage) => void = useCallback(
    (message: CometChat.BaseMessage) => {
      try {
        if (isPartOfCurrentChatForSDKEvent(message)) {
          addMessage(message);
          if (scrollToBottomOnNewMessages) {
            checkAndScrollToBottom();
            checkAndMarkMessageAsRead(message);
          } else {
            if (isOnBottomRef.current) {
              checkAndScrollToBottom(true);
              checkAndMarkMessageAsRead(message);
            } else {
              setScrollListToBottom(false);
              showAndIncrementUnreadCount(message);
            }
          }
        } else if (isThreadOfCurrentChatForSDKEvent(message)) {
          updateReplyCount(message);
          updateUnreadReplyCount(message);
        }else{
          if (!hideReceipt &&
            message.getSender().getUid() !== loggedInUserRef.current?.getUid()) {
              CometChat.markAsDelivered(message)
          }
        }
      } catch (error) {
        onErrorCallback(error);
      }
    },
    [
      isPartOfCurrentChatForSDKEvent,
      isThreadOfCurrentChatForSDKEvent,
      addMessage,
      scrollToBottomOnNewMessages,
      checkAndScrollToBottom,
      checkAndMarkMessageAsRead,
      showAndIncrementUnreadCount,
      updateReplyCount,
      updateUnreadReplyCount,
      onErrorCallback,
    ]
  );

  /**
     * Function to handle when a group action message is received
     * @param {CometChat.Action} actionMessage - The action message received.
     * @param {CometChat.Group} group - The group where the action message is received.
     * @returns {void}
     */

  const groupActionMessageReceived: (message: CometChat.Action, group: CometChat.Group) => void = useCallback(
    (actionMessage: CometChat.Action, group: CometChat.Group) => {
      try {
        if (group?.getGuid() === groupRef?.current?.getGuid()) {
          addMessage(actionMessage);
          if (!isOnBottomRef.current) {
            if (scrollToBottomOnNewMessages) {
              checkAndScrollToBottom();
              checkAndMarkMessageAsRead(actionMessage);
            } else {
              setScrollListToBottom(false);
              showAndIncrementUnreadCount(actionMessage);
            }
          } else {
            checkAndScrollToBottom(true);
            checkAndMarkMessageAsRead(actionMessage);
          }
        }
      } catch (error) {
        onErrorCallback(error);
      }
    },
    [
      addMessage,
      scrollToBottomOnNewMessages,
      checkAndScrollToBottom,
      showAndIncrementUnreadCount,
      onErrorCallback,
    ]
  );

  /**
     * Checks if receipt is of the current list.
     * @param {CometChat.ReactionEvent} receipt - The reaction event object.
     * @returns {boolean} - Returns true if the receipt is of the current list, otherwise returns false.
     */
  const isReactionOfThisList: (receipt: CometChat.ReactionEvent) => boolean = useCallback((receipt: CometChat.ReactionEvent) => {
    const receiverId = receipt?.getReceiverId();
    const receiverType = receipt?.getReceiverType();
    const reactedById = receipt?.getReaction()?.getReactedBy()?.getUid();
    const parentMessageId = receipt?.getParentMessageId();
    const listParentMessageId = parentMessageId && String(parentMessageId);
    if (listParentMessageId) {
      if (parentMessageId === listParentMessageId) {
        return true;
      } else {
        return false
      }
    } else {
      if (receipt.getParentMessageId()) {
        return false
      }

      if (userRef.current) {
        if (receiverType === CometChatUIKitConstants.MessageReceiverType.user && (receiverId === userRef.current?.getUid() || reactedById === userRef.current?.getUid())) {
          return true
        }
      } else if (groupRef.current) {
        if (receiverType === CometChatUIKitConstants.MessageReceiverType.group && (receiverId === groupRef.current?.getGuid())) {
          return true
        }
      }
    }
    return false
  }, [])

  /**
   * Updates the message list with the reaction information of a message.
   * @param message - The message reaction object.
   * @param isAdded - Indicates whether the reaction is added or removed.
   */
  const messageReactionUpdated: (receipt: CometChat.ReactionEvent, isAdded: boolean) => boolean | undefined = useCallback(
    (receipt: CometChat.ReactionEvent, isAdded: boolean) => {
      if (!isReactionOfThisList(receipt)) {
        return false;
      }

      setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
        const index = prevMessageList.findIndex(
          (i) =>
            i.getId().toString() ===
            receipt.getReaction()?.getMessageId().toString()
        );
        if (index === -1) {
          return prevMessageList;
        }
        const messageObject = prevMessageList[index];
        let action: CometChat.REACTION_ACTION;
        if (isAdded) {
          action = CometChat.REACTION_ACTION.REACTION_ADDED;
        } else {
          action = CometChat.REACTION_ACTION.REACTION_REMOVED;
        }
        const modifiedMessage = CometChat.CometChatHelper.updateMessageWithReactionInfo(messageObject, receipt.getReaction(), action) as CometChat.BaseMessage;
        if(isAdded && modifiedMessage.getReactions() && modifiedMessage.getReactions().length == 1 && isOnBottomRef.current){
          scrollToBottom()
        }
        return prevMessageList.map((m) => {
          if (m.getId().toString() === modifiedMessage?.getId().toString()) {
            return CometChatUIKitUtility.clone(modifiedMessage)
          } else {
            return m
          }
        });
      });
    }, [isReactionOfThisList]
  );

  /**
 * Function to handle when a call action message is received
 * @param {CometChat.Call} callMessage - The call message received.
 * @returns {void}
 */
  const callActionMessageReceived: (callMessage: CometChat.Call) => void = useCallback(
    (callMessage: CometChat.Call) => {
      try {
        if (
          isPartOfCurrentChatForSDKEvent(callMessage) &&
          ChatConfigurator.names.includes("calling")
        ) {
          addMessage(callMessage);
          if (!isOnBottomRef.current) {
            if (scrollToBottomOnNewMessages) {
              checkAndScrollToBottom();
              checkAndMarkMessageAsRead(callMessage);
            } else {
              setScrollListToBottom(false);
              showAndIncrementUnreadCount(callMessage);
            }
          } else {
            checkAndScrollToBottom(true);
            checkAndMarkMessageAsRead(callMessage);
          }
        }
      } catch (error) {
        onErrorCallback(error);
      }
    },
    [
      isPartOfCurrentChatForSDKEvent,
      addMessage,
      scrollToBottomOnNewMessages,
      checkAndScrollToBottom,
      showAndIncrementUnreadCount,
      onErrorCallback,
    ]
  );

  /**
  * Function to handle the processing of real-time group and call actions.
  * @param {string} key - The key identifying the type of the message category.
  * @param {CometChat.BaseMessage} message - The incoming message.
  * @param {CometChat.Group} group - The group where the message is received (if applicable).
  * @returns {void}
  */
  const handleGroupAndCallActions = useCallback(
    (
      key: string = "",
      message: CometChat.BaseMessage,
      group?: CometChat.Group
    ) => {
      try {
        switch (key) {
          case CometChatUIKitConstants.MessageCategory.action: {
            if (group) {
              groupActionMessageReceived(message as CometChat.Action, group);
            }
            break;
          }
          case CometChatUIKitConstants.MessageCategory.call: {
            callActionMessageReceived(message as CometChat.Call);

            break;
          }
        }
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [
      groupActionMessageReceived,
      callActionMessageReceived,
      onErrorCallback,
    ]
  );

  /**
 * Callback to be executed when the message list is scrolled to the bottom.
 * @returns {Promise<boolean | CometChat.CometChatException>} Returns a promise that resolves to a boolean value or a CometChat exception.
 */
  const onBottomCallback: () => Promise<boolean | CometChat.CometChatException> = useCallback(() => {
    return new Promise((resolve, reject) => {
      try {
        clearNewMessagesCount();
        setScrollListToBottom(false);
        if (messageListManagerRef.current && messageListManagerRef.current.previous) {
          messageListManagerRef.current.previous = null;
        }
        fetchNextMessages().then(
          (success) => {
            resolve(success);
          },
          (error) => {
            reject(error);
          }
        );
      } catch (error: any) {
        onErrorCallback(error);
      }
    });
  }, [
    messageList,
    checkAndMarkMessageAsRead,
    fetchNextMessages,
    clearNewMessagesCount,
    onErrorCallback,
  ]);

  /**
 * Callback to be executed when the message list is scrolled to the top.
 * @returns {Promise<boolean | CometChat.CometChatException>} Returns a promise that resolves to a boolean value or a CometChat exception.
 */

  const onTopCallback: () => Promise<boolean | CometChat.CometChatException> = useCallback(() => {
    return new Promise((resolve, reject) => {
      try {
        setScrollListToBottom(false);
        isOnBottomRef.current = false;
        if (messageListManagerRef.current && messageListManagerRef.current.next) {
          messageListManagerRef.current.next = null;
        }
        fetchPreviousMessages().then(
          (success) => {
            resolve(success);
          },
          (error) => {
            reject(error);
          }
        );
      } catch (error: any) {
        onErrorCallback(error);
      }
    });
  }, [fetchPreviousMessages, onErrorCallback, isOnBottomRef]);

  /**
 * Function to update the view to focus on a specific message.
 * @param {CometChat.BaseMessage} message - The message to focus on.
 * @returns {void}
 */
  const updateView: (message: CometChat.BaseMessage) => void = useCallback(
    (message: CometChat.BaseMessage) => {
      elementRefs.current[message.getId()].current?.scrollIntoView({
        block: "center",
      });
    },
    []
  );

  /**
 * Function to scroll the message list to the bottom.
 * @returns {void}
 */
  const scrollToBottom: () => void = useCallback(() => {
    try {
      clearNewMessagesCount()
      setScrollListToBottom(true);
    } catch (error: any) {
      onErrorCallback(error);
    }
  }, [markMessageRead, onErrorCallback, clearNewMessagesCount]);

  /**
 * Function to reset the count of unread messages in a thread.
 * @param {number | string} parentMessageId - The parent message ID of the thread.
 * @returns {void}
 */

  const resetCountForUnreadMessagesInThread: (parentMessageId: number | string) => void = useCallback(
    (parentMessageId: number | string) => {
      setMessageList((prevMessageList: CometChat.BaseMessage[]) => {
        return prevMessageList.map((m: CometChat.BaseMessage) => {
          if (m?.getId() === parentMessageId) {
            return m;
          } else {
            return m;
          }
        });
      });
    },
    []
  );


  /**
 * Function to subscribe to UI events for handling various scenarios such as showing a dialog, handling group member events, handling message edits, etc.
 * @returns {() => void} A cleanup function to unsubscribe from the events.
 */
  const subscribeToUIEvents: () => (() => void) | undefined = useCallback(() => {
    try {
      const ccShowOngoingCall = CometChatUIEvents.ccShowOngoingCall.subscribe(
        (data: IShowOngoingCall) => {
          setShowCallscreen(true);
          setOngoingCallView(data.child);
        }
      );
      const ccCallEnded = CometChatCallEvents.ccCallEnded.subscribe(
        (call: CometChat.Call) => {
          setShowCallscreen(false);
          setOngoingCallView(null);
          if (!call) {
            return;
          }
          callActionMessageReceived(call);
        }
      );
      const ccCallRejected = CometChatCallEvents.ccCallRejected.subscribe(
        (call: CometChat.Call) => {
          callActionMessageReceived(call);
        }
      );
      const ccOutgoingCall = CometChatCallEvents.ccOutgoingCall.subscribe(
        (call: CometChat.Call) => {
          callActionMessageReceived(call);
        }
      );
      const ccCallAccepted = CometChatCallEvents.ccCallAccepted.subscribe(
        (call: CometChat.Call) => {
          callActionMessageReceived(call);
        }
      );
      const ccMessageRead = CometChatMessageEvents.ccMessageRead.subscribe(
        (message: CometChat.BaseMessage) => {
          if (isThreadOfCurrentChatForSDKEvent(message)) {
            resetCountForUnreadMessagesInThread(message.getParentMessageId());
          }
        }
      );
      const ccShowDialog = CometChatUIEvents.ccShowDialog.subscribe(
        (data: IDialog) => {
          imageModerationDialogRef.current = data.child;
          setShowConfirmDialog(true);
        }
      );
      const ccHideDialog = CometChatUIEvents.ccHideDialog.subscribe(() => {
        imageModerationDialogRef.current = null;
        setShowConfirmDialog(false);
      });
      const ccShowPanel = CometChatUIEvents.ccShowPanel.subscribe(
        (data: IPanel) => {
          if (!data.message || ((data.message.getParentMessageId() && parentMessageId && data.message.getParentMessageId() == parentMessageId) || (!parentMessageId && !data.message?.getParentMessageId()))) {
            if (data.position === PanelAlignment.messageListFooter) {
              if (smartReplyViewRef.current) {
                smartReplyViewRef.current = null;
                setShowNewMessagesBanner(false);
                setShowFooterPanelView(false);
              }
              setTimeout(() => {
                smartReplyViewRef.current = data.child;
                setShowFooterPanelView(true);
              }, 0);
            }
            else if (data.position === PanelAlignment.messageListHeader) {
              if (headerViewRef.current) {
                headerViewRef.current = null;
                setShowHeaderPanelView(false);
              }

              setTimeout(() => {
                headerViewRef.current = data.child;
                setShowHeaderPanelView(true);
              }, 0);

            }
          }
        }
      );
      const ccHidePanel = CometChatUIEvents.ccHidePanel.subscribe(
        (alignment) => {
          if (alignment === PanelAlignment.messageListFooter) {
            smartReplyViewRef.current = null;
            setShowNewMessagesBanner(false);
            setShowFooterPanelView(false);

          }
          else if (alignment === PanelAlignment.messageListHeader) {
            headerViewRef.current = null;
            setShowHeaderPanelView(false);

          }
        }
      );
      const ccGroupMemberAdded =
        CometChatGroupEvents.ccGroupMemberAdded.subscribe(
          (item: IGroupMemberAdded) => {
            item.messages.map((message) => {
              groupActionMessageReceived(message, item.userAddedIn);
            });
          }
        );
      const ccGroupMemberBanned =
        CometChatGroupEvents.ccGroupMemberBanned.subscribe(
          (item: IGroupMemberKickedBanned) => {
            groupActionMessageReceived(item.message, item.kickedFrom);
          }
        );
      const ccGroupMemberKicked =
        CometChatGroupEvents.ccGroupMemberKicked.subscribe(
          (item: IGroupMemberKickedBanned) => {
            groupActionMessageReceived(item.message, item.kickedFrom);
          }
        );
      const ccGroupMemberScopeChanged =
        CometChatGroupEvents.ccGroupMemberScopeChanged.subscribe(
          (item: IGroupMemberScopeChanged) => {
            groupActionMessageReceived(item.message, item.group);
          }
        );
      const ccGroupLeft = CometChatGroupEvents.ccGroupLeft.subscribe(
        (item: IGroupLeft) => {
          groupActionMessageReceived(item.message, item.leftGroup);
        }
      );
      const ccMessageEdit = CometChatMessageEvents.ccMessageEdited.subscribe(
        (obj: IMessages) => {
          if (obj?.status === MessageStatus.success) {
            if (isPartOfCurrentChatForUIEvent(obj.message)) {
              toastTextRef.current = localize("MESSAGE_EDITED");
              setShowToast(true);
              updateMessage(obj.message, false);
            }
          }
        }
      );

      const ccMessageTranslated = CometChatMessageEvents.ccMessageTranslated.subscribe(
        (obj: IMessages) => {
          if (obj?.status === MessageStatus.success) {
            if (isPartOfCurrentChatForSDKEvent(obj.message)) {
              toastTextRef.current = localize("MESSAGE_TRANSLATED");
              setShowToast(true);
              updateMessage(obj.message, false);
              setTimeout(() => {
                updateView(obj.message);
              }, 100);
            }
          }
        }
      );

      const ccMessageSent = CometChatMessageEvents.ccMessageSent.subscribe(
        (obj: IMessages) => {
          let { message, status } = obj;
          switch (status) {
            case MessageStatus.inprogress: {
              if (isPartOfCurrentChatForUIEvent(message))
                addMessage(message);
              break;
            }
            case MessageStatus.success: {
              if (isPartOfCurrentChatForUIEvent(message)) {
                if(showNewMessagesBanner){
                  setShowNewMessagesBanner(false);
                  UnreadMessagesRef.current = [];
                }
                updateMessage(message, true);
              }

              if (isThreadOfCurrentChatForUIEvent(message)) {
                updateReplyCount(message);
              }
              break;
            }
            default:
              updateMessage(message, true);
              if (isThreadOfCurrentChatForUIEvent(message)) {
                updateReplyCount(message);
              }
              break;
          }
        }
      );

      const onTextMessageReceived = CometChatMessageEvents.onTextMessageReceived.subscribe((textMessage: CometChat.TextMessage) => {
        messageReceivedHandler(textMessage);
      });
      const onMediaMessageReceived = CometChatMessageEvents.onMediaMessageReceived.subscribe((mediaMessage: CometChat.MediaMessage) => {
        messageReceivedHandler(mediaMessage);

      });
      const onCustomMessageReceived = CometChatMessageEvents.onCustomMessageReceived.subscribe((customMessage: CometChat.CustomMessage) => {
        messageReceivedHandler(customMessage);
      });
      const onMessagesDelivered = CometChatMessageEvents.onMessagesDelivered.subscribe((messageReceipt: CometChat.MessageReceipt) => {
        if (!hideReceipt) {
          messageReadAndDelivered(messageReceipt);
        }
      });
      const onMessagesRead = CometChatMessageEvents.onMessagesRead.subscribe((messageReceipt: CometChat.MessageReceipt) => {
        if (!hideReceipt) {
          messageReadAndDelivered(messageReceipt);
        }
      });
      const onMessagesDeliveredToAll = CometChatMessageEvents.onMessagesDeliveredToAll.subscribe((messageReceipt: CometChat.MessageReceipt) => {
        if (!hideReceipt) {
          messageReadAndDelivered(messageReceipt);
        }
      });
      const onMessagesReadByAll = CometChatMessageEvents.onMessagesReadByAll.subscribe((messageReceipt: CometChat.MessageReceipt) => {
        if (!hideReceipt) {
          messageReadAndDelivered(messageReceipt);
        }
      });
      const onMessageDeleted = CometChatMessageEvents.onMessageDeleted.subscribe((deletedMessage: CometChat.BaseMessage) => {
        replaceUpdatedMessage(deletedMessage);
      });
      const onMessageEdited = CometChatMessageEvents.onMessageEdited.subscribe((editedMessage: CometChat.BaseMessage) => {
        replaceUpdatedMessage(editedMessage);
      });
      const onTransientMessageReceived = CometChatMessageEvents.onTransientMessageReceived.subscribe((transientMessage: CometChat.TransientMessage) => {
        let message: CometChat.TransientMessage =
          transientMessage as CometChat.TransientMessage;
        let liveReaction: any = message.getData();
        if (
          validateTransientMessage(transientMessage)
          && liveReaction["type"] == "live_reaction"
        ) {
          CometChatMessageEvents.ccLiveReaction.next(
            liveReaction["reaction"]
          );
        }
      });

      let onMessageReactionAdded: Subscription, onMessageReactionRemoved: Subscription;

      if (!disableReactions) {
        onMessageReactionAdded = CometChatMessageEvents.onMessageReactionAdded.subscribe((reactionReceipt) => {
          messageReactionUpdated(reactionReceipt, true);
        });
        onMessageReactionRemoved = CometChatMessageEvents.onMessageReactionRemoved.subscribe((reactionReceipt) => {
          messageReactionUpdated(reactionReceipt, false);
        });
      }

      return () => {
        try {
          ccMessageEdit?.unsubscribe();
          ccMessageSent?.unsubscribe();
          ccGroupMemberAdded?.unsubscribe();
          ccGroupMemberBanned?.unsubscribe();
          ccGroupMemberKicked?.unsubscribe();
          ccGroupMemberScopeChanged?.unsubscribe();
          ccGroupLeft?.unsubscribe();
          ccShowOngoingCall?.unsubscribe();
          ccOutgoingCall?.unsubscribe();
          ccCallEnded?.unsubscribe();
          ccCallRejected?.unsubscribe();
          ccCallAccepted?.unsubscribe();
          ccShowDialog?.unsubscribe();
          ccHideDialog?.unsubscribe();
          ccShowPanel?.unsubscribe();
          ccHidePanel?.unsubscribe();
          ccMessageTranslated?.unsubscribe();
          ccMessageRead?.unsubscribe();
          onTextMessageReceived?.unsubscribe();
          onMediaMessageReceived?.unsubscribe();
          onCustomMessageReceived?.unsubscribe();
          onMessagesDelivered?.unsubscribe();
          onMessagesRead?.unsubscribe();
          onMessagesDeliveredToAll?.unsubscribe();
          onMessagesReadByAll?.unsubscribe();
          onMessageDeleted?.unsubscribe();
          onMessageEdited?.unsubscribe();
          onTransientMessageReceived?.unsubscribe();
          if (!disableReactions) {
            onMessageReactionAdded?.unsubscribe();
            onMessageReactionRemoved?.unsubscribe();
          }
        } catch (error: any) {
          onErrorCallback(error);
        }
      };
    } catch (error: any) {
      onErrorCallback(error);
    }
  }, [
    validateTransientMessage,
    resetCountForUnreadMessagesInThread,
    disableReactions,
    callActionMessageReceived,
    isThreadOfCurrentChatForSDKEvent,
    updateMessage,
    groupActionMessageReceived,
    isPartOfCurrentChatForUIEvent,
    updateView,
    addMessage,
    isThreadOfCurrentChatForUIEvent,
    updateReplyCount,
    onErrorCallback,
    showFooterPanelView,
  ]);

  /**
   * Fuction to handle realtime date seperator update.
   *
   * @type {void}
   */
  const handleScroll = useCallback(() => {
    const messageListBody = document.querySelector(".cometchat-message-list .cometchat-list__body");
    if (!messageListBody) return;
    let firstVisibleMessageId: any = null;
    Object.keys(elementRefs.current).some((messageId) => {
      const element = elementRefs.current[messageId];
      if (element.current) {
        const rect = element.current.getBoundingClientRect();
        const containerRect = messageListBody.getBoundingClientRect();
        if (rect.top >= containerRect.top && rect.bottom <= containerRect.bottom) {
          firstVisibleMessageId = messageId;
          return true;
        }
      }
      return false;
    });
    if (firstVisibleMessageId) {
      const currentVisibleMessage = getMessageById(firstVisibleMessageId);
      if (currentVisibleMessage) {
        const messageDate = currentVisibleMessage.getSentAt();
        if (isDateDifferent(dateHeaderRef.current, messageDate)) {
          setDateHeader(messageDate);
          dateHeaderRef.current = messageDate;

        }
      }
    }
  }, [getMessageById, setDateHeader, messageList])

  useEffect(() => {
    let listElement = document.querySelector(".cometchat-message-list .cometchat-list__body");
    if (listElement) {
      listElement.addEventListener("scroll", handleScroll)
    }
    return () => {
      if (listElement) {
        listElement.removeEventListener("scroll", handleScroll);
      }
    }

  }, [handleScroll])
/**
 * Function to close toast
 */
  const closeToast = ()=>{
    setShowToast(false);
  }

  /**
 * Function to check if two dates are different
 * @param {number | undefined} firstDate - The first date to compare
 * @param {number | undefined} secondDate - The second date to compare
 * @returns {boolean | undefined} Returns true if dates are different, false otherwise
 */
  const isDateDifferent: (firstDate: number | undefined, secondDate: number | undefined) => boolean | undefined = useCallback(
    (firstDate: number | undefined, secondDate: number | undefined) => {
      try {
        let firstDateObj: Date, secondDateObj: Date;
        firstDateObj = new Date(firstDate! * 1000);
        secondDateObj = new Date(secondDate! * 1000);
        return (
          firstDateObj.getDate() !== secondDateObj.getDate() ||
          firstDateObj.getMonth() !== secondDateObj.getMonth() ||
          firstDateObj.getFullYear() !== secondDateObj.getFullYear()
        );
      } catch (error: any) {
        onErrorCallback(error);
      }
    },
    [onErrorCallback]
  );

  /**
   * Function to decide whether to show header title or not
   * @param {CometChat.BaseMessage} message - The message for which header title needs to be decided
   * @returns {boolean} Returns true if header title needs to be shown, false otherwise
   */

  const showHeaderTitle: (message: CometChat.BaseMessage) => boolean = useCallback(
    (message: CometChat.BaseMessage) => {
      if (alignment === MessageListAlignment.left) {
        return true;
      } else {
        if (
          groupRef.current &&
          message?.getCategory() !==
          CometChatUIKitConstants.MessageCategory.action &&
          message?.getSender() &&
          message?.getSender()?.getUid() !== loggedInUserRef.current?.getUid() &&
          alignment === MessageListAlignment.standard
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    [alignment]
  );

  /**
 * Function to get leading view for message bubble
 * @param {CometChat.BaseMessage} message - The message for which leading view needs to be fetched
 * @returns {any} Returns JSX.Element or null for leading view of a message bubble
 */

  const getBubbleLeadingView: (message: CometChat.BaseMessage) => any = useCallback(
    (item: CometChat.BaseMessage) => {
      if (
        item?.getCategory() !==
        CometChatUIKitConstants.MessageCategory.action &&
        item?.getCategory() !== CometChatUIKitConstants.MessageCategory.call &&

        showHeaderTitle(item)
      ) {
        return (
          <CometChatAvatar
            name={item?.getSender()?.getName()}
            image={item?.getSender()?.getAvatar()}
          ></CometChatAvatar>
        );
      } else {
        return null;
      }
    },
    [showHeaderTitle]
  );

  /**
 * Function to get header date for message bubble
 * @param {CometChat.BaseMessage} item - The message bubble for which header date needs to be fetched
 * @returns {JSX.Element} Returns JSX.Element for header date of a message bubble
 */
  const getBubbleHeaderDate: (item: CometChat.BaseMessage) => JSX.Element = useCallback(
    (item: CometChat.BaseMessage) => {
      return (
        <>
          <CometChatDate
            timestamp={item.getSentAt()}
            pattern={datePattern}
          ></CometChatDate>
        </>
      );
    },
    [datePattern]
  );

  /**
 * Function to get header title for message bubble
 * @param {CometChat.BaseMessage} item - The message bubble for which header title needs to be fetched
 * @returns {JSX.Element} Returns JSX.Element for header title of a message bubble
 */

  const getBubbleHeaderTitle: (item: CometChat.BaseMessage) => JSX.Element = useCallback(
    (item: CometChat.BaseMessage) => {
      return (
        <>{item.getSender().getName()}</>
      );
    },
    []
  );

  /**
 * Function to get the header of a message bubble
 * @param {CometChat.BaseMessage} item - The message bubble for which the header needs to be fetched
 * @returns {any} Returns JSX.Element or null for header view of a message bubble
 */

  const getBubbleHeader: (item: CometChat.BaseMessage) => any = useCallback(
    (item: CometChat.BaseMessage) => {
      if (getHeaderView(item)) {
        return getHeaderView(item);
      } else {
        if (
          item?.getCategory() !==
          CometChatUIKitConstants.MessageCategory.action &&
          item?.getCategory() !== CometChatUIKitConstants.MessageCategory.call
        ) {
          return showHeaderTitle(item) ? getBubbleHeaderTitle(item) : null
        }
      }

      return null;
    },
    [

      getBubbleHeaderDate,
      showHeaderTitle,
      getHeaderView,
      getBubbleHeaderTitle,
    ]
  );


  const reactionItemClicked = useCallback((
    reaction: CometChat.Reaction,
    message: CometChat.BaseMessage
  ) => {
    if (reaction?.getReactedBy()?.getUid() === loggedInUserRef.current?.getUid()) {
      reactToMessages(reaction?.getReaction(), message);
    }
  }, [reactToMessages])



  /**
 * Function to get reaction view for message bubble
 * @param {CometChat.BaseMessage} item - The message bubble for which the reaction view needs to be fetched
 * @returns {JSX.Element | null} Returns JSX.Element for reaction view of a message bubble or null
 */
  const getReactionView: (item: CometChat.BaseMessage) => JSX.Element | null = useCallback(
    (item: CometChat.BaseMessage) => {
      const reactions = item?.getReactions() || [];
      const alignment = setBubbleAlignment(item);
      if (reactions && reactions.length > 0 && !disableReactions) {
        return <CometChatReactions
          messageObject={item}
          alignment={alignment}
          hoverDebounceTime={500}
          onReactionListItemClick={onReactionListItemClick ?? reactionItemClicked}
          reactionsRequestBuilder={reactionsRequestBuilder}
          onReactionClick={(reaction: CometChat.ReactionCount, message: CometChat.BaseMessage) => {
            if (onReactionClick) {
              onReactionClick(reaction, message);
            } else {
              reactToMessages(reaction?.getReaction(), message);
            }
          }
          }
        />
      } else {
        return null;
      }
    },
    [
      disableReactions,
      reactToMessages,
      setBubbleAlignment,
    ]
  );
  /**
 * Function to get footer view for message bubble
 * @param {CometChat.BaseMessage} item - The message bubble for which the footer view needs to be fetched
 * @returns {any} Returns JSX.Element for footer view of a message bubble
 */
  const getBubbleFooterView: (item: CometChat.BaseMessage) => any = useCallback(
    (item: CometChat.BaseMessage) => {
      if (getFooterView(item)) {
        return getFooterView(item);
      } else {
        return getReactionView(item);
      }
    },
    [getReactionView, getFooterView, setBubbleAlignment]
  );

  /**
 * Function to get thread view for message bubble
 * @param {CometChat.BaseMessage} item - The message bubble for which the thread view needs to be fetched
 * @returns {any} Returns JSX.Element for thread view of a message bubble
 */
  const getBubbleThreadView: (item: CometChat.BaseMessage) => any = useCallback(
    (item: CometChat.BaseMessage) => {
      if (item?.getReplyCount() && !item?.getDeletedAt()) {

        return (
          <div className='cometchat-message-bubble__thread-view-replies'>
            <CometChatButton text={getThreadCount(item)} hoverText={getThreadCount(item)} iconURL={repliesRightIcon} onClick={() => {
              openThreadView(item)
            }} />


          </div>
        );
      }
    },
    [
      setBubbleAlignment,
      openThreadView,
    ]
  );

  /**
* Function to create status view for the message
* @param {CometChat.BaseMessage} item - The message for which the status view needs to be fetched
* @returns {any} - Returns JSX.Element or null for status view of a message
*/

  const getStatusInfoView: (item: CometChat.BaseMessage) => any = useCallback(
    (item: CometChat.BaseMessage) => {
      try {
        let _alignment = setBubbleAlignment(item);
        if (
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()] &&
          messagesTypesMap[item?.getCategory() + "_" + item?.getType()]?.statusInfoView
        ) {
          return messagesTypesMap[item?.getCategory() + "_" + item?.getType()]?.statusInfoView(
            item,
            _alignment,
            hideReceipt,
            datePattern
          );
        } else {
          return null;
        }
      } catch (error: any) {
        onErrorCallback(error);
        return null;
      }
    },
    [
      messagesTypesMap,
      onErrorCallback,
      setBubbleAlignment,
    ]
  );

  /**
 * Function to generate a message bubble
 * @param {CometChat.BaseMessage} item - The message for which the bubble needs to be created
 * @param {number} i - The index of the message
 * @returns {JSX.Element} - Returns JSX.Element for a message bubble
 */

  const getMessageBubbleItem: (item: CometChat.BaseMessage, i: number) => JSX.Element = useCallback(
    (item: CometChat.BaseMessage, i: number) => {
      return (
        <CometChatMessageBubble
          setRef={(ref) => {
            elementRefs.current[item.getId()] = ref;
          }}
          leadingView={getBubbleLeadingView(item)}
          headerView={getBubbleHeader(item)}
          footerView={getBubbleFooterView(item)}
          contentView={getContentView(item)}
          bottomView={getBottomView(item)}
          id={item?.getId() || item?.getMuid()}
          options={getMessageOptions(item)}
          alignment={setBubbleAlignment(item)}
          replyView={null}
          threadView={getBubbleThreadView(item)}
          statusInfoView={getStatusInfoView(item)}
          type={item.getDeletedAt() ? CometChatUIKitConstants.MessageTypes.delete : item.getType()}
          category={item.getDeletedAt() ? CometChatUIKitConstants.MessageCategory.action : item.getCategory()}
        ></CometChatMessageBubble>
      );
    },
    [
      getBubbleLeadingView,
      getBubbleHeader,
      getBubbleFooterView,
      getContentView,
      alignment,
      setBubbleAlignment,
      getBubbleThreadView,
      getStatusInfoView,
      getMessageOptions,
      getBottomView,
    ]
  );


  /**
 * Function to create date for the message bubble
 * @param {CometChat.BaseMessage} item - The message for which the date needs to be fetched
 * @param {number} i - The index of the message
 * @returns {JSX.Element | null} - Returns JSX.Element or null for date of a message bubble
 */
  const getMessageBubbleDateHeader: (item: CometChat.BaseMessage, i: number) => JSX.Element | null = useCallback(
    (item: CometChat.BaseMessage, i: number) => {
      if (
        i != 0 && isDateDifferent(messageList[i - 1]?.getSentAt(), item?.getSentAt())
      ) {
        return (
          <div
            className='cometchat-message-list__bubble-date-header'
            key={`${item.getId()}-${item.getSentAt()}`}
          >
            <CometChatDate
              timestamp={item.getSentAt()}
              pattern={DateSeparatorPattern}
            ></CometChatDate>
          </div>
        );
      } else {
        if((i == 0 && !isOnBottomRef.current) || ((messageList.length < 10) && i == 0)){
          setDateHeader(item?.getSentAt());
          dateHeaderRef.current = item?.getSentAt();
        }
        return null;
      }
    },
    [
      DateSeparatorPattern,
      messageList,
      isDateDifferent,
    ]
  );

  /**
 * Function to create a message bubble
 * @param {CometChat.BaseMessage} m - The message for which the bubble needs to be created
 * @param {number} i - The index of the message
 * @returns {JSX.Element} - Returns JSX.Element for a message bubble
 */
  const getMessageBubble: (m: CometChat.BaseMessage, i: number) => JSX.Element = useCallback(
    (m: CometChat.BaseMessage, i: number) => {
      let _alignment = setBubbleAlignment(m);
     

      return (
        <div
          style={{
            width: "100%",
          }}
          key={m.getId()}
        >
        {getMessageBubbleDateHeader(m,i)}
          {getBubbleWrapper(m)
            ? getBubbleWrapper(m)
            : getMessageBubbleItem(m, i)}
        </div>
      );
    },
    [
      getBubbleWrapper,
      getMessageBubbleItem,
      setBubbleAlignment,
    ]
  );

  /**
 * Function to generate a message bubble view item
 * @param {CometChat.BaseMessage} item - The message for which the view item needs to be created
 * @param {number} i - The index of the message
 * @returns {JSX.Element} - Returns JSX.Element for a message bubble view item
 */
  const getMessageBubbleViewItem: (item: CometChat.BaseMessage, i: number) => JSX.Element = useCallback(
    (item: CometChat.BaseMessage, i: number) => {
      return (
        <CometChatMessageBubble
          type={item.getDeletedAt() ? CometChatUIKitConstants.MessageTypes.delete : item.getType()}
          category={item.getDeletedAt() ? CometChatUIKitConstants.MessageCategory.action : item.getCategory()}
          leadingView={getBubbleLeadingView(item)}
          headerView={getBubbleHeader(item)}
          footerView={null}
          contentView={getContentView(item)}
          bottomView={null}
          statusInfoView={null}
          id={item?.getId() || item?.getMuid()}
          options={[]}
          alignment={setBubbleAlignment(item)}
          replyView={null}
          threadView={null}
        ></CometChatMessageBubble>
      );
    },
    [
      getBubbleLeadingView,
      getBubbleHeader,
      getContentView,
      alignment,
      setBubbleAlignment,
    ]
  );



  /**
 * Function to get the bubble view
 * @param {CometChat.BaseMessage} m - The message for which the bubble view needs to be fetched
 * @param {number} i - The index of the message
 * @returns {JSX.Element} - Returns JSX.Element for a bubble view
 */
  const getBubbleView: (m: CometChat.BaseMessage, i: number) => JSX.Element = useCallback(
    (m: CometChat.BaseMessage, i: number) => {
      return (
        <div
          style={{
            width: "100%"
          }}
          key={m.getId()}
        >
          {getBubbleWrapper(m)
            ? getBubbleWrapper(m)
            : getMessageBubbleViewItem(m, i)}
        </div>
      );
    },
    [
      getBubbleWrapper,
      getMessageBubbleItem,
      getMessageBubbleViewItem,
    ]
  );

  /**
 * Function to get the footer of the message list
 * @returns {JSX.Element} - Returns JSX.Element for the footer of the message list
 */
  const getMessageListFooter: () => JSX.Element = useCallback(() => {
    return (
      <>
        {showFooterPanelView && smartReplyViewRef.current ? smartReplyViewRef.current : null}
        {footerView && !smartReplyViewRef.current ? footerView : null}
      </>
    );
  }, [
    footerView,
    scrollToBottom,
    showFooterPanelView
  ]);

  /**
 * Function to get the header of the message list
 * @returns {JSX.Element} - Returns JSX.Element for the header of the message list
 */
  const getMessageListHeader: () => JSX.Element = useCallback(() => {
    return (
      <>
        {showHeaderPanelView && headerViewRef.current ? headerViewRef.current : null}
        {headerView && !headerViewRef.current ? headerView : null}
      </>
    );
  }, [
    headerView,
    showHeaderPanelView
  ]);
  /**
 * Function to get the thread count of a message
 * @param {CometChat.BaseMessage} message - The message for which the thread count needs to be fetched
 * @returns {string} - Returns the thread count of the message as a string
 */
  const getThreadCount: (message: CometChat.BaseMessage) => string = (message: CometChat.BaseMessage) => {
    const replyCount = message?.getReplyCount() || 0;
    const suffix = replyCount === 1 ? localize("REPLY") : localize("REPLIES");
    return `${replyCount} ${suffix}`;
  };

  /**
 * Function to get the threaded message bubble
 * @param {CometChat.BaseMessage} item - The message for which the threaded bubble needs to be fetched
 * @returns {JSX.Element} - Returns JSX.Element for a threaded message bubble
 */
  const getThreadedMessageBubble: (item: CometChat.BaseMessage) => JSX.Element = useCallback(
    (item: CometChat.BaseMessage) => {
      return (
        <>
          {getBubbleWrapper(item) ? (
            getBubbleWrapper(item)
          ) : (
            <CometChatMessageBubble
              type={item.getDeletedAt() ? CometChatUIKitConstants.MessageTypes.delete : item.getType()}
              category={item.getDeletedAt() ? CometChatUIKitConstants.MessageCategory.action : item.getCategory()}
              leadingView={getBubbleLeadingView(item)}
              headerView={getBubbleHeader(item)}
              footerView={null}
              contentView={getContentView(item)}
              bottomView={getBottomView(item)}
              statusInfoView={getStatusInfoView(item)}
              id={item?.getId() || item?.getMuid()}
              alignment={threadedAlignment}
              replyView={null}
              threadView={null}
              options={[]}
            ></CometChatMessageBubble>
          )}
        </>
      );
    },
    [
      getBubbleLeadingView,
      getBubbleHeader,
      getBubbleFooterView,
      getContentView,
      alignment,
      getMessageOptions,
      getBubbleWrapper,
      getBottomView,
    ]
  );

  /**
 * Function to get list item
 * @param {CometChat.BaseMessage} message - The message for which the list item needs to be fetched
 * @param {number} index - The index of the message
 * @returns {JSX.Element} - Returns JSX.Element for a list item
 */

  const getListItem: (message: CometChat.BaseMessage, index: number) => JSX.Element = useMemo(() => {
    return function (message: CometChat.BaseMessage, index: number): JSX.Element {
      return getMessageBubble(message, index);
    };
  }, [getMessageBubble]);

  /**
 * Function to get the current state of the message list
 * @returns {States} - Returns the current state of the message list
 */
  const getCurrentMessageListState: () => States = useCallback(() => {
    return messageListState
  }, [messageListState]);
  /**
   * Function to hide the message information
   */
  const hideMessageInformation: () => void = () => {
    setShowMessageInfoPopup(false);
  };

  /**
 * Function to get the message template based on the message type and category
 * @param {CometChat.BaseMessage} selectedMessage - The message for which the template needs to be fetched
 * @returns {CometChatMessageTemplate} - Returns the template of the selected message
 */
  const getMessageTemplate: (selectedMessage: CometChat.BaseMessage) => CometChatMessageTemplate = (selectedMessage: CometChat.BaseMessage) => {
    return messagesTypesMap[
      `${selectedMessage?.getCategory() + "_" + selectedMessage?.getType()}`
    ];
  };
  /**
   * Custom useCometChatMessageList for CometChatMessageList component.
   */
  useCometChatMessageList(
    loggedInUserRef,
    messageListManagerRef,
    fetchPreviousMessages,
    handleGroupAndCallActions,
    messagesRequestBuilder,
    userRef.current,
    groupRef.current,
    messageIdRef,
    totalMessagesCountRef,
    messageList,
    onErrorCallback,
    setMessageList,
    setScrollListToBottom,
    smartReplyViewRef,
    isOnBottomRef,
    isFirstReloadRef,
    subscribeToUIEvents,
    setDateHeader,
    parentMessageId,
  );

  return (
    <>
      <div className="cometchat" style={{
        height: "inherit",
        width: "100%",
        overflow:'hidden',
        boxSizing: "border-box"
      }}>
        <div
          className='cometchat-message-list'
        >
          {!hideDateSeparator && dateHeader ? <div
            className='cometchat-message-list__date-header'
          >
            <CometChatDate
              timestamp={dateHeader}
              pattern={DateSeparatorPattern}
            ></CometChatDate>
          </div> : null}

          <div
            className='cometchat-message-list__header'
          >
            {getMessageListHeader()}
          </div>
          <div className='cometchat-message-list__body
'
          >
            <CometChatList
              scrolledUpCallback={updateIsOnBottom}
              title={""}
              hideSearch={true}
              showSectionHeader={false}
              list={messageList}
              listItem={getListItem}
              onScrolledToBottom={onBottomCallback}
              onScrolledToTop={onTopCallback}
              listItemKey='getMuid'
              state={getCurrentMessageListState()}
              loadingView={getLoaderHtml}
              hideError={hideError}
              errorStateView={getErrorHtml}
              emptyStateView={getEmptyHtml}
              scrollToBottom={scrollListToBottom}
            />
            {showNewMessagesBanner &&
              UnreadMessagesRef.current &&
              UnreadMessagesRef.current.length > 0 &&
              !isOnBottomRef.current ? (
              <div
                className='cometchat-message-list__message-indicator'>
                <CometChatButton
                  text={newMessageTextRef.current}
                  iconURL={downArrow}
                  onClick={scrollToBottom}
                ></CometChatButton>

              </div>
            ) : null}

          </div>
          <div
            className='cometchat-message-list__footer'
          >
            {getMessageListFooter()}
          </div>
                      {showToast ? <CometChatToast text={toastTextRef.current} onClose={closeToast}/> : null}

        </div>
      </div>
      {showCallScreen ? ongoingCallView : null}
      {showConfirmDialog && imageModerationDialogRef.current
        ? imageModerationDialogRef.current
        : null}
      {showMessageInfoPopup && activeMessageInfo !== null && (
        <div className="cometchat-message-information__popup-wrapper">
          <CometChatMessageInformation
            message={activeMessageInfo}
            onClose={ hideMessageInformation}
          />
        </div>
      )}
    </>
  );
};

export { CometChatMessageList };
