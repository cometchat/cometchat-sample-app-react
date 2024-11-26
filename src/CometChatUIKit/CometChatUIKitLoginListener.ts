import { CometChat } from "@cometchat/chat-sdk-javascript";

/**
 * Manages the login state and listener attachment for CometChat users.
 * It is used in CometChatMessageComposer, CometChatMessageList, CometChatMessageInformation components.
 */
export class CometChatUIKitLoginListener {
    private static loggedInUser: CometChat.User | null = null;
    private static listenerID: string = ``;
    private static isAttached: boolean = false;

    /**
     * Sets the currently logged-in user.
     * @param user - The logged-in CometChat user.
     */
    static setLoggedInUser(user: CometChat.User) {
        this.loggedInUser = user;
    }

    /**
     * Retrieves the currently logged-in user.
     * @returns The logged-in CometChat user or null.
     */
    static getLoggedInUser() {
        return this.loggedInUser;
    }

    /**
     * Removes the logged-in user.
     */
    static removeLoggedInUser() {
        this.loggedInUser = null;
    }

    /**
     * Attaches the login listener for CometChat.
     * If a listener is already attached, it is removed before attaching a new one.
     */
    static attachListener() {
        if (this.isAttached) {
            this.removeListener();
            this.isAttached = false;
            this.listenerID = ``;
        }

        this.listenerID = `CometChatLoginListener_${new Date().getTime()}`;
        CometChat.addLoginListener(
            this.listenerID,
            new CometChat.LoginListener({
                loginSuccess: (user: CometChat.User) => {
                    this.setLoggedInUser(user);
                },
                logoutSuccess: () => {
                    this.removeLoggedInUser();
                },
            })
        );
        this.isAttached = true;

    }

    /**
     * Removes the attached login listener.
     */
    static removeListener() {
        if (this.isAttached) {
            CometChat.removeLoginListener(this.listenerID);
            this.isAttached = false;
            this.listenerID = ``;
        }
    }
}