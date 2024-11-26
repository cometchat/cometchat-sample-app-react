import { useCallback, useRef, useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useCometChatTransferOwnership } from "./useCometChatTransferOwnership";
import SearchIcon from "../../assets/search.svg";
import SpinnerIcon from "../../assets/spinnerIcon.svg";
import '../../styles/CometChatTransferOwnership/CometChatTransferOwnership.css';
import { CometChatButton, CometChatGroupEvents, CometChatGroupMembers, CometChatOption, CometChatRadioButton, CometChatUIKitConstants, CometChatUIKitUtility, SelectionMode, TitleAlignment, localize, useCometChatErrorHandler, useRefSync } from "@cometchat/chat-uikit-react";

interface ITransferOwnershipProps {
    /**
     * Group to transfer ownership of
     */
    group: CometChat.Group,
    /**
     * Title of the component
     *
     * @defaultValue `localize("TRANSFER_OWNERSHIP")`
    */
    title?: string,
    /**
     * Alignment of the `title` text
     *
     * @defaultValue `TitleAlignment.center`
     */
    titleAlignment?: TitleAlignment,
    /**
     * Image URL for the search icon to use in the search bar
     *
     * @defaultValue `../../assets/search.svg`
     */
    searchIconURL?: string,
    /**
     * Text to be displayed when the search input has no value
     *
     * @defaultValue `localize("SEARCH")`
     */
    searchPlaceholderText?: string,
    /**
     * Hide the search bar
     *
     * @defaulValue `false`
     */
    hideSearch?: boolean,
    /**
     * Request builder to fetch group members
     *
     * @remarks
     * If the search input is not empty and the `searchRequestBuilder` prop is not provided,
     * the search keyword of this request builder is set to the text in the search input
     *
     * @defaultValue Default request builder having the limit set to 30
     */
    groupMembersRequestBuilder?: CometChat.GroupMembersRequestBuilder,
    /**
     * Request builder with search parameters to fetch group members
     *
     * @remarks
     * If the search input is not empty,
     * the search keyword of this request builder is set to the text in the search input
     */
    searchRequestBuilder?: CometChat.GroupMembersRequestBuilder,
    /**
     * Image URL for the default loading view
     *
     * @defaultValue `../../assets/spinner.svg`
     */
    loadingIconURL?: string,
    /**
     * Custom view for the loading state of the component
     */
    loadingStateView?: JSX.Element,
    /**
     * Text to display in the default empty view
     *
     * @defaultValue `localize("NO_USERS_FOUND")`
     */
    emptyStateText?: string,
    /**
     * Custom view for the empty state of the component
     */
    emptyStateView?: JSX.Element,
    /**
     * Text to display in the default error view
     *
     * @defaultValue `localize("SOMETHING_WRONG")`
     */
    errorStateText?: string,
    /**
     * Custom view for the error state of the component
     */
    errorStateView?: JSX.Element,
    /**
     * Function to call whenever the component encounters an error
     */
    onError?: ((error: CometChat.CometChatException) => void) | null,
    /**
     * Hide the separator at the bottom of the default list item view
     *
     * @defaultValue `false`
     */
    hideSeparator?: boolean,
    /**
     * Hide user presence
     *
     * @remarks
     * If set to true, the status indicator of the default list item view is not displayed
     *
     * @defaultValue `false`
     */
    disableUsersPresence?: boolean,
    /**
     * Image URL for the close button
     *
     * @defaultValue `../../assets/close2x.svg`
     */
    closeButtonIconURL?: string,
    /**
     * Function to call when the close button is clicked
     */
    onClose?: () => void,
    /**
     * Custom list item view to be rendered for each group member in the fetched list
     */
    listItemView?: (groupMember: CometChat.GroupMember) => JSX.Element,
    /**
     * Custom subtitle view to be rendered for each group member in the fetched list
     *
     * @remarks
     * This prop is used if `listItemView` prop is not provided
     */
    subtitleView?: (groupMember: CometChat.GroupMember) => JSX.Element,
    // Later
    transferButtonText?: string,
    // Later
    onTransferOwnership?: (groupMember: CometChat.GroupMember) => void,
    /**
     * Text to display for the cancel button
     */
    cancelButtonText?: string,
    /**
     * List of actions available on mouse over on the default list item component
     */
    options?: (group: CometChat.Group, groupMember: CometChat.GroupMember) => CometChatOption[],
};

/**
 * Renders transfer ownership view related to a group of a CometChat App
 */
export function CometChatTransferOwnership(props: ITransferOwnershipProps) {
    const {
        group,
        title = localize("TRANSFER_OWNERSHIP"),
        titleAlignment = TitleAlignment.center,
        searchIconURL = SearchIcon,
        searchPlaceholderText = localize("SEARCH"),
        hideSearch = false,
        groupMembersRequestBuilder,
        searchRequestBuilder,
        loadingIconURL = SpinnerIcon,
        loadingStateView,
        emptyStateText = localize("NO_USERS_FOUND"),
        emptyStateView,
        errorStateText = localize("SOMETHING_WRONG"),
        errorStateView,
        onError,
        hideSeparator = false,
        disableUsersPresence = false,
        closeButtonIconURL,
        onClose,
        listItemView,
        subtitleView,
        transferButtonText = localize("TRANSFER"),
        onTransferOwnership,
        cancelButtonText = localize("CANCEL"),
        options,
    } = props;

    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const selectedMemberRef = useRef<CometChat.GroupMember | null>(null);
    const errorHandler = useCometChatErrorHandler(onError);
    const onTransferOwnershipPropRef = useRefSync(onTransferOwnership);
    const groupPropRef = useRefSync(group);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    /**
     * Changes `selectedMemberRef` reference
     */
    function onSelect(groupMember: CometChat.GroupMember): void {
        if (isDisabled) {
            setIsDisabled(false);
        }
        selectedMemberRef.current = groupMember;
    }

    /**
     * Creates tail view
     */
    function tailView(groupMember: CometChat.GroupMember): JSX.Element {
        const scope = group.getOwner() === groupMember.getUid() ? CometChatUIKitConstants.groupMemberScope.owner : groupMember.getScope();
        if (group.getOwner() === groupMember.getUid()) {
            return <></>;
        } else {
            return (
                <div>
                    <CometChatRadioButton
                        name={"transfer-ownership"}
                        id={groupMember.getUid()}
                        labelText={localize(scope.toUpperCase())}
                        onRadioButtonChanged={() => onSelect(groupMember)}
                    />
                </div>
            );
        }
    }

    /**
     * Provides a default behavior to the `onTransferOwnership` prop
     */
    const onTransferOwnershipWrapper = useCallback(async (): Promise<void> => {
        const selectedMember = selectedMemberRef.current;
        if (!selectedMember) {
            return;
        }
        setIsError(false);
        setIsLoading(true);
        try {
            const currentGroup = groupPropRef.current;
            await CometChat.transferGroupOwnership(currentGroup.getGuid(), selectedMember.getUid());
            setIsLoading(false);
            if (loggedInUser) {
                const groupClone = CometChatUIKitUtility.clone(currentGroup);
                groupClone.setOwner(selectedMember.getUid());
                CometChatGroupEvents.ccOwnershipChanged.next({
                    group: groupClone,
                    newOwner: CometChatUIKitUtility.clone(selectedMember)
                });
                if (onClose) {
                    onClose()
                }
            }
            selectedMemberRef.current = null;
        }
        catch (error) {
            setIsLoading(false);
            setIsError(true);
            errorHandler(error);
        }
    }, [errorHandler, loggedInUser, groupPropRef, onTransferOwnershipPropRef]);

    /**
     * Creates confirm button view
     */
    function getConfirmButtonView(): JSX.Element {
        return (
            <div className={`cometchat-transfer-ownership__transfer-button ${isDisabled ? "cometchat-transfer-ownership__transfer-button-disabled" : ""}`}>
                <CometChatButton
                    text={transferButtonText}
                    disabled={isDisabled}
                    isLoading={isLoading}
                    onClick={onTransferOwnershipWrapper}
                />
            </div>

        );
    }

    /**
     * Creates cancel button view
     */
    function getCancelButtonView(): JSX.Element {
        return (
            <div className="cometchat-transfer-ownership__cancel-button">
                <CometChatButton
                    text={cancelButtonText}
                    onClick={onClose}
                />
            </div>
        );
    }

    useCometChatTransferOwnership({
        errorHandler,
        setLoggedInUser
    });

    return (
        <div
            className="cometchat-transfer-ownership"
        >
            <CometChatGroupMembers
                menu={undefined}
                hideError={undefined}
                onItemClick={undefined}
                options={options}
                group={group}
                title={title}
                searchPlaceholderText={searchPlaceholderText}
                hideSearch={hideSearch}
                groupMemberRequestBuilder={groupMembersRequestBuilder}
                searchRequestBuilder={searchRequestBuilder}
                loadingStateView={loadingStateView}
                emptyStateView={emptyStateView}
                errorStateView={errorStateView}
                onError={errorHandler}
                disableUsersPresence={disableUsersPresence}
                selectionMode={SelectionMode.none}
                listItemView={listItemView}
                subtitleView={subtitleView}
                tailView={tailView}
            />
         
            <div className="cometchat-transfer-ownership__buttons-wrapper">
            {isError ?   <div className="cometchat-transfer-ownership_error-view">
                    {localize("SOMETHING_WRONG")}
                </div> : null}
               <div className="cometchat-transfer-ownership__buttons">
               {getCancelButtonView()}
               {getConfirmButtonView()}
               </div>

            </div>
        </div>
    );
}
