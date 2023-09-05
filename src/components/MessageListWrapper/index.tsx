import { useEffect, useState } from "react";

import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatMessageList } from "@cometchat/chat-uikit-react";

type MessageListWrapperProps = { setSomeInterestingOpStarted : React.Dispatch<React.SetStateAction<boolean>> };

export function MessageListWrapper(props : MessageListWrapperProps) {
    const [group, setGroup] = useState<CometChat.Group>();
    const [render, setRender] = useState<boolean>(false);
    const { setSomeInterestingOpStarted, ...otherProps } = props;

    useEffect( () => {
            const groupsRequest = new CometChat.GroupsRequestBuilder().setLimit(1).build();
            groupsRequest.fetchNext().then((fetchedGroup)=>{
                    setGroup(fetchedGroup[0]);                    
                }).then(()=>{
                    setTimeout(() => {
                        setRender(true);
                    }, 1000);
                });
    }, [render]);

    return (
        group ? 
        <CometChatMessageList 
            group = {group}
            {...otherProps}
        /> : (<></>)
    );
}
