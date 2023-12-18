import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  CometChatConversations,
  CometChatGroups,
  CometChatGroupsWithMessages,
  CometChatThemeContext,
  CometChatUsers,
  CometChatUsersWithMessages,
} from "@cometchat/chat-uikit-react";
import { CometChatPalette, CometChatTheme } from "@cometchat/uikit-resources";
import { appStyle, loadingModalStyle } from "./style";
import { useMemo, useState } from "react";

import { AddMembersWrapper } from "../AddMembersWrapper";
import { BannedMembersWrapper } from "../BannedMembersWrapper";
import { CallButtonsWrapper } from "../CallButtonsWrapper";
import { CallLogDetailsWrapper } from "../CallLogDetailsWrapper";
import { CallLogHistoryWrapper } from "../CallLogHistoryWrapper";
import { CallLogParticipantsWrapper } from "../CallLogParticipantsWrapper";
import { CallLogRecordingsWrapper } from "../CallLogRecordingsWrapper";
import { CallLogsWithDetailsWrapper } from "../CallLogsWithDetailsWrapper";
import { CallLogsWrapper } from "../CallLogsWrapper";
import { CallsCardList } from "../CallsCardList";
import { ChatsCardList } from "../ChatsCardList";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import CometChatLogo from "../../assets/cometchat_logo.png";
import { ComposerWrapper } from "../ComposerWrapper";
import { ContactsWrapper } from "../ContactsWrapper";
import { ConversationsWithMessagesWrapper } from "../ConversationsWithMessagesWrapper";
import { CreateGroupWrapper } from "../CreateGroupWrapper";
import { Effects } from "./effects";
import { GroupDetails } from "../GroupDetails";
import { GroupMembersWrapper } from "../GroupMembersWrapper";
import { GroupsCardList } from "../GroupsCardList";
import { Home } from "../Home";
import { IsMobileViewContext } from "../../IsMobileViewContext";
import { JoinGroupWrapper } from "../JoinGroupWrapper";
import LoadingIconGif from "../../assets/loading_icon.gif";
import { Login } from "../Login";
import { MessageHeaderWrapper } from "../MessageHeaderWrapper";
import { MessageInformationWrapper } from "../MessageInformationWrapper";
import { MessageListWrapper } from "../MessageListWrapper";
import { MessagesCardList } from "../MessagesCardList";
import { MessagesWrapper } from "../MessagesWrapper";
import { SharedCardList } from "../SharedCardList";
import { Signup } from "../Signup";
import { TransferOnwershipWrapper } from "../TransferOwnershipWrapper";
import { UserDetails } from "../UserDetails";
import { UsersCardList } from "../UsersCardList";

export function App() {
  const [loggedInUser, setLoggedInUser] = useState<
    CometChat.User | null | undefined
  >();
  const [interestingAsyncOpStarted, setInterestingAsyncOpStarted] =
    useState(false);
  const [theme, setTheme] = useState(new CometChatTheme({}));
  const [isMobileView, setIsMobileView] = useState(false);

  function toggleTheme() {
    const palette = new CometChatPalette({
      mode: theme.palette.mode === "light" ? "dark" : "light",
    });
    const newTheme = new CometChatTheme({ palette });
    setTheme(newTheme);
  }

  let ccContextValue = useMemo(() => ({ theme }), [theme]);

  function getLoadingModal() {
    return (
      <div style={loadingModalStyle(interestingAsyncOpStarted)}>
        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            rowGap: "8px",
          }}
        >
          <img
            src={CometChatLogo}
            alt="CometChat logo"
            style={{
              width: "240px",
              height: "240px",
            }}
          />
          <img src={LoadingIconGif} alt="Laoding icon" />
        </div>
      </div>
    );
  }

  function getLogin() {
    return (
      <Login
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        setInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getSignup() {
    return (
      <Signup
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        setInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getHome() {
    return (
      <Home
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        setInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
        toggleTheme={toggleTheme}
      />
    );
  }

  function getChatsModule() {
    return <ChatsCardList />;
  }

  function getMessagesModule() {
    return <MessagesCardList />;
  }

  function getUsersModule() {
    return <UsersCardList />;
  }

  function getGroupsModule() {
    return <GroupsCardList />;
  }

  function getSharedModule() {
    return <SharedCardList />;
  }

  function getConversations() {
    return <CometChatConversations />;
  }

  function getConversationsWithMessages() {
    return <ConversationsWithMessagesWrapper isMobileView={isMobileView} />;
  }

  function getUsersWithMessages() {
    return <CometChatUsersWithMessages isMobileView={isMobileView} />;
  }

  function getUsers() {
    return <CometChatUsers />;
  }

  function getUserDetails() {
    return (
      <UserDetails
        setInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getGroupsWithMessages() {
    return <CometChatGroupsWithMessages isMobileView={isMobileView} />;
  }

  function getGroups() {
    return <CometChatGroups />;
  }

  function getGroupMembersWrapper() {
    return (
      <GroupMembersWrapper
        setSomeInterestingAsyncOperation={setInterestingAsyncOpStarted}
      />
    );
  }

  function getAddMembersWrapper() {
    return (
      <AddMembersWrapper
        setSomeInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getTransferOwnershipWrapper() {
    return (
      <TransferOnwershipWrapper
        setSomeInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getBannedMembersWrapper() {
    return (
      <BannedMembersWrapper
        setSomeInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getGroupDetails() {
    return (
      <GroupDetails
        setSomeInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getMessageHeaderWrapper() {
    return (
      <MessageHeaderWrapper
        setSomeInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getComposerWrapper() {
    return (
      <ComposerWrapper
        setSomeInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getMessageListWrapper() {
    return (
      <MessageListWrapper
        setSomeInterestingOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getMessagesWrapper() {
    return (
      <MessagesWrapper
        setSomeInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getCreateGroupWrapper() {
    return <CreateGroupWrapper isMobileView={isMobileView} />;
  }

  function getJoinProtectedGroupWrapper() {
    return <JoinGroupWrapper />;
  }

  function getCallsModule() {
    return <CallsCardList />;
  }

  function getCallButtonsWrapper() {
    return (
      <CallButtonsWrapper
        setSomeInterestingAsyncOpStarted={setInterestingAsyncOpStarted}
      />
    );
  }

  function getCallLogsWrapper() {
    return (
      <CallLogsWrapper isMobileView={false} />
    );
  }

  function getCallLogsWithDetailsWrapper() {
    return (
      <CallLogsWithDetailsWrapper
      isMobileView={false}
      />
    );
  }

  function getCallLogDetails(){
    return (
      <CallLogDetailsWrapper
      isMobileView={false}
      />
    );
  }

  function getCallLogHistory(){
    return (
      <CallLogHistoryWrapper
      isMobileView={false}
      />
    );
  }

  function getCallLogRecordings(){
    return (
      <CallLogRecordingsWrapper
      isMobileView={false}
      />
    );
  }

  function getCallLogParticipants(){
    return (
      <CallLogParticipantsWrapper
      isMobileView={false}
      />
    );
  }


  function getContacts() {
    return <ContactsWrapper />;
  }

  function getMessageInformation() {
    return <MessageInformationWrapper />;
  }

  Effects({
    setLoggedInUser,
    setIsMobileView,
  });
  return (
    <div style={appStyle(theme)}>
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            height: "100px",
            width: "800px",
          }}
        ></div>
      </div>
      <div
        style={{
          boxSizing: "border-box",
          height: "100%",
          width: "100%",
          position: "absolute",
          top: "0",
          left: "0",
          backgroundColor: "white",
        }}
      >
        <IsMobileViewContext.Provider value={isMobileView}>
          <CometChatThemeContext.Provider value={ccContextValue}>
            <BrowserRouter>
              <Routes>
                <Route path="/">
                  <Route index element={<Navigate to="/home" />} />
                  <Route path="login" element={getLogin()} />
                  <Route path="signup" element={getSignup()} />
                  <Route path="home" element={getHome()}>
                    <Route index element={getChatsModule()} />
                    <Route path="chats-module" element={getChatsModule()} />
                    <Route path="calls-module" element={getCallsModule()} />
                    <Route
                      path="messages-module"
                      element={getMessagesModule()}
                    />
                    <Route path="users-module" element={getUsersModule()} />
                    <Route path="groups-module" element={getGroupsModule()} />
                    <Route path="shared-module" element={getSharedModule()} />
                  </Route>
                </Route>
                <Route
                  path="home/chats-module/conversations-with-messages"
                  element={getConversationsWithMessages()}
                />
                <Route
                  path="home/chats-module/conversations"
                  element={getConversations()}
                />
                <Route
                  path="home/chats-module/contacts"
                  element={getContacts()}
                />
                <Route
                  path="home/calls-module/call-buttons"
                  element={getCallButtonsWrapper()}
                />
                <Route
                  path="home/users-module/users-with-messages"
                  element={getUsersWithMessages()}
                />
                <Route path="home/users-module/users" element={getUsers()} />
                <Route
                  path="home/users-module/user-details"
                  element={getUserDetails()}
                />
                <Route
                  path="home/groups-module/groups-with-messages"
                  element={getGroupsWithMessages()}
                />
                <Route path="home/groups-module/groups" element={getGroups()} />
                <Route
                  path="home/groups-module/group-members"
                  element={getGroupMembersWrapper()}
                />
                <Route
                  path="home/groups-module/create-group"
                  element={getCreateGroupWrapper()}
                />
                <Route
                  path="home/groups-module/add-members"
                  element={getAddMembersWrapper()}
                />
                <Route
                  path="home/groups-module/transfer-ownership"
                  element={getTransferOwnershipWrapper()}
                />
                <Route
                  path="home/groups-module/banned-members"
                  element={getBannedMembersWrapper()}
                />
                <Route
                  path="home/groups-module/group-details"
                  element={getGroupDetails()}
                />
                <Route
                  path="home/groups-module/join-protected-group"
                  element={getJoinProtectedGroupWrapper()}
                />
                <Route
                  path="home/messages-module/message-header"
                  element={getMessageHeaderWrapper()}
                />
                <Route
                  path="home/messages-module/message-composer"
                  element={getComposerWrapper()}
                />
                <Route
                  path="home/messages-module/message-list"
                  element={getMessageListWrapper()}
                />
                <Route
                  path="home/messages-module/messages"
                  element={getMessagesWrapper()}
                />
                <Route
                  path="home/messages-module/message-information"
                  element={getMessageInformation()}
                />
                <Route 
                  path="home/calls-module/call-logs" 
                  element={ getCallLogsWrapper()} 
                />
                <Route 
                  path="home/calls-module/call-logs-with-details" 
                  element={ getCallLogsWithDetailsWrapper()}
                />
                <Route 
                  path="home/calls-module/call-log-details" 
                  element={ getCallLogDetails()}
                />
                <Route 
                  path="home/calls-module/call-log-history" 
                  element={ getCallLogHistory()}
                />
                <Route 
                  path="home/calls-module/call-log-recordings" 
                  element={ getCallLogRecordings()}
                />
                <Route 
                  path="home/calls-module/call-log-participants" 
                  element={ getCallLogParticipants()}
                />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </BrowserRouter>
          </CometChatThemeContext.Provider>
        </IsMobileViewContext.Provider>
        {getLoadingModal()}
      </div>
    </div>
  );
}
