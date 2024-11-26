import {
  JSX,
  useCallback,
  useReducer,
  useRef,
  useState,
} from "react";

import { CometChat, User } from "@cometchat/chat-sdk-javascript";
import { CometChatCheckbox } from "../BaseComponents/CometChatCheckbox/CometChatCheckbox";
import { CometChatList } from "../BaseComponents/CometChatList/CometChatList";
import { CometChatListItem } from "../BaseComponents/CometChatListItem/CometChatListItem";
import { CometChatRadioButton } from "../BaseComponents/CometChatRadioButton/CometChatRadioButton";
import { useCometChatUsers } from "./useCometChatUsers";
import { UsersManager } from "./controller";
import { useCometChatErrorHandler } from "../../CometChatCustomHooks";
import { SelectionMode, States } from "../../Enums/Enums";
import { CometChatOption } from "../../modals/CometChatOption";
import { localize } from "../../resources/CometChatLocalize/cometchat-localize";
import { CometChatContextMenu } from "../BaseComponents/CometChatContextMenu/CometChatContextMenu";
import { CometChatActionsIcon, CometChatActionsView } from "../../modals";
import emptyIcon from "../../assets/user_empty.svg";
import emptyIconDark from "../../assets/user_empty_dark.svg";
import errorIcon from "../../assets/list_error_state_icon.svg"
import errorIconDark from "../../assets/list_error_state_icon_dark.svg"
import { getThemeMode } from "../../utils/util";

export interface UsersProps {
  /**
   * Title of the component
   *
   * @defaultValue `localize("USERS")`
   */
  title?: string;
  /**
   * Hide the search bar
   *
   * @defaultValue `false`
   */
  hideSearch?: boolean;

  /**
   * Text to be displayed when the search input has no value
   *
   * @defaultValue `localize("SEARCH")`
   */
  searchPlaceholderText?: string;
  /**
   * Custom list item view to be rendered for each user in the fetched list
   */
  listItemView?: (user: CometChat.User) => JSX.Element;
  /**
   * Show alphabetical header
   *
   * @defaultValue `true`
   */
  showSectionHeader?: boolean;
  /**
   * Property on the user object
   *
   * @remarks
   * This property will be used to extract the section header character from the user object
   *
   * @defaultValue `getName`
   */
  sectionHeaderKey?: keyof CometChat.User;
  /**
   * Custom view for the loading state of the component
   */
  loadingStateView?: JSX.Element;
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
   * Custom view for the error state of the component
   */
  errorStateView?: JSX.Element;
  /**
   * Custom view for the empty state of the component
   */
  emptyStateView?: JSX.Element;
  /**
   * Custom subtitle view to be rendered for each user in the fetched list
   *
   * @remarks
   * This prop is used if `listItemView` prop is not provided
   */
  subtitleView?: (user: CometChat.User) => JSX.Element;
  /**
   * Hide user presence
   *
   * @remarks
   * If set to true, the status indicator of the default list item view is not displayed
   *
   * @defaultValue `false`
   */
  disableUsersPresence?: boolean;
  /**
   * Custom view to render on the top-right of the component
   */
  menu?: JSX.Element;
  /**
   * List of actions available on mouse over on the default list item component
   */
  options?: (user: CometChat.User) => CometChatOption[];
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
   * Function to call when a user from the fetched list is selected
   *
   * @remarks
   * This prop is used if `selectionMode` prop is not `SelectionMode.none`
   */
  onSelect?: (users: CometChat.User, selected: boolean) => void;
  /**
   * Request builder to fetch users
   *
   * @remarks
   * If the search input is not empty and the `searchRequestBuilder` prop is not provided,
   * the search keyword of this request builder is set to the text in the search input
   *
   * @defaultValue Default request builder having the limit set to 30
   */
  usersRequestBuilder?: CometChat.UsersRequestBuilder;
  /**
   * Request builder with search parameters to fetch users
   *
   * @remarks
   * If the search input is not empty,
   * the search keyword of this request builder is set to the text in the search input
   */
  searchRequestBuilder?: CometChat.UsersRequestBuilder;
  /**
   * Function to call on click of the default list item view of a user
   */
  onItemClick?: (user: CometChat.User) => void;
  /**
   * Function to call whenever the component encounters an error
   */
  onError?: ((error: CometChat.CometChatException) => void) | null;
  /**
   * User to highlight
   *
   * @remarks
   * This prop is used if `listItemView` prop is not provided
   */
  activeUser?: CometChat.User;
  /**
   * Search keyword to filter the list of users.
   *
   * @defaultValue `""`
   */
  searchKeyword?: string;
  /**
   * Callback function to be executed when the user list is empty.
   */
  onEmpty?: () => void;

  /**
   * Flag to indicate whether users are currently being fetched.
   *
   * @defaultValue `false`
   */
  fetchingUsers?: boolean;
  /**
   * Flag to indicate whether to disable loading state while fetching users.
   * @defaultValue `false`
   */
  disableLoadingState?: boolean;
}

type State = {
  searchText: string;
  userList: CometChat.User[];
  fetchState: States;
  isFirstReload: boolean;
  fetchingUsers: boolean;
  disableLoadingState: boolean;
};

export type Action =
  | { type: "setSearchText"; searchText: State["searchText"] }
  | {
    type: "appendUsers";
    users: CometChat.User[];
    removeOldUsers?: boolean;
    usersManager?: UsersManager | null;
    onEmpty?: () => void;
  }
  | { type: "setFetchState"; fetchState: States }
  | { type: "setUserList"; userList: CometChat.User[] }
  | { type: "updateUser"; user: CometChat.User }
  | { type: "setIsFirstReload"; isFirstReload: boolean };

function stateReducer(state: State, action: Action): State {
  let newState = state;
  const { type } = action;
  switch (type) {
    case "setSearchText":
      newState = { ...state, searchText: action.searchText };
      break;
    case "appendUsers":
      let users: CometChat.User[] = [];
      if (action.removeOldUsers) {
        if (!state.disableLoadingState) {
          state.userList = [];
        }
        users = action.users;
        if (!state.disableLoadingState) {
          newState = { ...state, userList: users };
        }
      } else {
        if (
          action.usersManager &&
          [0].includes(action.usersManager?.getCurrentPage()) &&
          !action.users.length
        ) {
          if (!action.users.length && action.onEmpty) {
            setTimeout(() => {
              action.onEmpty!();
            });
            newState = {
              ...state,
              fetchState: States.empty,
            };
          }
        } else if (action.users.length !== 0) {
          newState = {
            ...state,
            userList:
              action.usersManager?.getCurrentPage() == 1
                ? [...action.users]
                : [...state.userList, ...action.users],
          };
        }
      }
      break;
    case "setUserList":
      newState = { ...state, userList: action.userList };
      break;
    case "setFetchState":
      newState = { ...state, fetchState: action.fetchState };
      break;
    case "updateUser": {
      const { userList } = state;
      const { user: targetUser } = action;
      const targetUserUid = targetUser.getUid();
      const targetIdx = userList.findIndex(
        (user) => user.getUid() === targetUserUid
      );
      if (targetIdx > -1) {
        newState = {
          ...state,
          userList: userList.map((user, i) => {
            return i === targetIdx ? targetUser : user;
          }),
        };
      }
      break;
    }
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
 * Renders a scrollable list of users that has been created in a CometChat app
 */
export function CometChatUsers(props: UsersProps) {
  const {
    title = localize("USERS"),
    hideSearch = false,
    searchPlaceholderText = localize("SEARCH"),
    listItemView = null,
    showSectionHeader = true,
    sectionHeaderKey = "getName",
    loadingStateView, // Will use the default provided by CometChatList if undefined
    hideError = false,
    errorStateView, // Will use the default provided by CometChatList if undefined
    emptyStateView, // Will use the default provided by CometChatList if undefined
    subtitleView = null,
    disableUsersPresence = false,
    menu,
    options = null,
    selectionMode = SelectionMode.none,
    onSelect, // Won't use if undefined
    usersRequestBuilder = null,
    searchRequestBuilder = null,
    onItemClick, // Won't use if undefined
    onError,
    activeUser = null,
    searchKeyword = "",
    onEmpty,
    fetchingUsers = false,
    disableLoadingState = false,
  } = props;

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [state, dispatch] = useReducer(stateReducer, {
    searchText: "",
    userList: [],
    fetchState: States.loading,
    isFirstReload: false,
    fetchingUsers,
    disableLoadingState: disableLoadingState,
  });
  const errorHandler = useCometChatErrorHandler(onError);
  const usersManagerRef = useRef<UsersManager | null>(null);
  const fetchNextIdRef = useRef("");
  const attachListenerOnFetch = useRef<boolean>(false);
  const isConnectionReestablished = useRef<boolean>(false);
  const usersSearchText = useRef<string>("");
  let isJustMounted = useRef<boolean>(true);
  (() => {
    if (state.searchText && state.searchText !== usersSearchText.current) {
      usersSearchText.current = state.searchText;
    }
    if (state.isFirstReload) {
      attachListenerOnFetch.current = true;
      state.isFirstReload = false;
    }
  })();

  /**
   * Initiates a fetch request and appends the fetched users to the `userList` state
   *
   * @remarks
   * This function also updates the `fetchState` state
   *
   * @param fetchId - Fetch Id to decide if the fetched data should be appended to the `userList` state
   */
  const fetchNextAndAppendUsers = useCallback(
    async (fetchId: string): Promise<void> => {
      const usersManager = usersManagerRef.current;
      if (!usersManager) {
        return;
      }
      let initialState =
        isConnectionReestablished.current ||
          (disableLoadingState && !isJustMounted)
          ? States.loaded
          : States.loading;
      dispatch({ type: "setFetchState", fetchState: initialState });
      try {
        const newUsers = await usersManager.fetchNext();
        if (fetchId !== fetchNextIdRef.current) {
          return;
        }
        let removeOldUsers = isConnectionReestablished.current ? true : false;
        dispatch({
          type: "appendUsers",
          users: newUsers,
          removeOldUsers,
          usersManager,
          onEmpty,
        });
        if (attachListenerOnFetch.current) {
          UsersManager.attachConnestionListener(() => {
            const requestBuilder =
              usersRequestBuilder === null
                ? new CometChat.UsersRequestBuilder().setLimit(30)
                : usersRequestBuilder;
            usersManagerRef.current = new UsersManager({
              searchText: usersSearchText.current,
              usersRequestBuilder: requestBuilder,
              searchRequestBuilder,
              usersSearchText
            });
            isConnectionReestablished.current = true;
          });
          attachListenerOnFetch.current = false;
        }
        if (!isConnectionReestablished.current) {
          dispatch({ type: "setFetchState", fetchState: States.loaded });
        } else {
          isConnectionReestablished.current = false;
        }
      } catch (error: unknown) {
        if (fetchId === fetchNextIdRef.current && state.userList?.length <= 0) {
          dispatch({ type: "setFetchState", fetchState: States.error });
        }
        errorHandler(error);
      }
      isJustMounted.current = false;
    },
    [errorHandler, dispatch]
  );

  /**
   * Updates the `searchText` state
   */
  const onSearch = useCallback(
    (newSearchText: string): void => {
      const trimmedText = newSearchText.trim();
      if (
        newSearchText.length === 0 ||
        (trimmedText.length === newSearchText.length && trimmedText.length > 0)
      ) {
        usersSearchText.current = "";
        dispatch({ type: "setSearchText", searchText: newSearchText });
      }
      // dispatch({type: "setSearchText", searchText: newSearchText});
    },
    [dispatch]
  );

  /**
   * Update the user object if found in the `userList` state
   */
  const updateUser = useCallback(
    (user: CometChat.User): void => {
      dispatch({ type: "updateUser", user });
    },
    [dispatch]
  );

  /**
   * Creates tail view for the default list item view
   */
  function getDefaultListItemTailView(
    user: CometChat.User
  ): JSX.Element | null {
    if (
      selectionMode !== SelectionMode.single &&
      selectionMode !== SelectionMode.multiple
    ) {
      return null;
    }
    let tailViewContent: JSX.Element;
    if (selectionMode === SelectionMode.single) {
      tailViewContent = (
        <CometChatRadioButton
          onRadioButtonChanged={(e) => onSelect?.(user, e.checked)}
        />
      );
    } else {
      tailViewContent = (
        <CometChatCheckbox
          key={user.getUid()}
          checked={selectedUsers.includes(user.getUid()) ? true : false}
          onCheckBoxValueChanged={(e) => {
            onSelect?.(user, e.checked);
            setSelectedUsers((prevState) => {
              if (e.checked) {
                return [...prevState, user.getUid()];
              } else {
                const filteredUsers = prevState.filter((userItr) => {
                  return userItr !== user.getUid();
                })
                return [...filteredUsers];
              }
            })
          }}
        />
      );
    }
    return (
      <>{tailViewContent}</>
    );
  }

  /**
   * Creates menu view for the default list item view
   *
   * @remarks
   * This menu view is shown on mouse over the default list item view.
   * The visibility of this view is handled by the default list item view
   */
  function getDefaultListItemMenuView(
    user: CometChat.User
  ): JSX.Element | null {
    let curOptions: CometChatOption[] | undefined;
    if (!(curOptions = options?.(user))?.length) {
      return null;
    }
    return (
      <CometChatContextMenu
        data={curOptions as unknown as (CometChatActionsIcon | CometChatActionsView)[]}
        onOptionClicked={(data: CometChatOption) => data.onClick?.()}
      />
    );
  }

  /**
   * Creates `listItem` prop of the `CometChatList` component
   */
  function getListItem(): (user: CometChat.User) => JSX.Element {
    if (listItemView) {
      return listItemView;
    }
    return function (user: CometChat.User): JSX.Element {
      const status = user.getStatus();
      const isActive = activeUser?.getUid() === user.getUid();
      return (
        <div
          className={`cometchat-users__list-item cometchat-users__list-item-${status}
                     ${isActive ? `cometchat-users__list-item-active` : ""}
          `}
        >
          <CometChatListItem
            id={user.getUid()}
            avatarURL={user.getAvatar()}
            avatarName={user.getName()}
            title={user.getName()}
            subtitleView={subtitleView?.(user)}
            tailView={getDefaultListItemTailView(user)}
            menuView={getDefaultListItemMenuView(user)}
            onListItemClicked={(e) => {
              onItemClick?.(user);
              setSelectedUsers((prevState) => {
                let userFound = false;
                const filteredUsers = prevState.filter((userItr) => {
                  if (userItr === user.getUid()) {
                    userFound = true;
                  }
                  return userItr !== user.getUid();
                })
                if (userFound) {
                  return [...filteredUsers];
                } else {
                  return [...prevState, user.getUid()];
                }
              })
            }}
          />
        </div>
      );
    };
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
      return loadingStateView
    }
    return <div className="cometchat-users__shimmer">
      {[...Array(15)].map((_, index) => (
        <div key={index} className="cometchat-users__shimmer-item">
          <div className="cometchat-users__shimmer-item-avatar"></div>
          <div className="cometchat-users__shimmer-item-title"></div>
        </div>
      ))}
    </div>
  }

  /**
   * Renders the empty state view when there are no groups to display
   *
   * @remarks
   * If a custom `emptyStateView` is provided, it will be used. Otherwise, a default empty state view with a message is displayed.
   *
   * @returns A JSX element representing the empty state
   */
  const getEmptyStateView = () => {
    const isDarkMode = getThemeMode() == "dark" ? true : false;
    if (emptyStateView) {
      return emptyStateView
    }
    return (
      <div className="cometchat-users__empty-state-view">
        <div className="cometchat-users__empty-state-view-icon">
          <img src={isDarkMode ? emptyIconDark : emptyIcon} alt="" />
        </div>
        <div className="cometchat-users__empty-state-view-body">
          <div className="cometchat-users__empty-state-view-body-title">{localize("NO_USERS_FOUND")}</div>
          <div className="cometchat-users__empty-state-view-body-description">{localize("USERS_EMPTY_STATE_MESSAGE")}</div>
        </div>
      </div>
    )
  }

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
      return errorStateView
    }

    return (
      <div className="cometchat-users__error-state-view">
        <div className="cometchat-users__error-state-view-icon">
          <img src={isDarkMode ? errorIconDark : errorIcon} alt="" />
        </div>
        <div className="cometchat-users__error-state-view-body">
          <div className="cometchat-users__error-state-view-body-title">{localize("OOPS!")}</div>
          <div className="cometchat-users__error-state-view-body-description">{localize("LOOKS_LIKE_SOMETHING_WENT_WRONG")}
          </div>
        </div>
      </div>
    )
  }

  useCometChatUsers({
    usersManagerRef,
    fetchNextAndAppendUsers,
    searchText: state.searchText,
    usersRequestBuilder,
    searchRequestBuilder,
    dispatch,
    updateUser,
    fetchNextIdRef,
    searchKeyword,
    disableLoadingState,
    usersSearchText,
    disableUsersPresence,
  });
  return (
    <div className="cometchat" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <div
        className='cometchat-users'
      >
        <CometChatList
          title={title}
          hideSearch={state.fetchState === States.error || hideSearch}
          searchPlaceholderText={searchPlaceholderText}
          searchText={state.searchText}
          onSearch={onSearch}
          list={state.userList}
          listItem={getListItem()}
          onScrolledToBottom={() =>
            fetchNextAndAppendUsers(
              (fetchNextIdRef.current =
                "onScrolledToBottom_" + String(Date.now()))
            )
          }
          showSectionHeader={showSectionHeader}
          sectionHeaderKey={sectionHeaderKey}
          listItemKey='getUid'
          state={
            state.fetchState === States.loaded &&
              state.userList.length === 0 &&
              !onEmpty
              ? States.empty
              : state.fetchState
          }
          loadingView={getLoadingView()}
          hideError={hideError}
          emptyStateView={getEmptyStateView()}
          errorStateView={getErrorStateView()}
          menu={menu}
        />
      </div>
    </div>
  );
}
