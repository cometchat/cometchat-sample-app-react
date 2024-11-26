import { isMissedCall, isSentByMe, verifyCallUser } from "../Utils/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatList } from "../../BaseComponents/CometChatList/CometChatList";
import { CometChatListItem } from "../../BaseComponents/CometChatListItem/CometChatListItem";
import { useCometChatCallLogs } from "./useCometChatCallLogs";
import {
  CallWorkflow,
  DatePatterns,
  MessageStatus,
  States,
} from "../../../Enums/Enums";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";
import { CometChatUIKitCalls } from "../../../CometChatUIKit/CometChatCalls";
import { CometChatDate } from "../../BaseComponents/CometChatDate/CometChatDate";
import { CometChatUIKitConstants } from "../../../constants/CometChatUIKitConstants";
import { CometChatOutgoingCall } from "../CometChatOutgoingCall/CometChatOutgoingCall";
import { CometChatOngoingCall } from "../CometChatOngoingCall/CometChatOngoingCall";
import { CometChatMessageEvents } from "../../../events/CometChatMessageEvents";
import { CometChatCallEvents } from "../../../events/CometChatCallEvents";
import emptyIcon from "../../../assets/call-logs_empty_state.svg";
import emptyIconDark from "../../../assets/call-logs_empty_state_dark.svg";
import errorIcon from "../../../assets/list_error_state_icon.svg"
import errorIconDark from "../../../assets/list_error_state_icon_dark.svg"
import { getThemeMode } from "../../../utils/util";

interface CallLogsProps {
  /**
   * Title of the component
   *
   * @defaultValue `localize("CALLS")`
   */
  title?: string;

  /**
   * Custom list item view to be rendered for each user in the fetched list
   */
  listItemView?: (call: any) => JSX.Element;

  /**
   * Custom subtitle view to be rendered for each user in the fetched list
   *
   * @remarks
   * This prop is used if `listItemView` prop is not provided
   */
  subtitleView?: (call: any) => JSX.Element;

  /**
   * View to be placed in the tail view
   *
   * @remarks
   * This prop will be used if `listItemView` is not provided
   */
  tailView?: (call: any) => JSX.Element;

  /**
   * Custom view for the empty state of the component
   */
  emptyStateView?: JSX.Element;

  /**
   * Custom view for the error state of the component
   */
  errorStateView?: JSX.Element;

  /**
   * Custom view for the loading state of the component
   */
  loadingStateView?: JSX.Element;

  /**
   * Object representing the active call that is currently selected.
   *
   */
  activeCall?: any;

  /**
   * Allows filtering and customizing call logs using available parameters
   *  @defaultValue Default request builder having the limit set to 30
   */
  callLogRequestBuilder?: any;

  /**
   * Function to call on click of the default list item view of a user
   */
  onItemClick?: Function;

  /**
   * Function to call on click of the tail view of a user
   */
  onCallButtonClicked?: Function;

  /**
   * Function to call whenever the component encounters an error
   */
  onError?: Function;

  /**
   * Date format for the date component
   *
   * @remarks
   * The date component is inside the tail view of the default list item view when `selectionMode` prop is set to `SelectionMode.none`
   */
  datePattern?: DatePatterns;
}

const defaultProps: CallLogsProps = {
  listItemView: undefined,
  subtitleView: undefined,
  tailView: undefined,
  emptyStateView: undefined,
  errorStateView: undefined,
  loadingStateView: undefined,
  callLogRequestBuilder: undefined,
  onItemClick: undefined,
  onCallButtonClicked: undefined,
  onError: (error: CometChat.CometChatException) => {
    console.log(error);
  },
  activeCall: undefined,
  datePattern: DatePatterns.time,
};

const CometChatCallLogs = (props: CallLogsProps) => {
  const {
    title = localize("CALLS"),
    listItemView,
    subtitleView,
    tailView,
    errorStateView,
    emptyStateView,
    loadingStateView,
    activeCall,
    callLogRequestBuilder,
    onItemClick,
    onCallButtonClicked,
    onError,
    datePattern,
  } = { ...defaultProps, ...props, };

  const [callList, setCallList] = useState<any[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
  const [callListState, setCallListState] = useState(States.loading);

  const [showOutgoingCallScreen, setShowOutgoingCallScreen] = useState(false);
  const [callInitiated, setCallInitiated] = useState<
    CometChat.Call | undefined
  >(undefined);
  const [call, setCall] = useState<CometChat.Call | undefined>(undefined);
  const [sessionId, setSessionId] = useState(null);
  const [showOngoingCall, setShowOngoingCall] = useState(false);

  const listenerId = "callLogsScreen_" + new Date().getTime();
  const requestBuilder = useRef<any>(null);

  const initiatedCallRef = useRef<CometChat.Call | undefined>(undefined);
  initiatedCallRef.current = callInitiated;

  /**
   * Handles call-related errors by creating and throwing a CometChatException.
   *
   * @param error - Error object thrown during the call.
   */
  const onErrorCallback = useCallback(
    (error: any) => {
      if (!(error instanceof CometChat.CometChatException)) {
        let errorModel = {
          code: error?.code,
          name: error?.name,
          message: error?.message,
          details: error?.details,
        };
        let errorObj = new CometChat.CometChatException(errorModel);
        onError?.(errorObj);
      } else {
        onError?.(error);
      }
    },
    [onError]
  );

  /**
   * Sets up the CallLogRequestBuilder or creates a new one if not provided.
   */
  const setCallLogRequestBuilder = useCallback((): any => {
    try {
      if (callLogRequestBuilder) {
        return callLogRequestBuilder.build();
      } else {
        const authToken = loggedInUser!.getAuthToken();
        return new CometChatUIKitCalls.CallLogRequestBuilder()
          .setLimit(30)
          .setCallCategory("call")
          .setAuthToken(authToken)
          .build();
      }
    } catch (e) {
      onErrorCallback(e);
    }
  }, [callLogRequestBuilder, loggedInUser, onErrorCallback]);

  /**
   * Fetches the next set of call logs using the request builder.
   *
   * @returns A list of fetched call logs.
   */
  const fetchNextCallList = useCallback(async (): Promise<any[]> => {
    try {
      const calls = await requestBuilder?.current?.fetchNext();
      return calls;
    } catch (e) {
      onErrorCallback(e);
      throw e;
    }
  }, [requestBuilder, onErrorCallback]);

  /**
   * Fetches and updates the call list.
   */
  const getCallList = useCallback(async () => {
    try {
      const calls = await fetchNextCallList();
      if (calls && calls.length) {
        setCallList((prevCallList) => {
          return [...prevCallList, ...calls];
        });
        setCallListState(States.loaded);
      } else {
        if (callList.length === 0) {
          setCallListState(States.empty);
        }
      }
    } catch (e) {
      if (callList.length === 0) {
        setCallListState(States.error);
      }
      onErrorCallback(e);
    }
  }, [
    fetchNextCallList,
    callList,
    setCallList,
    setCallListState,
    onErrorCallback,
  ]);

  /**
   * Cancels an outgoing call and sends a rejection request to the server.
   */
  const cancelOutgoingCall = useCallback(() => {
    CometChat.rejectCall(
      call?.getSessionId()!,
      CometChatUIKitConstants.calls.cancelled
    )
      .then(() => {
        setCall(undefined);
        setShowOutgoingCallScreen(false);
        CometChatMessageEvents.ccMessageSent.next({
          message: call!,
          status: MessageStatus.success,
        });
      })
      .catch((error: CometChat.CometChatException) => {
        setShowOutgoingCallScreen(false);
        onErrorCallback(error);
      });
  }, [call, setCall, setShowOutgoingCallScreen, onErrorCallback]);

  /**
   * Initiates a new call of a specified type (audio or video) to the given user.
   *
   * @param type - The type of call (audio or video).
   * @param uid - The user ID of the call receiver.
   */
  const initiateCall = useCallback(
    (type: string, uid: string) => {
      const receiverType: string =
        CometChatUIKitConstants.MessageReceiverType.user;
      const receiverId: string = uid;
      let callType: string = "";
      if (type === CometChat.CALL_TYPE.VIDEO) {
        callType = CometChat.CALL_TYPE.VIDEO;
      } else {
        callType = CometChat.CALL_TYPE.AUDIO;
      }
      const callTmp: CometChat.Call = new CometChat.Call(
        receiverId,
        callType,
        receiverType
      );
      CometChat.initiateCall(callTmp)
        .then((outgoingCall: CometChat.Call) => {
          setCallInitiated(outgoingCall);
          setCall(outgoingCall);
          setShowOutgoingCallScreen(true);
          CometChatMessageEvents.ccMessageSent.next({
            message: outgoingCall,
            status: MessageStatus.inprogress,
          });
        })
        .catch((error: CometChat.CometChatException) => {
          onErrorCallback(error);
        });
    },
    [setCall, setShowOutgoingCallScreen, onErrorCallback, setCallInitiated]
  );

  /**
   * Handles click events on a call item and either invokes `onItemClick` or initiates a call.
   *
   * @param call - The selected call item.
   */
  const handleItemClick = useCallback(
    (call: any) => {
      try {
        if (onItemClick) {
          onItemClick(call);
        }
      } catch (e) {
        onErrorCallback(e);
      }
    },
    [onItemClick, onErrorCallback]
  );

  /**
   * Handles click events on the info icon of a call item and either invokes `onCallButtonClicked` or initiates a call.
   *
   * @param call - The selected call item.
   */
  const handleInfoClick = useCallback(
    (call: any) => {
      try {
        if (onCallButtonClicked) {
          onCallButtonClicked(call);
        } else {
          const entity = verifyCallUser(call, loggedInUser!);
          if (entity.uid) {
            initiateCall(call?.type, entity.uid);
          }
        }
      } catch (e) {
        onErrorCallback(e);
      }
    },
    [onCallButtonClicked, onErrorCallback, loggedInUser, initiateCall]
  );

  /**
   * Determines if the provided call matches the active call.
   *
   * @param call - The call to check.
   * @returns Whether the call matches the active call.
   */
  const getActiveCall = useCallback(
    (call: any) => {
      try {
        if (activeCall) {
          if (activeCall.getSessionID() === call.getSessionID()) {
            return true;
          }
        }
        return false;
      } catch (e) {
        onErrorCallback(e);
        return false;
      }
    },
    [activeCall, onErrorCallback]
  );

  /**
   * Opens the ongoing call screen for the provided call object.
   *
   * @param callObj - The ongoing call object.
   */
  const openOngoingCallScreen = useCallback(
    (callObj: any) => {
      setShowOutgoingCallScreen(false);
      setCall(callObj);
      setSessionId(callObj?.getSessionId());
      setShowOngoingCall(true);
    },
    [setShowOutgoingCallScreen, setCall, setSessionId, setShowOngoingCall]
  );

  /**
   * Attaches call listeners for handling outgoing call events.
   */
  const attachListeners = useCallback(() => {
    try {
      CometChat.addCallListener(
        listenerId,
        new CometChat.CallListener({
          onOutgoingCallRejected: (callObj: CometChat.Call) => {
            if (
              initiatedCallRef.current &&
              callObj.getSessionId() == initiatedCallRef.current.getSessionId()
            ) {
              setCall(undefined);
              setShowOutgoingCallScreen(false);
              setShowOngoingCall(false);
              setCallInitiated(undefined);
            }
          },
          onOutgoingCallAccepted: (callObj: CometChat.Call) => {
            if (
              initiatedCallRef.current &&
              callObj.getSessionId() == initiatedCallRef.current.getSessionId()
            ) {
              setCall(undefined);
              openOngoingCallScreen(callObj);
              setShowOutgoingCallScreen(false);
              setCallInitiated(undefined);
            }
          },
        })
      );
    } catch (e) {
      onErrorCallback(e);
    }
  }, [listenerId, openOngoingCallScreen, onErrorCallback]);

  /**
   * Closes the ongoing call screen by resetting the session and call-related states.
   *
   * @callback closeCallScreen
   * @returns {void}
   */
  const closeCallScreen = useCallback(() => {
    setShowOngoingCall(false);
    setSessionId(null);
    setCall(undefined);
  }, [setShowOngoingCall, setSessionId, setCall]);

  /**
   * Subscribes to call-related events. If a call ends, it triggers the closing of the call screen.
   *
   * @callback subscribeToEvents
   * @returns {void}
   */
  const subscribeToEvents = useCallback(() => {
    try {
      const ccCallEnded = CometChatCallEvents.ccCallEnded.subscribe(
        () => {
          closeCallScreen();
        }
      );

      return () => {
        try {
          ccCallEnded?.unsubscribe();
        } catch (error: any) {
          onErrorCallback(error);
        }
      }
    } catch (e) {
      onErrorCallback(e);
    }
  }, [closeCallScreen, onErrorCallback])

  /**
   * Detaches the call listeners by removing the call listener with the provided listener ID.
   *
   * @callback detachListeners
   * @returns {void}
   */
  const detachListeners = useCallback(() => {
    try {
      CometChat.removeCallListener(listenerId);
    } catch (e) {
      onErrorCallback(e);
    }
  }, [listenerId, onErrorCallback]);

  /**
   * Creates a subtitle view for the default list item view
   */
  const getListItemSubtitleView = useCallback(
    (item: any): JSX.Element => {
      const missedCall = isMissedCall(item, loggedInUser!);
      const isCallSentByMe = isSentByMe(item,loggedInUser!)

      if (subtitleView) {
        return <>{subtitleView(item)}</>;
      }

    const iconClass = missedCall
    ? "cometchat-call-logs__list-item-subtitle-icon-missed-call"
    : isCallSentByMe
    ? "cometchat-call-logs__list-item-subtitle-icon-outgoing-call"
    : "cometchat-call-logs__list-item-subtitle-icon-incoming-call";

      return (
        <>
          <div className={`cometchat-call-logs__list-item-subtitle`}>
            <div
              className={`cometchat-call-logs__list-item-subtitle-icon ${iconClass}`}
            />
            <div className="cometchat-call-logs__list-item-subtitle-text">
              {" "}
              <CometChatDate
                timestamp={item.initiatedAt}
                pattern={DatePatterns.DateTime}
              />
            </div>
          </div>
        </>
      );
    },
    [subtitleView, loggedInUser]
  );

  /**
   * Creates a tail view for the default list item view
   */
  const getListItemTailView = useCallback(
    (item: any): JSX.Element => {
      const callType = item.type;
      if (tailView) {
        return <>{tailView(item)}</>;
      }
      return (
        <div
          className={`cometchat-call-logs__list-item-tail
          ${callType===CometChat.CALL_TYPE.VIDEO ? "cometchat-call-logs__list-item-tail-video" : "cometchat-call-logs__list-item-tail-audio"}`}
          onClick={() => handleInfoClick?.(item)}
        />
      );
    },
    [tailView, datePattern, onCallButtonClicked, handleInfoClick]
  );

  /**
   * Creates `listItem` prop of the `CometChatList` component
   */
  const getListItem = useMemo(() => {
    return function (item: any, index: number): any {

      const isActive = activeCall?.getSessionID() ===item?.getSessionID() 

      if (listItemView) {
        return listItemView(item);
      } else {
        return (
<div className={`cometchat-call-logs__list-item ${isActive ? "cometchat-call-logs__list-item-active" : ""}`} key={String(index)}>
            <CometChatListItem
              title={verifyCallUser(item, loggedInUser!)?.getName()}
              avatarURL={
                verifyCallUser(item, loggedInUser!)?.avatar ||
                verifyCallUser(item, loggedInUser!)?.icon
              }
              avatarName={verifyCallUser(item, loggedInUser!)?.getName()}
              onListItemClicked={(e) => onItemClick && onItemClick?.(item)}
              subtitleView={getListItemSubtitleView(item)}
              tailView={getListItemTailView(item)}
            />
          </div>
        );
      }
    };
  }, [
    listItemView,
    loggedInUser,
    getActiveCall,
    getListItemSubtitleView,
    getListItemTailView,
    handleItemClick,
  ]);

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
      <div className='cometchat-call-logs__shimmer'>
        {[...Array(15)].map((_, index) => (
          <div key={index} className='cometchat-call-logs__shimmer-item'>
            <div className='cometchat-call-logs__shimmer-item-avatar'></div>
            <div className='cometchat-call-logs__shimmer-item-body'>
              <div className='cometchat-call-logs__shimmer-item-body-title-wrapper'>
                <div className='cometchat-call-logs__shimmer-item-body-title'></div>
                <div className='cometchat-call-logs__shimmer-item-body-subtitle'></div>
              </div>

              <div className='cometchat-call-logs__shimmer-item-body-tail'></div>
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
      <div className='cometchat-call-logs__empty-state-view'>
        <div className='cometchat-call-logs__empty-state-view-icon'>
        <img src={isDarkMode ? emptyIconDark : emptyIcon} alt="" />
        </div>
        <div className='cometchat-call-logs__empty-state-view-body'>
          <div className='cometchat-call-logs__empty-state-view-body-title'>
            {localize("NO_CALL_LOGS")}
          </div>
          <div className='cometchat-call-logs__empty-state-view-body-description'>
            {localize("CALL_LOGS_EMPTY_MESSAGE")}
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
      <div className='cometchat-call-logs__error-state-view'>
        <div className='cometchat-call-logs__error-state-view-icon'>
          <img src={isDarkMode ? errorIconDark : errorIcon} alt="" />
        </div>
        <div className='cometchat-call-logs__error-state-view-body'>
          <div className='cometchat-call-logs__error-state-view-body-title'>
            {localize("OOPS!")}
          </div>
          <div className='cometchat-call-logs__error-state-view-body-description'>
            {localize("LOOKS_LIKE_SOMETHING_WENT_WRONG")}
          </div>
        </div>
      </div>
    );
  };

  useCometChatCallLogs(
    loggedInUser,
    setLoggedInUser,
    requestBuilder,
    setCallLogRequestBuilder,
    getCallList,
    attachListeners,
    subscribeToEvents,
    detachListeners,
    onErrorCallback
  );

    /* This function updates and returns the call builder with required configs and listeners attached. */
    function getCallBuilder(): typeof CometChatUIKitCalls.CallSettings {
      let audioOnlyCall: boolean =
       call?.getType() === CometChatUIKitConstants.MessageTypes.audio
          ? true
          : false
      let callsBuilder =  new CometChatUIKitCalls.CallSettingsBuilder()
        .enableDefaultLayout(true)
        .setIsAudioOnlyCall(audioOnlyCall);
  
      const sessionID = sessionId;
      callsBuilder.setCallListener(
        new CometChatUIKitCalls.OngoingCallListener({
          onCallEnded: () => {
              CometChatUIKitCalls.endSession();
              CometChatCallEvents.ccCallEnded.next(null as any);
              closeCallScreen();
          },
          onCallEndButtonPressed: () => {
              CometChat.endCall(sessionID!)
                .then((call: CometChat.Call) => {
                  CometChatUIKitCalls.endSession();
                  CometChatCallEvents.ccCallEnded.next(call);
                  closeCallScreen()
                })
                .catch((err: CometChat.CometChatException) => {
                  onErrorCallback(err);
                });
          },
          onError: (error: unknown) => {
            onErrorCallback(error);
          },
        })
      );
      return callsBuilder;
  
    }
  

  return (
    <div className='cometchat' style={{ width: "100%", height: "100%" }}>
      <div className='cometchat-call-logs'>
        {showOutgoingCallScreen ? (
          <div className='cometchat-call-logs__outgoing-call'>
            <CometChatOutgoingCall
              call={call!}
              onCloseClicked={cancelOutgoingCall}
            />
          </div>
        ) : null}

        {showOngoingCall && !activeCall ? (
          <div className='cometchat-call-logs__ongoing-call'>
            <CometChatOngoingCall
              sessionID={sessionId!}
              callWorkflow={CallWorkflow.defaultCalling}
              callSettingsBuilder={getCallBuilder()}
            />
          </div>

        ) : null}

        <CometChatList
          hideSearch={true}
          list={callList}
          onScrolledToBottom={getCallList}
          listItemKey='getSessionID'
          listItem={getListItem}
          title={title}
          emptyStateView={getEmptyStateView()}
          errorStateView={getErrorStateView()}
          loadingView={getLoadingView()}
          state={callListState}
          showSectionHeader={false}
        />
      </div>
    </div>
  );
};

export { CometChatCallLogs };
