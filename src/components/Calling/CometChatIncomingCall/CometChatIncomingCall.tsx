import { useCallback, useEffect, useRef, useState } from "react";
import AudioCallIcon from "./assets/Audio-Call.svg";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatOngoingCall } from "../CometChatOngoingCall/CometChatOngoingCall";
import { useCometChatIncomingCall } from "./useCometChatIncomingCall";
import VideoCallIcon from "./assets/Video-call.svg";
import { CometChatUIKitCalls } from "../../../CometChatUIKit/CometChatCalls";
import { CometChatSoundManager } from "../../../resources/CometChatSoundManager/CometChatSoundManager";
import { StorageUtils } from "../../../utils/Storage";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";
import { CometChatUIKitConstants } from "../../../constants/CometChatUIKitConstants";
import { CometChatListItem } from "../../BaseComponents/CometChatListItem/CometChatListItem";
import { CometChatAvatar } from "../../BaseComponents/CometChatAvatar/CometChatAvatar";
import { CometChatButton } from "../../BaseComponents/CometChatButton/CometChatButton";
import { CometChatCallEvents } from "../../../events/CometChatCallEvents";

interface IncomingCallProps {
  /**
   * CometChat call object consumed by the component to launch itself.
   */
  call?: any;

  /**
   * Used to disable/enable the sound of incoming calls.
   * 
   * @default false
   */
  disableSoundForCalls?: boolean;

  /**
   * Used to set a custom sound for incoming calls.
   * 
   * @example customSoundForCalls='Your Custom Sound For Calls'
   */
  customSoundForCalls?: string;

  /**
   * Triggered when you click the accept button of the Incoming Call component.
   * You can override this action.
   */
  onAccept?: Function;

  /**
   * Triggered when you click the decline button of the Incoming Call component.
   * You can override this action.
   */
  onDecline?: Function;

  /**
   * Used to set custom accept button text.
   * 
   * @example acceptButtonText='Your Custom Accept Button Text'
   */
  acceptButtonText?: string;

  /**
   * Used to set custom decline button text.
   * 
   * @example declineButtonText='Your Decline Button Text'
   */
  declineButtonText?: string;

  /**
   * Custom subtitle view for the incoming call component.
   */

  subtitleView?: (call: CometChat.Call) => JSX.Element
  /**
   * Triggered when an error occurs in the Incoming Call component.
   */
  onError?: Function;

  /**
   * Builder function for configuring and updating call settings.
   * 
   * @param call - The current CometChat call object.
   * @returns An instance of CallSettingsBuilder.
   */
  callSettingsBuilder?: (call: CometChat.Call) => typeof CometChatUIKitCalls.CallSettingsBuilder;
}

const CometChatIncomingCall = (props: IncomingCallProps) => {
  const {
    call,
    disableSoundForCalls = false,
    customSoundForCalls = "",
    onAccept,
    onDecline,
    acceptButtonText = localize("ACCEPT"),
    declineButtonText = localize("DECLINE"),
    subtitleView = null,
    onError = (error: CometChat.CometChatException) => {
      console.log(error);
    },
    callSettingsBuilder
  } = props;

  const [loggedInUser, setLoggedInuser] = useState<CometChat.User | null>(null);
  const [showIncomingCallScreen, setShowIncomingCallScreen] = useState(false);
  const [showOngoingCallScreen, setShowOngoingCallScreen] = useState(false);
  const [showOutGoingCallScreen, setShowOutGoingCallScreen] = useState(false);
  const callRef = useRef<CometChat.Call | null>(null);
  const sessionIdRef = useRef("");
  const rejectCallButtonRef = useRef(null);
  const acceptCallButtonRef = useRef(null);


  let incomingcallListenerId: string = "incomingcall_" + new Date().getTime(),
    subtitleText: string = localize("INCOMING_CALL");

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
        onError!(errorObj);
      } else {
        onError!(error);
      }
    },
    [onError]
  );

  const playAudio = useCallback(() => {
    try {
      if (customSoundForCalls) {
        CometChatSoundManager.play(
          CometChatSoundManager.Sound.incomingCall!,
          customSoundForCalls
        );
      } else {
        CometChatSoundManager.play(CometChatSoundManager.Sound.incomingCall!);
      }
    } catch (e) {
      onErrorCallback(e);
    }
  }, [customSoundForCalls, onErrorCallback]);

  const isCallActive = useCallback(
    (call: CometChat.Call) => {
      let isCurrentCall: boolean = false;
      try {
        if (StorageUtils.getItem(CometChatUIKitConstants.calls.activecall)) {
          let oldCall: any = StorageUtils.getItem(
            CometChatUIKitConstants.calls.activecall
          );
          if (oldCall && oldCall.sessionId === call.getSessionId()) {
            isCurrentCall = true;
          } else {
            isCurrentCall = false;
          }
        } else {
          isCurrentCall = false;
        }
        return isCurrentCall;
      } catch (e) {
        onErrorCallback(e);
        return isCurrentCall;
      }
    },
    [onErrorCallback]
  );

  const rejectIncomingCall = useCallback(
    (reason: string = CometChatUIKitConstants.calls.rejected) => {
      try {
        CometChatSoundManager.pause();
        if (onDecline) {
          onDecline();
        } else if (typeof callRef?.current?.getSessionId() === "string") {
          CometChat.rejectCall(callRef?.current?.getSessionId(), reason).then(
            (rejectedCall: CometChat.Call) => {
              StorageUtils.setItem(
                CometChatUIKitConstants.calls.activecall,
                rejectedCall
              );
              CometChatCallEvents.ccCallRejected.next(rejectedCall);
              setShowIncomingCallScreen(false);
              callRef.current = null;
            },
            (error: CometChat.CometChatException) => {
              onErrorCallback(error);
            }
          );
        }
      } catch (e) {
        onErrorCallback(e);
      }
    },
    [onDecline, onErrorCallback]
  );

  const showCall = useCallback(
    (call: CometChat.Call) => {
      try {
        if (
          !isCallActive(call) &&
          loggedInUser?.getUid() !== call?.getSender()?.getUid() &&
          callRef.current
        ) {
          if (
            !disableSoundForCalls &&
            !showOngoingCallScreen &&
            !showOutGoingCallScreen
          ) {
            setTimeout(() => {
              playAudio();
            }, 100);
          }
          if (!showOngoingCallScreen && !showOutGoingCallScreen) {
            setShowIncomingCallScreen(true);
          } else if (showOngoingCallScreen || showOutGoingCallScreen) {
            CometChatSoundManager.pause();
            rejectIncomingCall(CometChatUIKitConstants.calls.busy);
            CometChatCallEvents.ccCallRejected.next(call);
          }
        } else if (loggedInUser?.getUid() === call?.getSender()?.getUid()) {
          CometChatSoundManager.pause();
          return;
        } else {
          CometChatSoundManager.pause();
          rejectIncomingCall(CometChatUIKitConstants.calls.busy);
        }
      } catch (e) {
        onErrorCallback(e);
      }
    },
    [
      isCallActive,
      disableSoundForCalls,
      playAudio,
      rejectIncomingCall,
      onErrorCallback,
      loggedInUser,
      showOngoingCallScreen,
      showOutGoingCallScreen,
    ]
  );

  const localStorageChange = useCallback((event: any) => {
    if (event?.key !== CometChatUIKitConstants.calls.activecall) {
      return;
    }
    if (event.newValue || event.oldValue) {
      let call;
      if (event.newValue) {
        call = JSON.parse(event.newValue);
      } else if (event.oldValue) {
        call = JSON.parse(event.oldValue);
      }
      if (callRef.current?.getSessionId() === call?.sessionId) {
        CometChatSoundManager.pause();
        callRef.current = null;
        setShowIncomingCallScreen(false);
      }
    }
    return;
  }, []);

  const closeCallScreen = () => {
    setShowOngoingCallScreen(false);
    setShowOutGoingCallScreen(false)
    callRef.current = null;
    sessionIdRef.current = "";
  };

  const subscribeToEvents = useCallback(() => {
    try {
      const ccCallEnded = CometChatCallEvents.ccCallEnded.subscribe(
        (call: CometChat.Call) => {
          closeCallScreen();
        }

      );

      const ccOutgoingCall = CometChatCallEvents.ccOutgoingCall.subscribe(
        () => {
          setShowOutGoingCallScreen(true);
        }
      );
      const ccCallRejected = CometChatCallEvents.ccCallRejected.subscribe(
        () => {
          setShowOngoingCallScreen(false);
          setShowOutGoingCallScreen(false);
        }
      );
      return () => {
        try {
          ccCallEnded?.unsubscribe();
          ccOutgoingCall?.unsubscribe();
          ccCallRejected?.unsubscribe();
        } catch (error: any) {
          onErrorCallback(error);
        }
      };
    } catch (e) {
      onErrorCallback(e);
    }
  }, [onErrorCallback]);

  const attachListeners = useCallback(() => {
    try {
      StorageUtils.attachChangeDetection(localStorageChange);
      CometChat.addCallListener(
        incomingcallListenerId,
        new CometChat.CallListener({
          onIncomingCallReceived: (call: CometChat.Call) => {
            if (callRef.current?.getSender()?.getUid() === call.getSender()?.getUid()) {
              return;
            }
            callRef.current = call;
            showCall(call);
          },
          onIncomingCallCancelled: (call: CometChat.Call) => {
            CometChatSoundManager.pause();
            callRef.current = null;
            setShowIncomingCallScreen(false);
          },
          onOutgoingCallAccepted: (call: CometChat.Call) => {
            CometChatSoundManager.pause();
            if (call.getSender()?.getUid() === loggedInUser?.getUid()) {
              callRef.current = null;
              setShowIncomingCallScreen(false);
            }
          },
          onOutgoingCallRejected: (call: CometChat.Call) => {
            CometChatSoundManager.pause();
            callRef.current = null;
            setShowOutGoingCallScreen(false);
            setShowOngoingCallScreen(false);
            setShowIncomingCallScreen(false);
          }
        })
      );
    } catch (e) {
      onErrorCallback(e);
    }
  }, [localStorageChange, showCall, onErrorCallback, incomingcallListenerId, loggedInUser]);

  const removeListener = useCallback(() => {
    try {
      StorageUtils.detachChangeDetection(localStorageChange);
      CometChat.removeCallListener(incomingcallListenerId);
    } catch (e) {
      onErrorCallback(e);
    }
  }, [localStorageChange, onErrorCallback, incomingcallListenerId]);

  const checkForActiveCallAndEndCall = useCallback(() => {
    try {
      let call: CometChat.Call = CometChat.getActiveCall();
      return new Promise((resolve, reject) => {
        if (!call) {
          return resolve({ success: true });
        }
        let sessionID = call?.getSessionId();
        CometChat.endCall(sessionID).then(
          (response: CometChat.Call | null) => {
            return resolve(response);
          },
          (error: CometChat.CometChatException) => {
            return reject(error);
          }
        );
      });
    } catch (e) {
      onErrorCallback(e);
    }
  }, [onErrorCallback]);

  const acceptIncomingCall = useCallback(() => {
    try {
      CometChatSoundManager.pause();
      if (onAccept) {
        onAccept();
      } else {
        checkForActiveCallAndEndCall()?.then(
          (response) => {
            CometChat.acceptCall(callRef.current!.getSessionId()).then(
              (call: CometChat.Call) => {
                CometChatCallEvents.ccCallAccepted.next(call);
                StorageUtils.setItem(
                  CometChatUIKitConstants.calls.activecall,
                  call
                );
                setShowOngoingCallScreen(true);
                callRef.current = call;
                sessionIdRef.current = call?.getSessionId();
                setShowIncomingCallScreen(false);
              },
              (error: CometChat.CometChatException) => {
                onErrorCallback(error);
              }
            );
          },
          (error: CometChat.CometChatException) => {
            onErrorCallback(error);
          }
        );
      }
    } catch (e) { }
  }, [checkForActiveCallAndEndCall, onErrorCallback, onAccept]);

  function getCallBuilder(): typeof CometChatUIKitCalls.CallSettings {
    let audioOnlyCall: boolean =
      callRef.current?.getType() === CometChatUIKitConstants.MessageTypes.audio
        ? true
        : false;
    if (callRef.current?.getType() === CometChatUIKitConstants.calls.meeting) {
      return undefined;
    }
    let callsBuilder = callSettingsBuilder ? callSettingsBuilder(call) : new CometChatUIKitCalls.CallSettingsBuilder().setIsAudioOnlyCall(audioOnlyCall).enableDefaultLayout(true);

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
          CometChat.endCall(sessionIdRef.current)
            .then((call: CometChat.Call) => {
              CometChatUIKitCalls.endSession();
              CometChatCallEvents.ccCallEnded.next(call);
            })
            .catch((err: CometChat.CometChatException) => { });
        },
        onError: (error: any) => {
          onErrorCallback(error);
        },
      })
    )
    return callsBuilder;
  }

  const getCallTypeIcon = () => {
    if (
      callRef.current?.getType() === CometChatUIKitConstants.MessageTypes.audio
    ) {
      return AudioCallIcon;
    } else {
      return VideoCallIcon;
    }
  };

  const ListItemSubtitleView = () => {
    return <>
      {subtitleView ? (
        <div className="cometchat-incoming-call__subtitle">
          {subtitleView(callRef.current!)}
        </div>
      ) : (
        <div className="cometchat-incoming-call__subtitle">
          <div
            className="cometchat-incoming-call__subtitle-icon"
            style={{ WebkitMask: `url(${getCallTypeIcon()}), center, center, no-repeat` }}
          />
          <div className="cometchat-incoming-call__subtitle-text">
            {subtitleText}
          </div>
        </div>
      )}
    </>
  }

  const ListItemTailView = () => {
    return <div className="cometchat-incoming-call__avatar">
      <CometChatAvatar
        image={callRef.current?.getSender()?.getAvatar()!}
        name={callRef.current?.getSender()?.getName()!}
      ></CometChatAvatar>
    </div>
  }

  useCometChatIncomingCall(
    loggedInUser,
    setLoggedInuser,
    call,
    attachListeners,
    removeListener,
    acceptCallButtonRef,
    rejectCallButtonRef,
    showCall,
    callRef,
    acceptIncomingCall,
    rejectIncomingCall,
    showIncomingCallScreen,
    subscribeToEvents
  );

  return (
    <>
      {callRef.current && showIncomingCallScreen ? (
        <div className="cometchat-incoming-call">
          <CometChatListItem
            title={callRef.current?.getSender()?.getName()}
            subtitleView={ListItemSubtitleView()}
            tailView={ListItemTailView()}
            avatarURL=""
          />
          <div className="cometchat-incoming-call__button-group">
            <div className="cometchat-incoming-call__button-decline">
              <CometChatButton
                text={declineButtonText}
                onClick={() => rejectIncomingCall(CometChatUIKitConstants.calls.rejected)}
              />
            </div>
            <div className="cometchat-incoming-call__button-accept">
              <CometChatButton
                text={acceptButtonText}
                onClick={() => acceptIncomingCall()}
              />
            </div>
          </div>
        </div>
      ) : null}

      {showOngoingCallScreen && callRef.current && !showIncomingCallScreen ? (
        <CometChatOngoingCall
          sessionID={sessionIdRef.current}
          callSettingsBuilder={getCallBuilder()}
        ></CometChatOngoingCall>
      ) : null}
    </>
  );
};

export { CometChatIncomingCall };
