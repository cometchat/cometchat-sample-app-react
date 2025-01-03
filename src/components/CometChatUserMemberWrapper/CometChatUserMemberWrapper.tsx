import { CSSProperties, useContext } from 'react';
import { CometChatUsers } from '../CometChatUsers/CometChatUsers';
import { CometChatGroupMembers } from '../CometChatGroupMembers/CometChatGroupMembers';
import { UserMemberListType } from '../../Enums/Enums';


export interface MentionsProps {
  userMemberListType?: UserMemberListType;
  onItemClick?: (user: CometChat.User | CometChat.GroupMember) => void;
  listItemView?: (item?: CometChat.User | CometChat.GroupMember) => JSX.Element
  statusIndicatorStyle?: CSSProperties;
  searchKeyword?: string;
  group?: CometChat.Group;
  subtitleView?: (item?: CometChat.User | CometChat.GroupMember) => JSX.Element;
  usersRequestBuilder?: CometChat.UsersRequestBuilder;
  disableUsersPresence?: boolean;
  hideSeparator?: boolean;
  loadingStateView?: JSX.Element;
  onEmpty?: () => void;
  groupMemberRequestBuilder?: CometChat.GroupMembersRequestBuilder;
  loadingIconUrl?: string;
  disableLoadingState?: boolean,
  onError?: () => void;
}

export function CometChatUserMemberWrapper(props: MentionsProps) {
  const {
    userMemberListType = UserMemberListType.users,
    onItemClick,
    listItemView,
    statusIndicatorStyle,
    searchKeyword,
    group,
    subtitleView,
    usersRequestBuilder,
    loadingStateView,
    onEmpty,
    groupMemberRequestBuilder,
    loadingIconUrl,
    disableLoadingState = false,
    hideSeparator = false,
    onError,
    disableUsersPresence
  } = props;





  return (
    <>
      {userMemberListType === UserMemberListType.users && (
        <CometChatUsers
          hideSearch={true}
          showSectionHeader={false}
          onItemClick={onItemClick}
          searchKeyword={searchKeyword}
          itemView={listItemView}
          usersRequestBuilder={usersRequestBuilder}
          subtitleView={subtitleView}
          onEmpty={onEmpty}
          onError={onError}
          disableLoadingState={true}
        />
      )}

      {userMemberListType === UserMemberListType.groupmembers && group && (
        <CometChatGroupMembers
          group={group}
          hideSearch={true}
          groupMemberRequestBuilder={groupMemberRequestBuilder}
          onItemClick={onItemClick}
          searchKeyword={searchKeyword}
          itemView={listItemView}
          subtitleView={subtitleView}
          onEmpty={onEmpty}
          trailingView={(entity: CometChat.GroupMember) => { return <></> }}
          onError={onError}
          disableLoadingState={true}
        />
      )}
    </>
  );
}
