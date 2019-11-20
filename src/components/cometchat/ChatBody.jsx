import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import ContactConversation from "./ContactConversation";
import GroupConversation from "./GroupConversation";
import {
  LISTENER_NEW_MESSAGE,
  LISTENER_REAL_TIME_RECIEPTS,
  MESSAGE_TYPE_AUDIO,
  MESSAGE_TYPE_FILE,
  MESSAGE_TYPE_IMAGE,
  MESSAGE_TYPE_VIDEO,
  MESSAGE_TYPE_MEDIA,
  LISTENER_RT_MSG_EDIT,
  LISTENER_RT_MSG_DELETE
} from "../../constants";
import _ from "lodash";

export default class ChatBody extends Component {
  state = {
    msghistory: [],
    newMessage: [],
    showAttachmentOptions: false,
    showContactUtilities: false,
    callTypeActive: 0,
    callSessionUniqID: "",
    showMsgActionID: 0,
    editingMessageActive: false
  };

  //fetch msg history
  componentDidUpdate(prevProps) {
    if (
      (this.props.activeConversation.uid !== undefined &&
        this.props.activeConversation.uid !==
          prevProps.activeConversation.uid) ||
      ((this.props.activeConversation.guid !== undefined &&
        this.props.activeConversation.guid !==
          prevProps.activeConversation.guid) ||
        (this.props.activeConversation.guid !== undefined &&
          this.props.activeConversation.membersCount !==
            prevProps.activeConversation.membersCount) ||
        this.props.callActive !== prevProps.callActive)
    ) {
      var limit = 100;
      let receiverType = CometChat.RECEIVER_TYPE.USER;
      let messagesRequest;
      let otherUID;
      if (this.props.activeConversation.guid !== undefined) {
        otherUID = this.props.activeConversation.guid;
        messagesRequest = new CometChat.MessagesRequestBuilder()
          .setLimit(limit)
          .setGUID(otherUID)
          .build();
        receiverType = CometChat.RECEIVER_TYPE.GROUP;
      } else {
        otherUID = this.props.activeConversation.uid;
        messagesRequest = new CometChat.MessagesRequestBuilder()
          .setLimit(limit)
          .setUID(otherUID)
          .build();
      }

      messagesRequest.fetchPrevious().then(
        messages => {
          
          if (!_.isEmpty(messages)) {
            const last_message = _.last(messages);
            if (last_message.sender.uid !== this.props.subjectUID) {
              var messageId = last_message.id;
             
              CometChat.markAsRead(messageId, last_message.sender.uid, receiverType);
            }
          }
          this.setState({ msghistory: messages });
          this.scrollToBottom();
          
        },
        error => {
          this.setState({ msghistory: [] });
        }
      );
    }
  }

  //new msg recieve listener
  //real time reciepts listener
  componentDidMount() {
    //listener1
    var listenerID = LISTENER_NEW_MESSAGE;

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          console.log("textMessage",textMessage)
          let messageId;
          let receiverType;
          let senderID;
          if (
            textMessage.receiverType === CometChat.RECEIVER_TYPE.USER &&
            textMessage.sender.uid === this.props.activeConversation.uid
          ) {
            // Handle text message
            senderID = textMessage.sender.uid;
            messageId = textMessage.id;
            receiverType = textMessage.receiverType;

            if (senderID !== this.props.subjectUID) {
              CometChat.markAsRead(
                messageId,
                senderID,
                receiverType
              );
            }
            this.setState({
              msghistory: [...this.state.msghistory, textMessage]
            });
            this.props.handleOnRecentMessageSent(messageId);

          } else if (
            textMessage.receiverType === CometChat.RECEIVER_TYPE.GROUP &&
            textMessage.receiverId === this.props.activeConversation.guid
          ) {
            if(textMessage.sender.uid !== this.props.subjectUID)
            {
              // Handle text message
              senderID = textMessage.sender.uid;
              messageId = textMessage.id;
              receiverType = textMessage.receiverType;
             
              CometChat.markAsRead(messageId, senderID, receiverType);
              this.props.handleOnRecentMessageSent(messageId);
              this.setState({
                msghistory: [...this.state.msghistory, textMessage]
              });
            }
            
          }
          this.scrollToBottom();
        },
        onMediaMessageReceived: mediaMessage => {
          let messageId;
          let receiverType;
          let senderID;
          // Handle media message
          if (mediaMessage.sender.uid === this.props.activeConversation.uid) {
            this.setState({
              msghistory: [...this.state.msghistory, mediaMessage]
            });
            senderID = mediaMessage.sender.uid;
            messageId = mediaMessage.id;
            
            receiverType = CometChat.RECEIVER_TYPE.USER;
            if (senderID !== this.props.subjectUID)
              CometChat.markAsRead(
                messageId,
                senderID,
                receiverType
              );
              this.props.handleOnRecentMessageSent(messageId);

          } else if (
            mediaMessage.sender.guid !== undefined &&
            mediaMessage.sender.guid === this.props.activeConversation.guid
          ) {
            this.setState({
              msghistory: [...this.state.msghistory, mediaMessage]
            });
            messageId = mediaMessage.id;
            receiverType = CometChat.RECEIVER_TYPE.GROUP;
            senderID = mediaMessage.sender.uid;
            if (senderID !== this.props.subjectUID)
              CometChat.markAsRead(messageId, senderID, receiverType);

              this.props.handleOnRecentMessageSent(messageId);
          }
          this.scrollToBottom();
        },
        onMessagesRead: messageReceipt => {
          let msghistory = [...this.state.msghistory];
          _.forEach(msghistory, function(value, key) {
            
            if(value.readAt === undefined)
              msghistory[key].readAt = messageReceipt.readAt;
          });
          this.setState({ msghistory });
         
        },
        onMessagesDelivered: messageReceipt => {
          let msghistory = [...this.state.msghistory];

          const index_in_history = _.findKey(msghistory, [
            "id",
            messageReceipt.messageId
          ]);
         
          if (index_in_history !== undefined) {
            msghistory[index_in_history]["deliveredAt"] =
              messageReceipt.deliveredAt;
            this.setState({ msghistory });
          }
        }
      })
    );

    var listenerID4 = LISTENER_RT_MSG_EDIT;

    CometChat.addMessageListener(
      listenerID4,
      new CometChat.MessageListener({
        onMessageEdited: message => {
          let msghistory = this.state.msghistory;
          let messageKey = _.findIndex(msghistory, function(m) {
            return m.id === message.id;
          });
          msghistory[messageKey] = message;
          this.setState({ msghistory });

          this.props.handleOnRecentMessageSent(message.id);
        }
      })
    );

    var listenerID5 = LISTENER_RT_MSG_DELETE;
    CometChat.addMessageListener(
      listenerID5,
      new CometChat.MessageListener({
        onMessageDeleted: message => {
          let msghistory = this.state.msghistory;
          const messageKey = _.findIndex(msghistory, function(m) {
            return m.id === message.id;
          });
          msghistory[messageKey] = message;
          this.setState({ msghistory });
          this.props.handleOnRecentMessageSent(message.id);
        }
      })
    );

  }

  componentWillUnmount() {
    CometChat.removeMessageListener(LISTENER_NEW_MESSAGE);
    CometChat.removeMessageListener(LISTENER_REAL_TIME_RECIEPTS);
    CometChat.removeMessageListener(LISTENER_RT_MSG_EDIT);
    CometChat.removeMessageListener(LISTENER_RT_MSG_DELETE);
  }

  handleTextInputChange = e => {
    this.setState({ newMessage: e.target.value });

    if (this.props.activeConversation.uid !== undefined) {
      let receiverId = this.props.activeConversation.uid;

      let receiverType = CometChat.RECEIVER_TYPE.USER;

      let typingNotification = new CometChat.TypingIndicator(
        receiverId,
        receiverType
      );

      if (e.target.value === "") CometChat.endTyping(typingNotification);
      else CometChat.startTyping(typingNotification);
    } else if (this.props.activeConversation.guid !== undefined) {
      let receiverId = this.props.activeConversation.guid;

      let receiverType = CometChat.RECEIVER_TYPE.GROUP;

      let typingNotification = new CometChat.TypingIndicator(
        receiverId,
        receiverType
      );

      if (e.target.value === "") CometChat.endTyping(typingNotification);
      else CometChat.startTyping(typingNotification);
    }
  };

  showHideAttachSection = e => {
    this.setState({ showAttachmentOptions: !this.state.showAttachmentOptions });
  };

  showHideContactUtilites = e => {
    this.setState({ showContactUtilities: !this.state.showContactUtilities });
  };

  

  sendCustomMessage = () =>
  {
    const location = window.navigator && window.navigator.geolocation
    if (location) {
      location.getCurrentPosition((position) => {
        let customData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
         };

      let customType = 'location'; 
      let receiverID;
      let receiverType;

      if (this.props.activeConversation.guid !== undefined) {
        receiverID = this.props.activeConversation.guid;
        receiverType = CometChat.RECEIVER_TYPE.GROUP;
      } else if (this.props.activeConversation.uid !== undefined) {
        receiverID = this.props.activeConversation.uid;
        receiverType = CometChat.RECEIVER_TYPE.USER;
      }
        var customMessage = new CometChat.CustomMessage(receiverID, receiverType,customType,customData);

        if (this.state.editingMessageActive === true) {
          this.handleMessageUpdate(receiverID, receiverType, customMessage);
        } else {
          CometChat.sendCustomMessage(customMessage).then(
            message => {
              this.setState({
                showAttachmentOptions: !this.state.showAttachmentOptions,
                msghistory: [...this.state.msghistory, message]
              });
              this.scrollToBottom();

              this.props.handleOnRecentMessageSent(message.id);
            },
            error => {
              this.setState({ newMessage: [] });
            }
          );
        }      
      },(error) => {
        alert("Cannot detect your location.");
      });
    }
  }

  handleAttachment = (fileType = MESSAGE_TYPE_MEDIA) => {
    let otherUID;
    let receiverType;

    if (this.props.activeConversation.guid !== undefined) {
      otherUID = this.props.activeConversation.guid;
      receiverType = CometChat.RECEIVER_TYPE.GROUP;
    } else if (this.props.activeConversation.uid !== undefined) {
      otherUID = this.props.activeConversation.uid;
      receiverType = CometChat.RECEIVER_TYPE.USER;
    }

    let messageType = CometChat.MESSAGE_TYPE.MEDIA;

    if (fileType === MESSAGE_TYPE_IMAGE)
      messageType = CometChat.MESSAGE_TYPE.IMAGE;
    else if (fileType === MESSAGE_TYPE_VIDEO)
      messageType = CometChat.MESSAGE_TYPE.VIDEO;
    else if (fileType === MESSAGE_TYPE_AUDIO)
      messageType = CometChat.MESSAGE_TYPE.AUDIO;
    else if (fileType === MESSAGE_TYPE_FILE)
      messageType = CometChat.MESSAGE_TYPE.FILE;

    var file = document.getElementById("attachment-type-" + fileType).files[0];

    var mediaMessage = new CometChat.MediaMessage(
      otherUID,
      file,
      messageType,
      receiverType
    );
    CometChat.sendMediaMessage(mediaMessage).then(
      message => {
        // Message sent successfully.
        this.setState({
          showAttachmentOptions: !this.state.showAttachmentOptions,
          msghistory: [...this.state.msghistory, message]
        });
        this.scrollToBottom();
        this.props.handleOnRecentMessageSent(message.id);
      },
      error => {
        // Handle exception.
      }
    );
  };

  sendMessage = e => {
    var code = e.keyCode ? e.keyCode : e.which;

    if (e.target.id === "sendMsgIco" || code === 13) {
      //Enter keycode

      let receiverID;
      let receiverType;

      if (this.props.activeConversation.guid !== undefined) {
        receiverID = this.props.activeConversation.guid;
        receiverType = CometChat.RECEIVER_TYPE.GROUP;
      } else if (this.props.activeConversation.uid !== undefined) {
        receiverID = this.props.activeConversation.uid;
        receiverType = CometChat.RECEIVER_TYPE.USER;
      }

      var messageText = this.state.newMessage;

      var textMessage = new CometChat.TextMessage(
        receiverID,
        messageText,
        receiverType
      );

      if (this.state.editingMessageActive === true) {
        this.handleMessageUpdate(receiverID, receiverType, messageText);
      } else {
        CometChat.sendMessage(textMessage).then(
          message => {
            
            this.setState({
              newMessage: [],
              msghistory: [...this.state.msghistory, message]
            });
            
            this.scrollToBottom();
            this.props.handleOnRecentMessageSent(message.id);
          },
          error => {
            this.setState({ newMessage: [] });
          }
        );
      }
    }
  };

  scrollToBottom = () => {
    if (!this.state.editingMessageActive) {
      var node = document.getElementsByClassName("chat-body-conversation");
      if (node[0] !== undefined) {
        const bottom =
          node[0].scrollHeight - node[0].scrollTop === node[0].clientHeight;
        if (!bottom) {
          node[0].scrollTop = node[0].scrollHeight;
        }
      }
    }
  };

  handleMessageClick = (e, msgID) => {
    e.preventDefault();
    if (e.type === "contextmenu") {
      //handle right click event
      this.setState({ showMsgActionID: msgID });
    } else if (e.type === "click") {
      if (this.state.editingMessageActive === true)
        this.setState({
          showMsgActionID: 0,
          editingMessageActive: false,
          newMessage: []
        });
      else this.setState({ showMsgActionID: 0 });
    }
  };

  handleMessageDelete = () => {
    let messageId = this.state.showMsgActionID;

    CometChat.deleteMessage(messageId).then(
      message => {
        let msghistory = this.state.msghistory;
        const messageKey = _.findIndex(msghistory, function(m) {
          return m.id === messageId;
        });
        msghistory[messageKey] = message;
        this.setState({
          msghistory,
          showMsgActionID: 0,
          editingMessageActive: false
        });
        this.props.handleOnRecentMessageSent(messageId);
      },
      error => {
        this.setState({ showMsgActionID: 0, editingMessageActive: false });
      }
    );
  };

  handleMessageEdit = msg => {
    this.setState({ newMessage: msg, editingMessageActive: true });
  };

  handleMessageUpdate = (receiverID, receiverType, messageText) => {
    let messageId = this.state.showMsgActionID;
    let textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType
    );
    textMessage.setId(messageId);

    CometChat.editMessage(textMessage).then(
      message => {
        let msghistory = this.state.msghistory;

        const messageKey = _.findIndex(msghistory, function(m) {
          return m.id === messageId;
        });

        msghistory[messageKey] = message;

        this.setState({
          msghistory,
          showMsgActionID: 0,
          editingMessageActive: false,
          newMessage: []
        });

        this.props.handleOnRecentMessageSent(messageId);
      },
      error => {
        
      }

    );
  };

  render() {
    if (this.props.activeConversation.uid !== undefined) {
      return (
        <ContactConversation
          activeConversation={this.props.activeConversation}
          typingIndicatorUIDs={this.props.typingIndicatorUIDs}
          showAttachmentOptions={this.state.showAttachmentOptions}
          showContactUtilities={this.state.showContactUtilities}
          showHideAttachSection={this.showHideAttachSection}
          makeCall={this.props.makeCall}
          showHideContactUtilites={this.showHideContactUtilites}
          msghistory={this.state.msghistory}
          subjectUID={this.props.subjectUID}
          handleTextInputChange={this.handleTextInputChange}
          sendMessage={this.sendMessage}
          sendCustomMessage={this.sendCustomMessage}
          newMessage={this.state.newMessage}
          handleAttachment={this.handleAttachment}
          handleMessageClick={this.handleMessageClick}
          showMsgActionID={this.state.showMsgActionID}
          handleMessageDelete={this.handleMessageDelete}
          handleMessageEdit={this.handleMessageEdit}
          handleBlockUser={this.props.handleBlockUser}
          scrollToBottom={this.scrollToBottom}
          isMobile={this.props.isMobile}
          handleScreenChangesOnMobile={this.props.handleScreenChangesOnMobile}
          chatBodyVisiblity={this.props.chatBodyVisiblity}
        />
      );
    } else if (this.props.activeConversation.guid !== undefined) {
      return (
        <GroupConversation
          activeConversation={this.props.activeConversation}
          typingIndicatorUIDs={this.props.typingIndicatorUIDs}
          showAttachmentOptions={this.state.showAttachmentOptions}
          showContactUtilities={this.state.showContactUtilities}
          showHideAttachSection={this.showHideAttachSection}
          makeCall={this.props.makeCall}
          showHideContactUtilites={this.showHideContactUtilites}
          msghistory={this.state.msghistory}
          subjectUID={this.props.subjectUID}
          handleTextInputChange={this.handleTextInputChange}
          sendMessage={this.sendMessage}
          sendCustomMessage={this.sendCustomMessage}
          newMessage={this.state.newMessage}
          handleAttachment={this.handleAttachment}
          handleMessageClick={this.handleMessageClick}
          showMsgActionID={this.state.showMsgActionID}
          handleMessageDelete={this.handleMessageDelete}
          handleMessageEdit={this.handleMessageEdit}
          handleToggleSubSidebar={this.props.handleToggleSubSidebar}
          handleAddGroupMemberToggle={this.props.handleAddGroupMemberToggle}
          handleLeaveGroup={this.props.handleLeaveGroup}
          scrollToBottom={this.scrollToBottom}
          isMobile={this.props.isMobile}
          handleScreenChangesOnMobile={this.props.handleScreenChangesOnMobile}
          chatBodyVisiblity={this.props.chatBodyVisiblity}
          ownerRights={this.props.ownerRights}
        />
      );
    } else {
      let classes =
        "chat-body col-md-7 col-xl-8 col-sm-12 col-xs-12 p-0 no-active-chat ";
      classes += this.props.chatBodyVisiblity;
      return (
        <div className={classes}>
          <p>Say Hi to someone today!</p>
        </div>
      );
    }
  }
}