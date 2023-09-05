import { componentDetailModalCloseIconStyle, componentDetailsModalCloseIconWrapperStyle, componentDetailsModalDescriptionStyle, componentDetailsModalHeaderStyle, componentDetailsModalStyle, componentDetailsModalTitleStyle, loadingComponentModalStyle } from "../../style";

import CloseIcon from "../assets/close2x.png";
import {CometChatThemeContext} from "@cometchat/chat-uikit-react"
import SampleVideo from "./aurora.mp4"
import { useContext } from "react";

const VideoBubble = (props:any) => {
    const {
        activeComponent,
        handleCloseComponentModal,
        showComponentModal,
    } = props;
    let showModal = false;
    const bubbleSlug = "video-bubble"
    if(showComponentModal && activeComponent === bubbleSlug)
        showModal = true
        const videoStyle = {background: "#e4e1e1",borderRadius:"8px",margin: "auto", display: "block"}
        const { theme } = useContext(CometChatThemeContext);
        const themeMode = theme.palette.mode
    return (
       
        <div
              style = {loadingComponentModalStyle(showModal)}
            >
              <div
              style={componentDetailsModalStyle(themeMode)}
              >
                <div style={componentDetailsModalHeaderStyle}>
                    <div style={componentDetailsModalTitleStyle}>Video Bubble</div>
                    <div onClick={handleCloseComponentModal} style={componentDetailsModalCloseIconWrapperStyle}><img style={componentDetailModalCloseIconStyle} alt="closeIcon" src={CloseIcon} /></div>
                </div>
                <div style={componentDetailsModalDescriptionStyle}>
                CometChatVideoBubble component displays a media message containing a video which is downloadable.
                </div>
                <div className="videoBubbleWrapper" style={{margin: "0 auto",marginTop: "15px", marginBottom: "15px",}}>
                  <cometchat-video-bubble src={SampleVideo} videoStyle={JSON.stringify(videoStyle)}/>
                </div>
              </div>
             </div>)

}
export { VideoBubble };