import { useCallback, useRef, useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatOutgoingCall } from "../CometChatOutgoingCall/CometChatOutgoingCall";
import { CometChatOngoingCall } from "../CometChatOngoingCall/CometChatOngoingCall";
import { useCallButtons } from "./useCallButtons";
import { useRefSync } from "../../../CometChatCustomHooks";
import { CometChatUIKitCalls } from "../../../CometChatUIKit/CometChatCalls";
import { CometChatSoundManager } from "../../../resources/CometChatSoundManager/CometChatSoundManager";
import { CometChatUIKitUtility } from "../../../CometChatUIKit/CometChatUIKitUtility";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";
import { CometChatUIKitConstants } from "../../../constants/CometChatUIKitConstants";
import { MessageStatus } from "../../../Enums/Enums";
import { CometChatButton } from "../../BaseComponents/CometChatButton/CometChatButton";
import audioCall from "../../../assets/audio_call_button.svg";
import videoCall from "../../../assets/video_call_button.svg";
import { OutgoingCallConfiguration } from "../OutgoingCallConfiguration";
import { CometChatCallEvents } from "../../../events/CometChatCallEvents";
import { CometChatMessageEvents } from "../../../events/CometChatMessageEvents";

interface CallButtonsProps {
  /* callback which is triggered on click of audio call button. */
  onVoiceCallClick?: () => void;
  /* callback which is triggered on click of video call button. */
  onVideoCallClick?: () => void;
  /* callback which is triggered on error occured. */
  onError?: (error: CometChat.CometChatException) => void;
  /* builder for checking and updating call settings. */
  callSettingsBuilder?: (isAudioOnlyCall: boolean, user?: CometChat.User, group?: CometChat.Group) => typeof CometChatUIKitCalls.CallSettingsBuilder;
  /* Configurations object which is required for outgoing call. */
  outgoingCallConfiguration?: OutgoingCallConfiguration;
}

interface CallButtonsUserProps extends CallButtonsProps {
/** 
   * Sets the user object for Call Buttons.
   */
user: CometChat.User;

/** 
 * Used to set the group object for Call Buttons.
 * 
 * @default null
 */
group?: CometChat.Group | null;
}

interface CallButtonsGroupProps extends CallButtonsProps {
  /** 
   * Sets the user object for Call Buttons, or null if no user is involved.
   * 
   * @default null
   */
  user?: CometChat.User | null;

  /** 
   * Used to set the group object for Call Buttons.
   */
  group: CometChat.Group;
}

type CallButtonsPropsType = CallButtonsUserProps | CallButtonsGroupProps

const defaultProps = {
  onVoiceCallClick: undefined,
  onVideoCallClick: undefined,
  callSettingsBuilder: undefined,
  outgoingCallConfiguration: new OutgoingCallConfiguration({}),

  onError: (error: CometChat.CometChatException) => {
    console.log(error);
  },
};

const CometChatCallButtons = (props: CallButtonsPropsType) => {
  const {
    user,
    group,
    onVoiceCallClick,
    onVideoCallClick,
    callSettingsBuilder,
    onError,
    outgoingCallConfiguration,
  } = { ...defaultProps, ...props };

  const [loggedInUser, setLoggedInuser] = useState<CometChat.User | null>(null);
  const [activeUser, setActiveUser] = useState(user);
  const [activeGroup, setActiveGroup] = useState(group);
  const [showOngoingCall, setShowOngoingCall] = useState(false);
  const [showOutgoingCallScreen, setShowOutgoingCallScreen] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);

  const callRef = useRef<CometChat.Call | null>(null);
  const sessionIdRef = useRef<string>("");
  const isGroupAudioCallRef = useRef<boolean>(false);
  const onVoiceCallClickRef = useRefSync(onVoiceCallClick);
  const onVideoCallClickRef = useRefSync(onVideoCallClick);

  let callbuttonsListenerId: string = "callbuttons_" + new Date().getTime();

  /* The purpose of this function is to trigger the onError callback function. */
  const onErrorCallback = useCallback(
    (error: unknown) => {
      if (!(error instanceof CometChat.CometChatException)) {
        let errorModel = {
          code: (error as { code: string }).code,
          name: (error as { name: string }).name,
          message: (error as { message: string }).message,
          details: (error as { details: string }).details,
        };
        let errorObj = new CometChat.CometChatException(errorModel);
        onError?.(errorObj);
      } else {
        onError?.(error);
      }
    },
    [onError]
  );

  const subscribeToEvents = useCallback(() => {
    try {
      const ccCallRejected = CometChatCallEvents.ccCallRejected.subscribe(
        () => {
          setDisableButtons(false);
        }
      );
      const ccOutgoingCall = CometChatCallEvents.ccOutgoingCall.subscribe(
        () => {
          setDisableButtons(true);
        }
      );
      const ccCallEnded = CometChatCallEvents.ccCallEnded.subscribe(() => {
        setDisableButtons(false);
        callRef.current = null;
        sessionIdRef.current = "";
        setShowOngoingCall(false);
        setShowOutgoingCallScreen(false);
      });

      return () => {
        try {
          ccCallEnded?.unsubscribe();
          ccCallRejected?.unsubscribe();
          ccOutgoingCall?.unsubscribe();
        } catch (e) {
          onErrorCallback(e);
        }
      };
    } catch (e) {
      onErrorCallback(e);
    }
  }, [onErrorCallback]);

  /* The purpose of this function is to attach the required call listners. */
  const attachListeners = useCallback(() => {
    try {
      CometChat.addCallListener(
        callbuttonsListenerId,
        new CometChat.CallListener({
          onIncomingCallReceived: () => {
            setDisableButtons(true);
          },
          onIncomingCallCancelled: () => {
            setDisableButtons(false);
          },
          onOutgoingCallRejected: () => {
            setShowOutgoingCallScreen(false);
            setDisableButtons(false);
            callRef.current = null;
            sessionIdRef.current = "";
          },
          onOutgoingCallAccepted: (call: CometChat.Call) => {
            if (call.getSender()?.getUid() === loggedInUser?.getUid()
              || call.getSessionId() !== callRef.current?.getSessionId()
            ) {
              setShowOutgoingCallScreen(false);
              setDisableButtons(false);
              callRef.current = null;
              sessionIdRef.current = "";
              return;
            }
            setShowOutgoingCallScreen(false);
            setShowOngoingCall(true);
            setDisableButtons(true);
            callRef.current = call;
            sessionIdRef.current = call.getSessionId();
          },
        })
      );
    } catch (e) {
      onErrorCallback(e);
    }
  }, [onErrorCallback, callbuttonsListenerId]);

  /* This function removes the call listeners on component unmount. */
  const removeListener = useCallback(() => {
    try {
      CometChat.removeCallListener(callbuttonsListenerId);
    } catch (e) {
      onErrorCallback(e);
    }
  }, [onErrorCallback, callbuttonsListenerId]);

  /* This function closes the call and resets the states. */
  const closeCallScreen = () => {
    setDisableButtons(false);
    callRef.current = null;
    sessionIdRef.current = "";
    setShowOngoingCall(false);
    setShowOutgoingCallScreen(false);
  };

  /* This function updates and returns the call builder with required configs and listeners attached. */
  function getCallBuilder(): typeof CometChatUIKitCalls.CallSettings {
    let audioOnlyCall: boolean =
      activeUser ? callRef.current?.getType() === CometChatUIKitConstants.MessageTypes.audio
        ? true
        : false : isGroupAudioCallRef.current;
    let callsBuilder = callSettingsBuilder ? callSettingsBuilder(audioOnlyCall, user!, group!) : new CometChatUIKitCalls.CallSettingsBuilder()
      .enableDefaultLayout(true)
      .setIsAudioOnlyCall(audioOnlyCall);

    const sessionId = sessionIdRef.current;
    callsBuilder.setCallListener(
      new CometChatUIKitCalls.OngoingCallListener({
        onCallEnded: () => {
          if (
            callRef.current?.getReceiverType() ===
            CometChatUIKitConstants.MessageReceiverType.user
          ) {
            CometChatUIKitCalls.endSession();
            CometChatCallEvents.ccCallEnded.next(null as any);
            closeCallScreen();
          }
        },
        onCallEndButtonPressed: () => {
          if (
            callRef.current?.getReceiverType() ===
            CometChatUIKitConstants.MessageReceiverType.user
          ) {
            CometChat.endCall(sessionId)
              .then((call: CometChat.Call) => {
                CometChatUIKitCalls.endSession();
                CometChatCallEvents.ccCallEnded.next(call);
                closeCallScreen()
              })
              .catch((err: CometChat.CometChatException) => {
                onErrorCallback(err);
              });
          } else {
            closeCallScreen();
          }
        },
        onError: (error: unknown) => {
          onErrorCallback(error);
        },
      })
    );
    return callsBuilder;

  }

  /* This function initiates the call process on click of call buttons. */
  const initiateCall = useCallback(
    (type: string) => {
      try {
        const receiverType: string = activeUser
          ? CometChatUIKitConstants.MessageReceiverType.user
          : CometChatUIKitConstants.MessageReceiverType.group;

        const receiverId: string | undefined = activeUser
          ? activeUser?.getUid()
          : activeGroup?.getGuid();

        const callObj: CometChat.Call = new CometChat.Call(
          receiverId,
          type,
          receiverType
        );

        CometChat.initiateCall(callObj).then(
          (outgoingCall: CometChat.Call) => {
            callRef.current = outgoingCall;
            setShowOutgoingCallScreen(true);
            CometChatCallEvents.ccOutgoingCall.next(outgoingCall);
          },
          (error: CometChat.CometChatException) => {
            onErrorCallback(error);
          }
        );
      } catch (e) {
        onErrorCallback(e);
      }
    },
    [activeUser, activeGroup, onErrorCallback]
  );

  /* This function initiates the audio call on click of the button. */
  const initiateAudioCall = useCallback(() => {
    try {
      if (activeUser) {
        initiateCall(CometChatUIKitConstants.MessageTypes.audio);
      }
      if (activeGroup) {
        isGroupAudioCallRef.current = true;
        sessionIdRef.current = activeGroup?.getGuid();
        sendCustomMessage(CometChatUIKitConstants.MessageTypes.audio);
        setShowOngoingCall(true);
      }
    } catch (e) {
      onErrorCallback(e);
    }
  }, [activeUser, initiateCall, onErrorCallback]);

  /* This function sends the custom message on group after the call is started. */
  const sendCustomMessage = useCallback((callType?: string) => {
    try {
      const receiverType: string = activeUser
        ? CometChatUIKitConstants.MessageReceiverType.user
        : CometChatUIKitConstants.MessageReceiverType.group;

      const receiverId: string | undefined = activeUser
        ? activeUser?.getUid()
        : activeGroup?.getGuid();
      const sessionID = sessionIdRef.current;

      const customData = {
        sessionID: sessionID,
        sessionId: sessionID,
        callType: callType,
      };

      const customType = CometChatUIKitConstants.calls.meeting;
      const conversationId = `group_${sessionID}`;

      const customMessage: any = new CometChat.CustomMessage(
        receiverId,
        receiverType,
        customType,
        customData
      );

      customMessage.setMetadata({ incrementUnreadCount: true });
      customMessage.shouldUpdateConversation(true);
      customMessage.setSender(loggedInUser!);
      customMessage.setConversationId(conversationId);
      customMessage.sentAt = CometChatUIKitUtility.getUnixTimestamp();
      customMessage.muid = CometChatUIKitUtility.ID();

      CometChatMessageEvents.ccMessageSent.next({
        message: customMessage,
        status: MessageStatus.inprogress,
      });

      CometChat.sendCustomMessage(customMessage).then(
        (m) => {
          CometChatMessageEvents.ccMessageSent.next({
            message: m,
            status: MessageStatus.success,
          });
        },
        (error: CometChat.CometChatException) => {
          onErrorCallback(error);
        }
      );
    } catch (e) {
      onErrorCallback(e);
    }
  }, [activeUser, activeGroup, loggedInUser, onErrorCallback]);

  /* This function initiates the video call on click of the button. */
  const initiateVideoCall = useCallback(() => {
    try {
      if (activeUser) {
        initiateCall(CometChatUIKitConstants.MessageTypes.video);
      }
      if (activeGroup) {
        isGroupAudioCallRef.current = false;
        sessionIdRef.current = activeGroup?.getGuid();
        sendCustomMessage(CometChatUIKitConstants.MessageTypes.video);
        setShowOngoingCall(true);
      }
    } catch (e) {
      onErrorCallback(e);
    }
  }, [activeUser, activeGroup, sendCustomMessage, onErrorCallback, initiateCall]);

  /* This function cancels/rejects the call on click of button. */
  const cancelOutgoingCall = useCallback(() => {
    const call = callRef.current;
    if (!call) {
      return;
    }
    try {
      CometChatSoundManager.pause();
      CometChat.rejectCall(
        call.getSessionId(),
        CometChatUIKitConstants.calls.cancelled
      ).then(
        (call: CometChat.Call) => {
          setDisableButtons(false);
          setShowOutgoingCallScreen(false);
          CometChatCallEvents.ccCallRejected.next(call);
          callRef.current = null;
        },
        (error: CometChat.CometChatException) => {
          onErrorCallback(error);
        }
      );
      setShowOutgoingCallScreen(false);
    } catch (e) {
      onErrorCallback(e);
    }
  }, [onErrorCallback]);

  const { audioCallButtonClicked, videoCallButtonClicked } = useCallButtons(
    loggedInUser,
    setLoggedInuser,
    user,
    group,
    onErrorCallback,
    attachListeners,
    removeListener,
    setActiveUser,
    setActiveGroup,
    initiateAudioCall,
    initiateVideoCall,
    onVoiceCallClickRef,
    onVideoCallClickRef,
    subscribeToEvents
  );
  const ccBtnDisabledPropSpreadObject = disableButtons
    ? { disabled: true }
    : {};

  return (
    <>
      <div className="cometchat-call-button">
        {activeUser || activeGroup ? (
          <div className="cometchat-call-button__voice">
            <CometChatButton
              {...ccBtnDisabledPropSpreadObject}
              hoverText={localize("VOICE_CALL")}
              iconURL={audioCall}
              onClick={audioCallButtonClicked}
            />
          </div>
        ) : null}

        {activeUser || activeGroup ? (
          <div className="cometchat-call-button__video">
            <CometChatButton
              {...ccBtnDisabledPropSpreadObject}
              hoverText={localize("VIDEO_CALL")}
              iconURL={videoCall}
              onClick={videoCallButtonClicked}
            />
          </div>
        ) : null}
      </div>

      {showOngoingCall && sessionIdRef.current != null ? (
        <CometChatOngoingCall
          sessionID={sessionIdRef.current}
          callSettingsBuilder={getCallBuilder()}
        />
      ) : null}

      {showOutgoingCallScreen && callRef.current ? (
        <div className="cometchat-backdrop cometchat-outgoing-call__backdrop">
          <CometChatOutgoingCall
            onCloseClicked={outgoingCallConfiguration?.onCloseClicked ?? cancelOutgoingCall}
            call={callRef.current}
            customSoundForCalls={outgoingCallConfiguration?.customSoundForCalls}
            customView={outgoingCallConfiguration?.customView}
            disableSoundForCalls={outgoingCallConfiguration?.disableSoundForCalls}
            onError={outgoingCallConfiguration?.onError}
          />
        </div>
      ) : null}
    </>
  );
};

export { CometChatCallButtons };
