import { componentDetailModalCloseIconStyle, componentDetailsModalCloseIconWrapperStyle, componentDetailsModalDescriptionStyle, componentDetailsModalHeaderStyle, componentDetailsModalStyle, componentDetailsModalTitleStyle, loadingComponentModalStyle } from "../../style";

import CloseIcon from "../assets/close2x.png";
import {CometChatThemeContext} from "@cometchat/chat-uikit-react"
import { fontHelper } from "@cometchat/uikit-resources";
import { useContext } from "react";

const TextBubble = (props:any) => {
    const {
        activeComponent,
        handleCloseComponentModal,
        showComponentModal,
    } = props;
    let showModal = false;
    const bubbleSlug = "text-bubble"
    if(showComponentModal && activeComponent === bubbleSlug)
        showModal = true
        const { theme } = useContext(CometChatThemeContext);
        const themeMode = theme.palette.mode
        const receiverBubbleStyle = {
            borderRadius:"8px",
            background:theme.palette.getAccent200(),
            textFont: fontHelper(theme.typography.text2),
            textColor: theme.palette.getAccent(),
          }
          const senderBubbleStyle = {
            borderRadius:"8px",
            background:theme.palette.getPrimary(),
            textFont: fontHelper(theme.typography.text2),
            textColor: theme.palette.getAccent("dark"),
          }

    return (
       
        <div
              style = {loadingComponentModalStyle(showModal)}
            >
              <div
              style={componentDetailsModalStyle(themeMode)}
              >
                <div style={componentDetailsModalHeaderStyle}>
                    <div style={componentDetailsModalTitleStyle}>Text Bubble</div>
                    <div onClick={handleCloseComponentModal} style={componentDetailsModalCloseIconWrapperStyle}><img style={componentDetailModalCloseIconStyle} alt="closeIcon" src={CloseIcon} /></div>
                </div>
                <div style={componentDetailsModalDescriptionStyle}>
                CometChatTextBubble component displays a text message.
                </div>
                <div className="textBuddleDemo" style={{display: "block", justifyContent:" space-between"}}>
                  <div className="receiver-text" style={{maxWidth: "100px", width: "fit-content"}}>
                      <cometchat-text-bubble text="heyyyyy" textStyle={JSON.stringify(receiverBubbleStyle)} />
                  </div>
                  <div className="sender-text" style={{maxWidth: "100px", width: "fit-content", float: "right"}}>
                      <cometchat-text-bubble text="hello" textStyle={JSON.stringify(senderBubbleStyle)} />
                  </div>
                </div>
              </div>
             </div>)

}
export { TextBubble };