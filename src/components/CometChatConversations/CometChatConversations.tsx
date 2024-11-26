
import {
  JSX,
  useCallback,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  useCometChatErrorHandler,
  useStateRef,
} from "../../CometChatCustomHooks";
import { ChatConfigurator } from "../../utils/ChatConfigurator";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatCheckbox } from "../BaseComponents/CometChatCheckbox/CometChatCheckbox";
import { CometChatList } from "../BaseComponents/CometChatList/CometChatList";
import { CometChatListItem } from "../BaseComponents/CometChatListItem/CometChatListItem";
import { CometChatRadioButton } from "../BaseComponents/CometChatRadioButton/CometChatRadioButton";
import { ConversationsManager } from "./controller";
import { useCometChatConversations } from "./useCometChatConversations";
import { CometChatTextFormatter } from "../../formatters/CometChatFormatters/CometChatTextFormatter";
import { CometChatUIKitUtility } from "../../CometChatUIKit/CometChatUIKitUtility";
import { MessageReceiptUtils, receipts } from "../../utils/MessageReceiptUtils";
import { ConversationUtils } from "../../utils/ConversationUtils";
import { DatePatterns, MentionsTargetElement, Placement, SelectionMode, States, TitleAlignment } from "../../Enums/Enums";
import { CometChatActionsIcon, CometChatOption } from "../../modals";
import { CometChatUIKitConstants } from "../../constants/CometChatUIKitConstants";
import { localize } from "../../resources/CometChatLocalize/cometchat-localize";
import { isMissedCall } from "../Calling/Utils/utils";
import { CometChatDate } from "../BaseComponents/CometChatDate/CometChatDate";
import { PollsConstants } from "../Extensions/Polls/PollsConstants";
import { StickersConstants } from "../Extensions/Stickers/StickersConstants";
import { CollaborativeWhiteboardConstants } from "../Extensions/CollaborativeWhiteboard/CollaborativeWhiteboardConstants";
import { CollaborativeDocumentConstants } from "../Extensions/CollaborativeDocument/CollaborativeDocumentConstants";
import emptyIcon from "../../assets/conversations_empty_state.svg";
import emptyIconDark from "../../assets/conversations_empty_state_dark.svg";
import errorIcon from "../../assets/list_error_state_icon.svg"
import errorIconDark from "../../assets/list_error_state_icon_dark.svg"

import { CometChatConfirmDialog } from "../BaseComponents/CometChatConfirmDialog/CometChatConfirmDialog";
import { CometChatContextMenu } from "../BaseComponents/CometChatContextMenu/CometChatContextMenu";
import { getThemeMode, isURL } from "../../utils/util";
import { CometChatConversationEvents } from "../../events/CometChatConversationEvents";
import CometChatToast from "../BaseComponents/CometChatToast/CometChatToast";
type Message =
  | CometChat.TextMessage
  | CometChat.MediaMessage
  | CometChat.CustomMessage
  | CometChat.Action
  | CometChat.Call;

interface ConversationsProps {
  /**
   * Custom view to render on the top-right of the component
   */
  menu?: JSX.Element;
  /**
   * Title of the component
   *
   * @defaultValue `localize("CHATS")`
   */
  title?: string;
  /**
   * Request builder to fetch conversations
   * @defaultValue Default request builder having the limit set to 30
   */
  conversationsRequestBuilder?: CometChat.ConversationsRequestBuilder;
  /**
   * Function to call whenever the component encounters an error
   */
  onError?: (error: CometChat.CometChatException) => void;
  /**
   * Custom list item view to be rendered for each conversation in the fetched list
   */
  listItemView?: (conversation: CometChat.Conversation) => JSX.Element;
  /**
   * Custom subtitle view to be rendered for each conversation in the fetched list
   *
   * @remarks
   * This prop is used if `listItemView` prop is not provided
   */
  subtitleView?: (conversation: CometChat.Conversation) => JSX.Element;
  /**
   * Custom tail view to be rendered for each conversation in the fetched list
   *
   * @remarks
   * This prop is used if `listItemView` prop is not provided
   */
  tailView?: (conversation: CometChat.Conversation) => JSX.Element;
  /**
   * Hide user presence
   *
   * @remarks
   * If set to true, the status indicator of the default list item view is not displayed for conversation objects related to users
   *
   * @defaultValue `false`
   */
  disableUsersPresence?: boolean;
  /**
   * Conversation to highlight
   *
   * @remarks
   * This prop is used if `listItemView` prop is not provided
   */
  activeConversation?: CometChat.Conversation;
  /**
   * Selection mode to use for the default tail view
   *
   * @remarks
   * This prop is used if `listItemView` prop is not provided.
   *
   * @defaultValue `SelectionMode.none`
   */
  selectionMode?: SelectionMode;
  /**
   * Disable receipt status
   *
   * @remarks
   * If set to true, the receipt status of the sent message won't be displayed, and received messages won't be marked as delivered
   *
   * @defaultValue `false`
   */
  hideReceipt?: boolean;
  /**
   * List of actions available on mouse over on the default list item component
   */
  options?:
  | ((conversation: CometChat.Conversation) => CometChatOption[])
  | null;
  /**
   * Date format for the date component
   *
   * @remarks
   * The date component is inside the tail view of the default list item view when `selectionMode` prop is set to `SelectionMode.none`
   */
  datePattern?: DatePatterns;
  /**
   * Custom view for the loading state of the component
   */
  loadingStateView?: JSX.Element;
  /**
   * Custom view for the empty state of the component
   */
  emptyStateView?: JSX.Element;
  /**
   * Custom view for the error state of the component
   */
  errorStateView?: JSX.Element;
  /**
   * Hide error view
   *
   * @remarks
   * If set to true, hides the default and the custom error view
   *
   * @defaultValue `false`
   */
  hideError?: boolean;
  /**
   * Function to call on click of the default list item view of a conversation
   */
  onItemClick?: (conversation: CometChat.Conversation) => void;
  /**
   * Function to call when a conversation from the fetched list is selected
   *
   * @remarks
   * This prop is used if `selectionMode` prop is not `SelectionMode.none`
   */
  onSelect?: (conversation: CometChat.Conversation, selected: boolean) => void;
  /**
   * Disable typing indicator display
   *
   * @defaultValue `false`
   */
  disableTyping?: boolean;
  /**
   * Title of the confirmation dialog.
   * 
   */
  confirmDialogTitle?: string;

  /**
   * Message displayed in the confirmation dialog.
   * 
   */
  confirmDialogMessage?: string;

  /**
  * Text for the cancel button in the confirmation dialog.
  */
  cancelButtonText?: string;

  /**
   * Text for the confirm button in the confirmation dialog.
   */
  confirmButtonText?: string;

  /**
   * Disable mentions in conversation. Default value is set to false
   */
  disableMentions?: boolean;

  /**
   * Allows user to pass custom formatters
   */
  textFormatters?: CometChatTextFormatter[];
}

type State = {
  conversationList: CometChat.Conversation[];
  fetchState: States;
  typingIndicatorMap: Map<string, CometChat.TypingIndicator>;
  conversationToBeDeleted: CometChat.Conversation | null;
  loggedInUser: CometChat.User | null;
  isFirstReload: boolean;
  unreadMentions: boolean;
};

export type Action =
  | {
    type: "appendConversations";
    conversations: CometChat.Conversation[];
    removeOldConversation?: boolean;
  }
  | { type: "setConversationList"; conversationList: CometChat.Conversation[] }
  | { type: "setFetchState"; fetchState: States }
  | {
    type: "setConversationToBeDeleted";
    conversation: CometChat.Conversation | null;
  }
  | { type: "removeConversation"; conversation: CometChat.Conversation }
  | { type: "updateConversationWithUser"; user: CometChat.User }
  | {
    type: "fromUpdateConversationListFn";
    conversation: CometChat.Conversation;
  }
  | { type: "addTypingIndicator"; typingIndicator: CometChat.TypingIndicator }
  | {
    type: "removeTypingIndicator";
    typingIndicator: CometChat.TypingIndicator;
  }
  | { type: "updateConversationLastMessage"; message: CometChat.BaseMessage }
  | {
    type: "updateConversationLastMessageAndPlaceAtTheTop";
    message: CometChat.BaseMessage;
  }
  | {
    type: "updateConversationLastMessageAndGroupAndPlaceAtTheTop";
    group: CometChat.Group;
    message: CometChat.Action;
  }
  | { type: "removeConversationOfTheGroup"; group: CometChat.Group }
  | { type: "removeConversationOfTheUser"; user: CometChat.User }
  | {
    type: "updateConversationLastMessageResetUnreadCountAndPlaceAtTheTop";
    message: CometChat.BaseMessage;
    conversation: CometChat.Conversation;
  }
  | {
    type: "resetUnreadCountAndSetReadAtIfLastMessage";
    message: CometChat.BaseMessage;
  }
  | {
    type: "setLastMessageReadOrDeliveredAt";
    updateReadAt: boolean;
    messageReceipt: CometChat.MessageReceipt;
  }
  | { type: "setLoggedInUser"; loggedInUser: CometChat.User | null }
  | { type: "setIsFirstReload"; isFirstReload: boolean };

/**
 * Checks if `message` is a base message
 *
 * @remarks
 * `CometChat.BaseMessage` is private hence, can't use it with `instanceOf`.
 * This function is identical to `message instanceOf CometChat.BaseMessage` if `CometChat.BaseMessage` wasn't private
 *
 * @param message - A pontential Base message object
 * @returns Is `message` a base message
 */
function isAMessage(message: unknown): message is Message {
  return (
    message instanceof CometChat.TextMessage ||
    message instanceof CometChat.MediaMessage ||
    message instanceof CometChat.CustomMessage ||
    message instanceof CometChat.InteractiveMessage ||
    message instanceof CometChat.Action ||
    message instanceof CometChat.Call
  );
}

function stateReducer(state: State, action: Action): State {
  let newState = state;
  const { type } = action;
  switch (type) {
    case "appendConversations":
      if (action.conversations.length > 0) {
        let conversations: CometChat.Conversation[] = [];
        if (action.removeOldConversation) {
          state.conversationList = [];
          conversations = action.conversations;
        } else {
          conversations = [...state.conversationList, ...action.conversations];
        }
        newState = { ...state, conversationList: conversations };
      }
      break;
    case "setConversationList": {
      const { typingIndicatorMap } = state;
      const { conversationList } = action;
      const newTypingIndicatorMap = new Map<
        string,
        CometChat.TypingIndicator
      >();
      for (let i = 0; i < conversationList.length; i++) {
        const convWith = conversationList[i].getConversationWith();
        const convWithId =
          convWith instanceof CometChat.User
            ? convWith?.getUid()
            : convWith.getGuid();
        if (typingIndicatorMap.has(convWithId)) {
          newTypingIndicatorMap.set(
            convWithId,
            typingIndicatorMap.get(convWithId)!
          );
        }
      }
      newState = {
        ...state,
        conversationList,
        typingIndicatorMap: newTypingIndicatorMap,
      };
      break;
    }
    case "setFetchState":
      newState = { ...state, fetchState: action.fetchState };
      break;
    case "setConversationToBeDeleted":
      newState = { ...state, conversationToBeDeleted: action.conversation };
      break;
    case "removeConversation": {
      const { typingIndicatorMap, conversationList } = state;
      const targetConvId = action.conversation.getConversationId();
      const targetIdx = conversationList.findIndex(
        (conv) => conv.getConversationId() === targetConvId
      );
      if (targetIdx > -1) {
        const convWith = conversationList[targetIdx].getConversationWith();
        const convWithId =
          convWith instanceof CometChat.User
            ? convWith?.getUid()
            : convWith.getGuid();
        let newTypingIndicatorMap: Map<string, CometChat.TypingIndicator>;
        if (typingIndicatorMap.has(convWithId)) {
          newTypingIndicatorMap = new Map(typingIndicatorMap);
          newTypingIndicatorMap.delete(convWithId);
        } else {
          newTypingIndicatorMap = typingIndicatorMap;
        }
        const newConversationList = state.conversationList.filter(
          (conv, i) => i !== targetIdx
        );
        newState = {
          ...state,
          conversationList: newConversationList,
          typingIndicatorMap: newTypingIndicatorMap,
        };
      }
      break;
    }
    case "updateConversationWithUser": {
      const { user } = action;
      const { conversationList } = state;
      const targetUid = user.getUid();
      const targetIdx = conversationList.findIndex((conv) => {
        const convWith = conv.getConversationWith();
        return (
          convWith instanceof CometChat.User && convWith?.getUid() === targetUid
        );
      });
      if (targetIdx > -1) {
        const newConversationList = conversationList.map((conv, i) => {
          if (i === targetIdx) {
            const newConv = CometChatUIKitUtility.clone(conv);
            newConv.setConversationWith(user);
            return newConv;
          }
          return conv;
        });
        newState = { ...state, conversationList: newConversationList };
      }
      break;
    }
    case "fromUpdateConversationListFn": {
      const { conversation } = action;
      const targetId = conversation.getConversationId();
      const conversations = state.conversationList.filter((conv) => {
        if (conv.getConversationId() !== targetId) {
          return true;
        }
        // conversation.setUnreadMessageCount(conversation.getUnreadMessageCount() + conv.getUnreadMessageCount());
        return false;
      });
      newState = {
        ...state,
        conversationList: [conversation, ...conversations],
      };
      break;
    }
    case "setLastMessageReadOrDeliveredAt": {
      const { conversationList } = state;
      const { messageReceipt, updateReadAt } = action;
      let targetMessageId = "";
      if (messageReceipt && typeof messageReceipt.getMessageId === 'function') {
        targetMessageId = messageReceipt.getMessageId();
      }
      const targetIdx = conversationList.findIndex((conv) => {
        if (conv.getConversationWith() instanceof CometChat.User) {
          const lastMessage = conv.getLastMessage();
          if (
            isAMessage(lastMessage) &&
            String(lastMessage.getId()) === targetMessageId
          ) {
            return updateReadAt
              ? !lastMessage.getReadAt()
              : !lastMessage.getDeliveredAt();
          }
        }
        return false;
      });
      if (targetIdx > -1) {
        newState = {
          ...state,
          conversationList: conversationList.map((conv, i) => {
            if (i === targetIdx) {
              const newConv = CometChatUIKitUtility.clone(conv);
              const lastMessage = newConv.getLastMessage();
              if (isAMessage(lastMessage)) {
                if (updateReadAt) {
                  lastMessage.setReadAt(messageReceipt?.getReadAt());
                  newConv.setUnreadMessageCount(0);
                } else {
                  lastMessage.setDeliveredAt(messageReceipt?.getDeliveredAt());
                }
              }
              return newConv;
            }
            return conv;
          }),
        };
      }
      break;
    }
    case "addTypingIndicator": {
      // Make sure sender is not the logged-in user before executing this block
      const { typingIndicator } = action;
      const senderId = typingIndicator.getSender()?.getUid();
      const isReceiverTypeGroup =
        typingIndicator.getReceiverType() ===
        CometChatUIKitConstants.MessageReceiverType.group;
      const receiverId = typingIndicator.getReceiverId();
      let id: string | undefined;
      const { conversationList, typingIndicatorMap } = state;
      for (let i = 0; i < conversationList.length; i++) {
        const convWith = conversationList[i].getConversationWith();
        if (isReceiverTypeGroup) {
          if (
            convWith instanceof CometChat.Group &&
            convWith.getGuid() === receiverId
          ) {
            id = convWith.getGuid();
            break;
          }
        } else if (
          convWith instanceof CometChat.User &&
          convWith?.getUid() === senderId
        ) {
          id = convWith?.getUid();
          break;
        }
      }
      if (id !== undefined) {
        const newTypingIndicatorMap = new Map<
          string,
          CometChat.TypingIndicator
        >(typingIndicatorMap);
        newTypingIndicatorMap.set(id, typingIndicator);
        newState = { ...state, typingIndicatorMap: newTypingIndicatorMap };
      }
      break;
    }
    case "removeTypingIndicator": {
      const { typingIndicatorMap } = state;
      const { typingIndicator } = action;
      const senderId = typingIndicator.getSender()?.getUid();
      const receiverId = typingIndicator.getReceiverId();
      let id: string | undefined;
      if (
        typingIndicator.getReceiverType() ===
        CometChatUIKitConstants.MessageReceiverType.user
      ) {
        if (typingIndicatorMap.has(senderId)) {
          id = senderId;
        }
      } else if (
        typingIndicatorMap.get(receiverId)?.getSender()?.getUid() === senderId
      ) {
        id = receiverId;
      }
      if (id !== undefined) {
        const newTypingIndicatorMap = new Map<
          string,
          CometChat.TypingIndicator
        >(typingIndicatorMap);
        newTypingIndicatorMap.delete(id);
        newState = { ...state, typingIndicatorMap: newTypingIndicatorMap };
      }
      break;
    }
    case "updateConversationLastMessage": {
      const { message } = action;
      const targetMessageId = message?.getId();
      const { conversationList } = state;
      const targetIdx = conversationList.findIndex((conv) => {
        const lastMessage = conv.getLastMessage();
        return (
          isAMessage(lastMessage) && lastMessage.getId() === targetMessageId
        );
      });
      if (targetIdx > -1) {
        newState = {
          ...state,
          conversationList: conversationList.map((conv, i) => {
            if (i === targetIdx) {
              const newConv = CometChatUIKitUtility.clone(conv);
              newConv.setLastMessage(message);
              return newConv;
            }
            return conv;
          }),
        };
      }
      break;
    }
    case "updateConversationLastMessageAndGroupAndPlaceAtTheTop": {
      const { conversationList } = state;
      const { group, message } = action;
      const targetConversationId = message.getConversationId();
      if (!ConversationsManager.shouldLastMessageAndUnreadCountBeUpdated(message)) {
        return state;
      }
      const targetIdx = conversationList.findIndex(
        (conv) => conv.getConversationId() === targetConversationId
      );
      if (targetIdx > -1) {
        const newConv = CometChatUIKitUtility.clone(
          conversationList[targetIdx]
        );
        newConv.setConversationWith(group);
        newConv.setLastMessage(message);
        newState = {
          ...state,
          conversationList: [
            newConv,
            ...conversationList.filter((conv, i) => i !== targetIdx),
          ],
        };
      }
      break;
    }
    case "removeConversationOfTheGroup": {
      const { conversationList, typingIndicatorMap } = state;
      const targetGuidId = action.group.getGuid();
      const targetIdx = conversationList.findIndex((conv) => {
        const convWith = conv.getConversationWith();
        return (
          convWith instanceof CometChat.Group &&
          convWith.getGuid() === targetGuidId
        );
      });
      if (targetIdx > -1) {
        const convWith = conversationList[targetIdx].getConversationWith();
        const convWithId =
          convWith instanceof CometChat.User
            ? convWith?.getUid()
            : convWith.getGuid();
        let newTypingIndicatorMap: Map<string, CometChat.TypingIndicator>;
        if (typingIndicatorMap.has(convWithId)) {
          newTypingIndicatorMap = new Map(typingIndicatorMap);
          newTypingIndicatorMap.delete(convWithId);
        } else {
          newTypingIndicatorMap = typingIndicatorMap;
        }
        const newConversationList = conversationList.filter(
          (conv, i) => i !== targetIdx
        );
        newState = {
          ...state,
          conversationList: newConversationList,
          typingIndicatorMap: newTypingIndicatorMap,
        };
      }
      break;
    }
    case "removeConversationOfTheUser": {
      const { conversationList, typingIndicatorMap } = state;
      const targetUid = action.user.getUid();
      const targetIdx = conversationList.findIndex((conv) => {
        const convWith = conv.getConversationWith();
        return (
          convWith instanceof CometChat.User && convWith?.getUid() === targetUid
        );
      });
      if (targetIdx > -1) {
        const convWith = conversationList[targetIdx].getConversationWith();
        const convWithId =
          convWith instanceof CometChat.User
            ? convWith?.getUid()
            : convWith.getGuid();
        let newTypingIndicatorMap: Map<string, CometChat.TypingIndicator>;
        if (typingIndicatorMap.has(convWithId)) {
          newTypingIndicatorMap = new Map(typingIndicatorMap);
          newTypingIndicatorMap.delete(convWithId);
        } else {
          newTypingIndicatorMap = typingIndicatorMap;
        }
        const newConversationList = conversationList.filter(
          (conv, i) => i !== targetIdx
        );
        newState = {
          ...state,
          conversationList: newConversationList,
          typingIndicatorMap: newTypingIndicatorMap,
        };
      }
      break;
    }
    case "updateConversationLastMessageResetUnreadCountAndPlaceAtTheTop": {
      const { conversationList } = state;
      const { message, conversation } = action;
      const targetConvId = message.getConversationId();
      if (!ConversationsManager.shouldLastMessageAndUnreadCountBeUpdated(message)) {
        return state;
      }
      const targetIdx = conversationList.findIndex(
        (conv) => conv.getConversationId() === targetConvId
      );
      if (targetIdx > -1) {
        const targetConversation = CometChatUIKitUtility.clone(
          conversationList[targetIdx]
        );
        targetConversation.setLastMessage(message);
        targetConversation.setUnreadMessageCount(0);
        // targetConversation.setUnreadMentionInMessageCount(0);
        const newConversationList = conversationList.filter(
          (conv, i) => i !== targetIdx
        );
        newState = {
          ...state,
          conversationList: [targetConversation, ...newConversationList],
        };
      } else {
        conversation.setUnreadMessageCount(0);
        // conversation.setUnreadMentionInMessageCount(0);
        const newConversationList = [conversation, ...conversationList];
        newState = { ...state, conversationList: newConversationList };
      }
      break;
    }
    case "resetUnreadCountAndSetReadAtIfLastMessage": {
      const { conversationList } = state;
      const { message } = action;
      const messageReadAt = message.getReadAt() || Date.now();
      const targetIdx = conversationList.findIndex((conv) => {
        return conv.getConversationId() === message.getConversationId();
      });
      if (targetIdx > -1) {
        newState = {
          ...state,
          conversationList: conversationList.map((conv, i) => {
            if (i === targetIdx) {
              const newConv = CometChatUIKitUtility.clone(conv);
              newConv.setUnreadMessageCount(0);
              // newConv.setUnreadMentionInMessageCount(0);
              if (newConv.getLastMessage()) {
                newConv.getLastMessage().setReadAt(messageReadAt);
              }

              return newConv;
            }
            return conv;
          }),
        };
      }
      break;
    }
    case "updateConversationLastMessageAndPlaceAtTheTop": {
      const { message } = action;
      const targetMessageId = message?.getId();
      const { conversationList } = state;

      if (!ConversationsManager.shouldLastMessageAndUnreadCountBeUpdated(message)) {
        return state;
      }
      const targetIdx = conversationList.findIndex((conv) => {
        const lastMessage = conv.getLastMessage();
        return (
          isAMessage(lastMessage) && lastMessage.getId() === targetMessageId
        );
      });
      if (targetIdx > -1) {
        const newConv = CometChatUIKitUtility.clone(
          conversationList[targetIdx]
        );
        newConv.setLastMessage(message);
        newState = {
          ...state,
          conversationList: [
            newConv,
            ...conversationList.filter((conv, i) => i !== targetIdx),
          ],
        };
      }
      break;
    }
    case "setLoggedInUser":
      newState = { ...state, loggedInUser: action.loggedInUser };
      break;
    case "setIsFirstReload":
      newState = { ...state, isFirstReload: action.isFirstReload };
      break;

    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const x: never = type;
    }
  }
  return newState;
}

/**
 * Renders a scrollable list of conversations that has been created in a CometChat app
 */
export function CometChatConversations(props: ConversationsProps) {
  const {
    menu,
    title = localize("CHATS"),
    conversationsRequestBuilder = null,
    onError,
    listItemView = null,
    subtitleView = null,
    tailView,
    disableUsersPresence = false,
    activeConversation = null,
    selectionMode = SelectionMode.none,
    hideReceipt = false,
    options = null,
    datePattern = DatePatterns.DayDateTime,
    loadingStateView,
    emptyStateView,
    errorStateView,
    hideError = false,
    onItemClick = null,
    onSelect = null,
    disableTyping = false,
    confirmDialogTitle = localize("DELETE_CONVERSATION"),
    confirmDialogMessage = localize(
      "WOULD__YOU_LIKE_TO_DELETE_THIS_CONVERSATION"
    ),
    cancelButtonText = localize("CANCEL"),
    confirmButtonText = localize("DELETE"),
    disableMentions = false,
    textFormatters = [],
  } = props;

  const [state, dispatch] = useReducer(stateReducer, {
    conversationList: [],
    fetchState: States.loading,
    typingIndicatorMap: new Map(),
    conversationToBeDeleted: null,
    loggedInUser: null,
    isFirstReload: false,
    unreadMentions: false,
  });
  const [showToast, setShowToast] = useState<boolean>(false);

  const conversationsManagerRef = useRef<ConversationsManager | null>(null);
  const fetchNextIdRef = useRef("");
  const errorHandler = useCometChatErrorHandler(onError);
  const attachListenerOnFetch = useRef<boolean>(false);
  const isConnectionReestablished = useRef<boolean>(false);
  const [activeConversationState, setActiveConversationState] = useState(activeConversation);

  (() => {
    if (state.isFirstReload) {
      attachListenerOnFetch.current = true;
      state.isFirstReload = false;
    }
  })();

  /**
   * Initiates a fetch request and appends the fetched conversations to the `conversationList` state
   *
   * @remarks
   * This function also updates the `fetchState` state
   *
   * @param fetchId - Fetch Id to decide if the fetched data should be appended to the `conversationList` state
   */
  const fetchNextAndAppendConversations = useCallback(
    async (fetchId: string): Promise<void> => {
      const conversationManager = conversationsManagerRef.current;
      if (!conversationManager) {
        return;
      }
      let initialState = isConnectionReestablished.current
        ? States.loaded
        : States.loading;
      dispatch({ type: "setFetchState", fetchState: initialState });
      try {
        const conversations = await conversationManager.fetchNext();

        if (conversations.length !== 0 && fetchNextIdRef.current === fetchId) {
          let removeOldConversation = isConnectionReestablished.current
            ? true
            : false;
          dispatch({
            type: "appendConversations",
            conversations,
            removeOldConversation,
          });
        }
        if (attachListenerOnFetch.current) {
          ConversationsManager.attachConnestionListener(() => {
            conversationsManagerRef.current = new ConversationsManager({
              conversationsRequestBuilder,

            });
            isConnectionReestablished.current = true;
            fetchNextAndAppendConversations(
              (fetchNextIdRef.current =
                "initialFetchNext_" + String(Date.now()))
            );
          });
          attachListenerOnFetch.current = false;
        }
        if (!isConnectionReestablished.current) {
          dispatch({ type: "setFetchState", fetchState: States.loaded });
        } else {
          isConnectionReestablished.current = false;
        }
      } catch (error) {
        if (state.conversationList.length <= 0) {
          dispatch({ type: "setFetchState", fetchState: States.error });
        }
        errorHandler(error);
      }
    },
    [errorHandler, dispatch]
  );

  const getIncrementUnreadCountBoolFromMetaData = useCallback(
    (message: CometChat.BaseMessage) => {
      const metaDataGetterName = "getMetadata";
      const willUpdateConversation = message instanceof CometChat.CustomMessage && message.willUpdateConversation();
      const incrementUnreadCountFieldName = "incrementUnreadCount";
      let metaData: Object;
      return (
        metaDataGetterName in message &&
        typeof message![metaDataGetterName] === "function" &&
        (metaData = message![metaDataGetterName]!()) &&
        typeof metaData === "object" &&
        incrementUnreadCountFieldName in metaData &&
        Boolean(metaData["incrementUnreadCount"])
      ) || (message instanceof CometChat.CustomMessage && message.willUpdateConversation());
    },
    []
  );

  /**
   * Updates the unreadCount of `conversation` & moves it to the top of the `conversationList`
   */
  const updateConversationList = useCallback(
    (
      conversation: CometChat.Conversation,
      newMessage: CometChat.BaseMessage
    ): void => {
      const message = newMessage || conversation.getLastMessage();
      // Exit if conversation type passed in ConversationsRequestBuilder doesn't match the message receiver type.
      if (conversationsRequestBuilder && conversationsRequestBuilder.build().getConversationType() && message.getReceiverType() !== conversationsRequestBuilder.build().getConversationType()) {
        return;
      }

      if (!isAMessage(message)) {
        return;
      }
      if (!ConversationsManager.shouldLastMessageAndUnreadCountBeUpdated(message)) {
        return;
      }
      if(message.getSender().getUid() != state.loggedInUser?.getUid()){
        conversation.setUnreadMessageCount(
          (conversation.getUnreadMessageCount() ?? 0) + 1);
      }

      if (message instanceof CometChat.Action &&
        message.getReceiverType() === CometChatUIKitConstants.MessageReceiverType.group &&
        conversation.getConversationType() === CometChatUIKitConstants.MessageReceiverType.group) {
        const isSameGroup = (message.getReceiver() as CometChat.Group).getGuid() ===
          (message.getActionFor() as CometChat.Group).getGuid();
        if (isSameGroup) {
          let updatedGroup = conversation.getConversationWith() as CometChat.Group;
          updatedGroup.setMembersCount((message.getActionFor() as CometChat.Group).getMembersCount());
          conversation.setConversationWith(updatedGroup);
        }
      }
      conversation.setLastMessage(message);
      dispatch({ type: "fromUpdateConversationListFn", conversation });
    },
    [dispatch, state.loggedInUser, getIncrementUnreadCountBoolFromMetaData]
  );
  /**
 * Function to close toast
 */
  const closeToast = () => {
    setShowToast(false);
  }

  /**
   * Removes or updates the conversation in the `conversationList` state
   */
  const refreshSingleConversation = useCallback(
    async (message: CometChat.BaseMessage, removeConversation: boolean = false): Promise<void> => {

      try {
        const targetIdx = state.conversationList.findIndex((conv) => {
          return conv.getConversationId() === message.getConversationId();
        });
        if (targetIdx >= 0) {
          const conversation = state.conversationList[targetIdx];
          if (removeConversation) {
            dispatch({ type: "removeConversation", conversation: conversation });
          }
          else {
            updateConversationList(conversation, message);
          }
        } else {
          CometChat.CometChatHelper.getConversationFromMessage(message).then(
            (conversation) => {
              updateConversationList(conversation, message);
            }
          );

        }
      } catch (error) {
        errorHandler(error);
      }
    },
    [errorHandler, updateConversationList, state.conversationList]
  );

  /**
   * Handles new received messages
   */
  const onMessageReceived = useCallback(
    async (message: CometChat.BaseMessage): Promise<void> => {
      if (
        message.getSender().getUid() !== state.loggedInUser?.getUid() &&
        !hideReceipt &&
        !message.getDeliveredAt()
      ) {
        try {
          CometChat.markAsDelivered(message);
        } catch (error) {
          errorHandler(error);
        }
      }
      refreshSingleConversation(message);
    },
    [
      hideReceipt,
      refreshSingleConversation,
      errorHandler,
      state.loggedInUser,
      activeConversationState,
      getIncrementUnreadCountBoolFromMetaData,
    ]
  );

  /**
   * Updates `readAt` or `deliveredAt` of a conversation's last message
   */
  const setReceipts = useCallback(
    (messageReceipt: CometChat.MessageReceipt, updateReadAt: boolean): void => {
      dispatch({
        type: "setLastMessageReadOrDeliveredAt",
        updateReadAt,
        messageReceipt,
      });
    },
    [dispatch]
  );

  /**
   * Handles new typing indicators
   */
  const setTypingIndicator = useCallback(
    (
      typingIndicator: CometChat.TypingIndicator,
      typingStarted: boolean
    ): void => {
      if (
        state.loggedInUser?.getUid() === typingIndicator.getSender()?.getUid()
      ) {
        return;
      }
      if (typingStarted) {
        dispatch({ type: "addTypingIndicator", typingIndicator });
      } else {
        dispatch({ type: "removeTypingIndicator", typingIndicator });
      }
    },
    [state.loggedInUser]
  );


  /**
   * Get avatar URL for the default list item view
   */
  function getListItemAvatarURL(conversation: CometChat.Conversation): string {
    const convWith = conversation.getConversationWith();
    return convWith instanceof CometChat.User
      ? convWith.getAvatar()
      : convWith.getIcon();
  }

  /**
   * Creates subtitle thread view
   */
  function getSubtitleThreadView(
    conversation: CometChat.Conversation
  ): JSX.Element | null {
    const lastMessage = conversation.getLastMessage();
    if (!isAMessage(lastMessage) || !lastMessage.getParentMessageId()) {
      // parentMessageId is falsy, it is not a valid parent message id
      return null;
    }
    return (
      <div className='cometchat-conversations__subtitle-icon cometchat-conversations__subtitle-icon-thread' />
    );
  }

  /**
   * Determines if the subtitle receipt should be displayed for a conversation.
   *
   * @param {CometChat.Conversation} conversation - The conversation object for which to check the subtitle receipt.
   * @returns {boolean} - Returns true if the subtitle receipt should be displayed, otherwise false.
   */
  function shouldDisplaySubtitleReceipt(
    conversation: CometChat.Conversation
  ): boolean {
    const lastMessage = conversation.getLastMessage();
    const convWith = conversation.getConversationWith();
    const id =
      convWith instanceof CometChat.User
        ? convWith?.getUid()
        : convWith.getGuid();
    return (
      !hideReceipt &&
      isAMessage(lastMessage) &&
      !lastMessage.getDeletedAt() &&
      lastMessage.getCategory() !==
      CometChatUIKitConstants.MessageCategory.action &&
      lastMessage.getSender()?.getUid() === state.loggedInUser?.getUid() &&
      (lastMessage.getCategory() != CometChatUIKitConstants.MessageCategory.custom || (lastMessage.getCategory() == CometChatUIKitConstants.MessageCategory.custom && 
      lastMessage.getType() !== CometChatUIKitConstants.calls.meeting)) &&
      state.typingIndicatorMap.get(id) === undefined
    );
  }

  /**
   * Creates subtitle receipt view
   */
  function getSubtitleReadReceiptView(
    conversation: CometChat.Conversation
  ): JSX.Element | null {
    const lastMessageCategory = (conversation.getLastMessage() as CometChat.BaseMessage)?.getCategory()

    if (!shouldDisplaySubtitleReceipt(conversation)) {
      return null;
    }

    const receipt = MessageReceiptUtils.getReceiptStatus(conversation.getLastMessage())
    let messageStatus = "";

    if (receipt === receipts.sent) {
      messageStatus = "sent";
    } else if (receipt === receipts.delivered) {
      messageStatus = "delivered";
    } else if (receipt === receipts.read) {
      messageStatus = "read";
    }




    return (
      <div className={`
      cometchat-receipts cometchat-conversations__subtitle-receipts cometchat-conversations__subtitle-receipts-${messageStatus} cometchat-receipts-${messageStatus}`}
      >
      </div>
    );
  }

  /**
   * Creates subtitle text
   */
  function getSubtitleText(
    conversation: CometChat.Conversation
  ): string | JSX.Element {
    const convWith = conversation.getConversationWith();
    const id =
      convWith instanceof CometChat.Group
        ? convWith.getGuid()
        : convWith?.getUid();
    const typingIndicator = state.typingIndicatorMap.get(id);
    if (typingIndicator !== undefined) {
      if (convWith instanceof CometChat.Group) {
        return <div className="cometchat-conversations__subtitle-typing">

          {
            typingIndicator.getSender().getName()
          }
          {": "}
          {
            localize(
              "TYPING"
            )
          }
        </div>;
      } else {

        return <div className="cometchat-conversations__subtitle-typing">{localize("TYPING")}</div>;
      }
    }
    if (state.loggedInUser) {
      let iconName = ""
      const lastMessage = conversation.getLastMessage();
      const isGroupSubtitle = lastMessage && conversation?.getConversationType() != CometChat.RECEIVER_TYPE.USER;
      const isMessageFromLoggedInUser = lastMessage?.getSender().getUid() == state.loggedInUser?.getUid();
      const getLastMessageSenderName = isMessageFromLoggedInUser ? localize("YOU") : lastMessage?.getSender().getName()

      let subtitle =
        ChatConfigurator.getDataSource().getLastConversationMessage(
          conversation,
          state.loggedInUser!,
          {
            disableMentions,
            mentionsTargetElement: MentionsTargetElement.conversation,
            textFormattersList: textFormatters
          }
        );
      if (
        lastMessage &&
        lastMessage.getCategory() ===
        CometChatUIKitConstants.MessageCategory.call
      ) {
        iconName = getIconNameByCallType(lastMessage)

        if (iconName.includes("video")) {
          subtitle = localize("VIDEO_CALL")
        } else {
          subtitle = localize("VOICE_CALL")
        }
      }

      if (lastMessage &&
        lastMessage.getCategory() !==
        CometChatUIKitConstants.MessageCategory.call &&
        lastMessage.getType()
      ) {
        iconName = getIconNameByMessageType(lastMessage);
      }

      if (lastMessage?.getDeletedAt()) {
        subtitle = localize("MESSAGE_IS_DELETED");
      }

      return (
        <div
          className="cometchat-conversations__subtitle-text-wrapper"
        >
          {isGroupSubtitle &&
            lastMessage.getCategory() != CometChatUIKitConstants.MessageCategory.action &&
            (lastMessage.getCategory() == CometChatUIKitConstants.MessageCategory.custom && lastMessage.getType() !== CometChatUIKitConstants.calls.meeting) && <span className={`cometchat-conversations__subtitle-text-sender`}>{getLastMessageSenderName}:</span>}
          <div
            className={`cometchat-conversations__subtitle-icon ${iconName ? `cometchat-conversations__subtitle-icon-${iconName}` : "cometchat-conversations__subtitle-icon-none"}`}
          />
          <div
            className={`cometchat-conversations__subtitle-text`}
            dangerouslySetInnerHTML={{ __html: subtitle }}
          >

          </div>
        </div>
      );
    }
    return "";
  }

  /**
   * Determines the icon class name based on the type of a call message.
   * 
   * This function checks whether the call was missed and assigns an icon accordingly.
   * @param {CometChat.Call} message - The call message object containing details about the call.
   * @returns {string} The name of the icon to be used based on the call type.
   */
  function getIconNameByCallType(message: CometChat.Call): string {

    let iconName = ""
    let isMissedCallMessage = isMissedCall(message as CometChat.Call, state.loggedInUser!);

    if (isMissedCallMessage) {
      if (message.getType() === CometChatUIKitConstants.MessageTypes.audio) {
        iconName = "incoming-audio-call"
      } else {
        iconName = "incoming-video-call"
      }
    } else {
      if (message.getType() === CometChatUIKitConstants.MessageTypes.audio) {
        iconName = "outgoing-audio-call"
      } else {
        iconName = "outgoing-video-call"
      }
    }

    return iconName
  }


  /**
   * Determines the icon class name based on the type of the message.
   * For text messages, it checks if the message is a URL (starting with http, https, or www)
   * and assigns the "link" icon. For other text messages, it assigns the "text" icon.
   *
   * @param {CometChat.BaseMessage} message - The message object containing information like type and content.
   * @returns {string} The name of the icon to be used based on the message type.
   */
  function getIconNameByMessageType(message: CometChat.BaseMessage): string {
    let iconName = "";
    switch (message.getType()) {

      case CometChatUIKitConstants.MessageTypes.text:
        const messageText = (message as CometChat.TextMessage).getText();
        if (isURL(messageText)) {
          iconName = "link";
        }
        break;
      case CometChatUIKitConstants.MessageTypes.image:
        iconName = "image";
        break;
      case CometChatUIKitConstants.MessageTypes.file:
        iconName = "file";
        break;
      case CometChatUIKitConstants.MessageTypes.video:
        iconName = "video";
        break;
      case CometChatUIKitConstants.MessageTypes.audio:
        iconName = "audio";
        break;
      case PollsConstants.extension_poll:
        iconName = "poll";
        break;
      case StickersConstants.sticker:
        iconName = "sticker";
        break;
      case CollaborativeWhiteboardConstants.extension_whiteboard:
        iconName = "collaborative-whiteboard";
        break;
      case CollaborativeDocumentConstants.extension_document:
        iconName = "collaborative-document";
        break;
      default:
        iconName = "";
        break;
    }
    if (message.getDeletedAt()) {
      iconName = "deleted";
    }
    return iconName
  }

  /**
   * Creates subtitle text view
   */
  function getSubtitleTextView(
    conversation: CometChat.Conversation
  ): JSX.Element {
    return (
      <>
        {getSubtitleText(conversation)}
      </>
    );
  }

  /**
   * Creates subtitle view for the default list item view
   */
  function getListItemSubtitleView(
    conversation: CometChat.Conversation
  ): JSX.Element {

    const convWith = conversation.getConversationWith();
    const id =
      convWith instanceof CometChat.Group
        ? convWith.getGuid()
        : convWith?.getUid();
    const typingIndicator = state.typingIndicatorMap.get(id);

    if (subtitleView !== null) {
      return <>{subtitleView(conversation)}</>;
    }
    return (
      <div
        className='cometchat-conversations__subtitle'
      >
        {!typingIndicator && getSubtitleThreadView(conversation)}
        {getSubtitleReadReceiptView(conversation)}
        {getSubtitleTextView(conversation)}
      </div>
    );
  }

  /**
   * Sets the `conversationToBeDeleted` state to the given `conversation`
   */
  function deleteOptionCallback(conversation: CometChat.Conversation): void {
    dispatch({ type: "setConversationToBeDeleted", conversation });
  }

  /**
   * Creates menu view for the default list item view
   *
   * @remarks
   * This menu view is shown on mouse over the default list item view.
   * The visibility of view is handled by the default list item view
   */
  function getListItemMenuView(
    conversation: CometChat.Conversation,
  ) {
    if (selectionMode !== SelectionMode.none) {
      return null;
    }
    let curOptions: CometChatOption[] | null;
    if (!options) {
      const defaultOptions = ConversationUtils.getDefaultOptions();
      for (let i = 0; i < defaultOptions.length; i++) {
        if (
          defaultOptions[i].id ===
          CometChatUIKitConstants.ConversationOptions.delete
        ) {
          defaultOptions[i].onClick = () => deleteOptionCallback(conversation);
        }
      }
      curOptions = defaultOptions;
    } else {
      curOptions = options?.(conversation);
    }
    if (curOptions?.length === 0) {
      return null;
    }
    return (
      <div className="cometchat-conversations__tail-view-options">
        <CometChatContextMenu
          data={curOptions as unknown as CometChatActionsIcon[]}
          topMenuSize={2}
          placement={Placement.left}
          onOptionClicked={() => {
            curOptions && curOptions.forEach((option: CometChatOption) => {
              if (option) {
                if (option.id) {
                  option.onClick?.(parseInt(String(option.id)));
                }
              }
            });
          }}
        />
      </div>
    );
  }

  /**
   * Creates tail content view for the default list item view
   */
  function getListItemTailContentView(
    conversation: CometChat.Conversation
  ): JSX.Element | null {


    if (tailView) {
      return <>{tailView(conversation)}</>
    }

    switch (selectionMode) {
      case SelectionMode.none: {
        const lastMessage = conversation.getLastMessage();
        if (!lastMessage) {
          return null;
        }
        return (
          <div
            className='cometchat-conversations__tail-view'
          >
            <div className="cometchat-conversations__tail-view-date">
              <CometChatDate timestamp={lastMessage.getSentAt()} pattern={datePattern} />
            </div>
            <div
              className="cometchat-conversations__tail-view-badge"
            >
              {conversation.getUnreadMessageCount() > 0 && <div className="cometchat-badge cometchat-conversations__tail-view-badge-count">
                {conversation.getUnreadMessageCount() <= 999 ? conversation.getUnreadMessageCount() : `999+`}
              </div>
              }
            </div>
          </div>
        );
      }
      case SelectionMode.single:
        return (
          <div className='cometchat-conversations__single-select'>
            <CometChatRadioButton
              onRadioButtonChanged={(e) => onSelect?.(conversation, e.checked)}
            />
          </div>
        );
      case SelectionMode.multiple:
        return (
          <div className='cometchat-conversations__multiple-select'>
            <CometChatCheckbox
              onCheckBoxValueChanged={(e) => onSelect?.(conversation, e.checked)}
            />
          </div>
        );
      default:
        return null;
    }
  }

  /**
   * Creates `listItem` prop of the `CometChatList` component
   */
  function getListItem(): (
    conversation: CometChat.Conversation
  ) => JSX.Element {
    if (listItemView !== null) {
      return listItemView;
    }
    return function (conversation: CometChat.Conversation) {


      const isActive = conversation.getConversationId() === activeConversationState?.getConversationId();
      let conversationType = conversation.getConversationType();
      let groupType;
      let status

      if (conversationType === CometChatUIKitConstants.MessageReceiverType.group) {
        groupType = (conversation.getConversationWith() as CometChat.Group).getType()
      };

      if (conversationType === CometChatUIKitConstants.MessageReceiverType.user) {
        status = (conversation.getConversationWith() as CometChat.User).getStatus()
      };

      return (
        <div className={`cometchat-conversations__list-item
          ${groupType ? `cometchat-conversations__list-item-${groupType}` : ""}
           ${status && !disableUsersPresence ? `cometchat-conversations__list-item-${status}` : ""}
           ${isActive ? `cometchat-conversations__list-item-active` : ""}
        
        ` }>
          <CometChatListItem
            id={conversation.getConversationId()}
            avatarURL={getListItemAvatarURL(conversation)}
            avatarName={conversation.getConversationWith().getName()}
            title={conversation.getConversationWith().getName()}
            onListItemClicked={(e) => onItemClick?.(conversation)}
            subtitleView={getListItemSubtitleView(conversation)}
            menuView={getListItemMenuView(conversation)}
            tailView={getListItemTailContentView(conversation)}
          />
        </div>
      );
    };
  }

  function handleConfirmClick(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (state.conversationToBeDeleted) {
        const convWith = state.conversationToBeDeleted.getConversationWith();
        const id = convWith instanceof CometChat.Group ? convWith.getGuid() : convWith.getUid();
        try {
          await CometChat.deleteConversation(id, state.conversationToBeDeleted.getConversationType());
          setShowToast(true)
          CometChatConversationEvents.ccConversationDeleted.next(CometChatUIKitUtility.clone(state.conversationToBeDeleted));
          dispatch({ type: "removeConversation", conversation: state.conversationToBeDeleted });
          dispatch({ type: "setConversationToBeDeleted", conversation: null });
          return resolve();

        }
        catch (error) {
          errorHandler(error);
          return reject();
        }
      }
    })
  }
  function handleCancelClick() {
    dispatch({ type: "setConversationToBeDeleted", conversation: null });
  }

  /**
   * Creates conversation delete view
   */
  function getConversationDeleteView(): JSX.Element | null {
    if (state.conversationToBeDeleted === null) {
      return null;
    }
    return (
      <div
        className="cometchat-backdrop cometchat-conversations__tail-view-options-delete-backdrop"
      >
        <CometChatConfirmDialog
          title={confirmDialogTitle}
          messageText={confirmDialogMessage}
          cancelButtonText={cancelButtonText}
          confirmButtonText={confirmButtonText}
          onSubmitClick={handleConfirmClick}
          onCancelClick={handleCancelClick}
        />
      </div>
    );
  }


  /**
   * Renders the loading state view with shimmer effect
   *
   * @remarks
   * If a custom `loadingStateView` is provided, it will be used. Otherwise, the default shimmer effect is displayed.
   *
   * @returns A JSX element representing the loading state
   */
  const getLoadingView = () => {
    if (loadingStateView) {
      return loadingStateView;
    }
    return (
      <div className='cometchat-conversations__shimmer'>
        {[...Array(15)].map((_, index) => (
          <div key={index} className='cometchat-conversations__shimmer-item'>
            <div className='cometchat-conversations__shimmer-item-avatar'></div>
            <div className='cometchat-conversations__shimmer-item-body'>
              <div className='cometchat-conversations__shimmer-item-body-title-wrapper'>
                <div className='cometchat-conversations__shimmer-item-body-title'></div>
                <div className='cometchat-conversations__shimmer-item-body-tail'></div>
              </div>

              <div className='cometchat-conversations__shimmer-item-body-subtitle'></div>
            </div>

          </div>
        ))}
      </div>
    );
  };

  /**
   * Renders the empty state view when there are no call-logs to display
   *
   * @remarks
   * If a custom `emptyStateView` is provided, it will be used. Otherwise, a default empty state view with a message is displayed.
   *
   * @returns A JSX element representing the empty state
   */
  const getEmptyStateView = () => {
    const isDarkMode = getThemeMode() == "dark" ? true : false;
    if (emptyStateView) {
      return emptyStateView;
    }
    return (
      <div className='cometchat-conversations__empty-state-view'>
        <div
          className='cometchat-conversations__empty-state-view-icon'
        >
          <img src={isDarkMode ? emptyIconDark : emptyIcon} alt="" />
        </div>
        <div className='cometchat-conversations__empty-state-view-body'>
          <div className='cometchat-conversations__empty-state-view-body-title'>
            {localize("NO_CONVERSATIONS")}
          </div>
          <div className='cometchat-conversations__empty-state-view-body-description'>
            {localize("CONVERSATIONS_EMPTY_MESSAGE")}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders the error state view when an error occurs
   *
   * @remarks
   * If a custom `errorStateView` is provided, it will be used. Otherwise, a default error message is displayed.
   *
   * @returns A JSX element representing the error state
   */
  const getErrorStateView = () => {
    const isDarkMode = getThemeMode() == "dark" ? true : false;

    if (errorStateView) {
      return errorStateView;
    }

    return (
      <div className='cometchat-conversations__error-state-view'>
        <div className='cometchat-conversations__error-state-view-icon'>
          <img src={isDarkMode ? errorIconDark : errorIcon} alt="" />
        </div>
        <div className='cometchat-conversations__error-state-view-body'>
          <div className='cometchat-conversations__error-state-view-body-title'>
            {localize("OOPS!")}
          </div>
          <div className='cometchat-conversations__error-state-view-body-description'>
            {localize("LOOKS_LIKE_SOMETHING_WENT_WRONG")}
          </div>
        </div>
      </div>
    );
  };


  useCometChatConversations({
    conversationsRequestBuilder,
    conversationsManagerRef,
    fetchNextAndAppendConversations,
    fetchNextIdRef,
    dispatch,
    conversationToBeDeleted: state.conversationToBeDeleted,
    errorHandler,
    refreshSingleConversation,
    onMessageReceived,
    setReceipts,
    setTypingIndicator,
    disableTyping,
    loggedInUser: state.loggedInUser,
    isFirstReload: false,
    disableUsersPresence,
    activeConversation,
    setActiveConversationState
  });

  return (
    <div className="cometchat" style={{ width: "100%", height: "100%" }}>
      <div
        className='cometchat-conversations'
      >
        <CometChatList
          title={title}
          hideSearch={true}
          list={state.conversationList}
          listItemKey='getConversationId'
          listItem={getListItem()}
          onScrolledToBottom={() =>
            fetchNextAndAppendConversations(
              (fetchNextIdRef.current =
                "onScrolledToBottom_" + String(Date.now()))
            )
          }
          showSectionHeader={false}
          state={
            state.fetchState === States.loaded &&
              state.conversationList.length === 0
              ? States.empty
              : state.fetchState
          }
          loadingView={getLoadingView()}
          emptyStateView={getEmptyStateView()}
          errorStateView={getErrorStateView()}
          hideError={hideError}
          menu={menu}
        />
        {getConversationDeleteView()}
        {showToast ? <CometChatToast text={localize("CONVERSATION_DELETED")} onClose={closeToast} /> : null}
      </div>
    </div>
  );
}
