import  {useEffect, useState } from 'react';
import { States } from '../../../Enums/Enums';
import { localize } from '../../../resources/CometChatLocalize/cometchat-localize';
import { AIConversationStarterConfiguration } from './AIConversationStarterConfiguration';
interface IAIConversationStarterProps {
    getConversationStarterCallback?: () => Promise<string[]>
    editReplyCallback?: (reply: string) => void
    configuration?: AIConversationStarterConfiguration
};

const defaultProps: IAIConversationStarterProps = {
    getConversationStarterCallback: undefined,
    editReplyCallback: undefined,
    configuration: undefined
}

const AIConversationStarterView = (props: IAIConversationStarterProps) => {
    const {
        getConversationStarterCallback,
        editReplyCallback,
        configuration,
    } = { ...defaultProps, ...props };

    const [messageListState, setMessageListState] = useState<States>(States.loading);
    const [activeView, setActiveView] = useState<JSX.Element | null>(null);
    const errorStateText: string = localize("LOOKS_LIKE_SOMETHING_WENT_WRONG")

    useEffect(() => {
        fetchButtonContent();
    }, []);

    function fetchButtonContent() {
        setMessageListState(States.loading);
        if (getConversationStarterCallback) {
            getConversationStarterCallback().then(async (response) => {
                if (response) {
                    setMessageListState(States.loaded);
                    setActiveView(await getLoadedView(response));
                } else {
                    setMessageListState(States.empty);
                }
            })
                .catch((err) => {
                    setMessageListState(States.error);
                })
        }
    }

    /**
     * Create a view based on the value of the `state` prop.
     */
    function getStateView(): JSX.Element | null {
        let res: JSX.Element | null = null;
        switch (messageListState) {
            case States.loading:
                res = getLoadingView();
                break;
            case States.error:
                res = getErrorView();
                break;
            case States.empty:
                res = getEmptyView();
                break;
            case States.loaded:
                break;
            default:
                const x: never = messageListState;
        }
        return res;
    }

    /**
     * Creates the loading view
     */
    function getLoadingView(): JSX.Element {
        let LoadingView = configuration?.loadingStateView;
        const shimmerView = (
            <div className="cometchat-conversation-starter__shimmer-container">
                <div className="cometchat-conversation-starter__shimmer-item"></div>
                <div className="cometchat-conversation-starter__shimmer-item"></div>
                <div className="cometchat-conversation-starter__shimmer-item"></div>
            </div>
        );

        if (LoadingView) {
            return LoadingView
        }
        return shimmerView
    }

   /**
   * Creates the error view
   */
    function getErrorView(): JSX.Element | null {
        let ErrorView = configuration?.errorStateView;

        if (ErrorView) {
            return ErrorView
        }
        return (
            <div className="cometchat-ai-conversation-stater__error-view">
                {errorStateText}
            </div>
        );
    }

    /**
     * Creates the empty view
     */
    function getEmptyView(): JSX.Element {
        let EmptyView = configuration?.emptyStateView;

        if (EmptyView) {
            return EmptyView
        }

        return <></>
    }

    /**
     * Creates the loaded view
     */
    async function getLoadedView(conversationStarters: string[]): Promise<JSX.Element> {
        return new Promise((resolve, reject) => {
            try {
                let CustomView = configuration?.customView;

                if (CustomView) {
                    configuration?.customView!(conversationStarters).then((res: any) => {
                        return resolve(res);
                    })
                        .catch((err: CometChat.CometChatException) => {
                            return reject(err)
                        })
                } else {
                    let conversationStarterView = (<>
                        {conversationStarters && conversationStarters.map((reply, index) => (
                            <div key={reply} className="cometchat-conversation-starter__item">
                                <button
                                    className="cometchat-conversation-starter__item-button"
                                    onClick={() => editReplyCallback && editReplyCallback(reply)} >{reply}</button>
                            </div>
                        ))}
                    </>)
                    return resolve(conversationStarterView);
                }
            } catch (e) {
                reject(e);
            }
        })
    }

    return (
        <div className="cometchat" style={{ width: "100%", height: "100%" }}>
            <div className="cometchat-ai-conversation-starter">
                {messageListState === States.loaded ? activeView : getStateView()}
            </div>
        </div>
    );
};

export { AIConversationStarterView };
