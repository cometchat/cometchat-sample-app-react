/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useContext, useEffect, useState } from 'react';
import { localize } from '../../../resources/CometChatLocalize/cometchat-localize';
import { States } from '../../../Enums/Enums';
import { AIConversationSummaryConfiguration } from './AIConversationSummaryConfiguration';

interface IAIConversationSummaryProps {
    getConversationSummaryCallback?: () => Promise<string>
    editReplyCallback?: (reply: string) => void
    closeCallback?: () => void
    configuration?: AIConversationSummaryConfiguration
};

const defaultProps: IAIConversationSummaryProps = {
    getConversationSummaryCallback: undefined,
    editReplyCallback: undefined,
    closeCallback: undefined,
    configuration: undefined
}


const AIConversationSummaryView = (props: IAIConversationSummaryProps) => {
    const {
        getConversationSummaryCallback,
        editReplyCallback,
        closeCallback,
        configuration,
    } = { ...defaultProps, ...props };

    const [messageListState, setMessageListState] = useState<States>(States.loading);
    const [activeView, setActiveView] = useState<JSX.Element | null>(null);


    const errorStateText: string = localize("LOOKS_LIKE_SOMETHING_WENT_WRONG");
    const emptyStateText: string = localize("NO_SUMMARY_AVAILABLE");
    const titleText: string = localize("CONVERSATION_SUMMARY");

    useEffect(() => {
        fetchButtonContent();
    }, []);

    function fetchButtonContent() {
        setMessageListState(States.loading);
        if (getConversationSummaryCallback) {
            getConversationSummaryCallback().then(async (response) => {
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
        const shimmerView = (
            <div className="cometchat-ai-conversation-summary__shimmer">
                <div className="cometchat-ai-conversation-summary__shimmer-item"></div>
                <div className="cometchat-ai-conversation-summary__shimmer-item"></div>
                <div className="cometchat-ai-conversation-summary__shimmer-item"></div>
            </div>
        )
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
            <div className="cometchat-ai-conversation-summary__error-view">
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
            <div className="cometchat-ai-conversation-summary__empty-view">
                {emptyStateText}
            </div>
        );
    }

    /**
     * Creates the loaded view
     */
    async function getLoadedView(conversationSummary: string): Promise<JSX.Element> {
        return new Promise((resolve, reject) => {
            try {
                let CustomView = configuration?.customView;

                if (CustomView) {
                    configuration?.customView!(conversationSummary, closeCallback).then((res: any) => {
                        return resolve(res);
                    })
                        .catch((err: CometChat.CometChatException) => {
                            return reject(err)
                        })
                } else {
                    let conversationSummaryView = <React.Fragment>{conversationSummary}</React.Fragment>
                    return resolve(conversationSummaryView);
                }
            } catch (e) {
                reject(e);
            }
        })
    }

    return (
        <div className="cometchat" style={{ width: "100%", height: "100%" }}>
            <div className="cometchat-ai-conversation-summary__wrapper">
                <div className="cometchat-ai-conversation-summary" >
                    <div className="cometchat-ai-conversation-summary__header">
                        <div className="cometchat-ai-conversation-summary__header-title" >
                            {titleText}
                        </div>
                        <button
                            className="cometchat-ai-conversation-summary__header-close-button"
                            onClick={() => closeCallback!()}
                        />
                    </div>
                    <div className="cometchat-ai-conversation-summary__body">
                        {messageListState === States.loaded ? activeView : getStateView()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AIConversationSummaryView };
