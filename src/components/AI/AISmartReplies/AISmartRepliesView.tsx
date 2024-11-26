/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useContext, useEffect, useState } from 'react';
import { States } from '../../../Enums/Enums';
import { localize } from '../../../resources/CometChatLocalize/cometchat-localize';
import { AISmartRepliesConfiguration } from './AISmartRepliesConfiguration';

interface IAISmartRepliesProps {
    title: string
    getSmartRepliesCallback?: () => Promise<Object>
    editReplyCallback?: (reply: string) => void
    closeCallback?: () => void
    backCallback?: () => void
    configuration?: AISmartRepliesConfiguration
};

const defaultProps: IAISmartRepliesProps = {
    title: localize("SUGGEST_A_REPLY"),
    getSmartRepliesCallback: undefined,
    editReplyCallback: undefined,
    closeCallback: undefined,
    backCallback: undefined,
    configuration: undefined
}

const AISmartRepliesView = (props: IAISmartRepliesProps) => {
    const {
        title,
        getSmartRepliesCallback,
        editReplyCallback,
        closeCallback,
        backCallback,
        configuration,
    } = { ...defaultProps, ...props };

    const [messageListState, setMessageListState] = useState<States>(States.loading);
    const [activeView, setActiveView] = useState<JSX.Element | null>(null);


    const errorStateText: string = localize("LOOKS_LIKE_SOMETHING_WENT_WRONG");
    const emptyStateText: string = localize("NO_SUGGESTIONS_AVAILABLE");

    useEffect(() => {
        fetchButtonContent();
    }, []);

    function fetchButtonContent() {
        setMessageListState(States.loading);
        if (getSmartRepliesCallback) {
            getSmartRepliesCallback().then(async (response) => {
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

        if (LoadingView) {
            return LoadingView
        }

        return (
            <>
                <div className="cometchat-ai-smart-replies__shimmer-item">
                </div>
                <div className="cometchat-ai-smart-replies__shimmer-item">
                </div>
                <div className="cometchat-ai-smart-replies__shimmer-item">
                </div>
            </>)
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
            <div className="cometchat-ai-smart-replies__error-view">
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
        return (
            <div className="cometchat-ai-smart-replies__empty-view">
                {emptyStateText}
            </div>
        );
    }

    /**
     * Creates the loaded view
     */
    async function getLoadedView(smartReplies: any): Promise<JSX.Element> {
        return new Promise((resolve, reject) => {
            try {
                let CustomView = configuration?.customView;

                if (CustomView) {
                    configuration?.customView!(smartReplies, closeCallback, backCallback).then((res: any) => {
                        return resolve(res);
                    })
                        .catch((err: CometChat.CometChatException) => {
                            return reject(err)
                        })
                } else {
                    let repliesArray: string[] = [];
                    Object.keys(smartReplies).forEach((reply) => {
                        if (smartReplies[reply] && smartReplies[reply] !== "") {
                            repliesArray.push(smartReplies[reply]);
                        }
                    });
                    let SmartRepliesView = (
                        <div
                            className="cometchat-ai-smart-replies__item-wrapper"
                        >
                            {repliesArray && repliesArray.map((reply, index) => (
                                <div key={index} className="cometchat-ai-smart-replies__item">
                                    <button
                                        className="cometchat-ai-smart-replies__item-button"
                                        onClick={() => {
                                            editReplyCallback ? editReplyCallback(reply) : null;
                                            closeCallback ? closeCallback() : null;
                                        }}
                                    >
                                        {reply}
                                    </button>
                                </div>
                            ))}
                        </div>
                    );
                    return resolve(SmartRepliesView);
                }
            } catch (e) {
                reject(e);
            }
        })
    }

    return (
        <div className="cometchat" style={{ width: "100%", height: "100%" }}>
            <div className="cometchat-ai-smart-replies">
                <div className="cometchat-ai-smart-replies__header">
                    <div className="cometchat-ai-smart-replies__header-title">{title}</div>
                    <button
                        className="cometchat-ai-smart-replies__header-close-button"
                        onClick={backCallback ? () => backCallback() : undefined}
                    />
                </div>
                {messageListState === States.loaded ? activeView : getStateView()}
            </div>
        </div>
    );
};

export { AISmartRepliesView };
