import { componentDetailModalCloseIconStyle, componentDetailsModalCloseIconWrapperStyle, componentDetailsModalDescriptionStyle, componentDetailsModalHeaderStyle, componentDetailsModalStyle, componentDetailsModalTitleStyle, loadingComponentModalStyle } from "../../style";

import CloseIcon from "../assets/close2x.png";
import {CometChatThemeContext} from "@cometchat/chat-uikit-react"
import SampleImg from "./astro.png"
import { useContext } from "react";

const ImageBubble = (props:any) => {
    const {
        activeComponent,
        handleCloseComponentModal,
        showComponentModal,
    } = props;
    let showModal = false;
    const bubbleSlug = "image-bubble"
    if(showComponentModal && activeComponent === bubbleSlug)
        showModal = true

        const imageStyle = {height:"auto",maxHeight:"300px", width:"100%",borderRadius:"8px",margin: "auto", display: "block"}
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
                    <div style={componentDetailsModalTitleStyle}>Image Bubble</div>
                    <div onClick={handleCloseComponentModal} style={componentDetailsModalCloseIconWrapperStyle}><img style={componentDetailModalCloseIconStyle} alt="closeIcon" src={CloseIcon} /></div>
                </div>
                <div style={componentDetailsModalDescriptionStyle}>
                CometChatImageBubble displays a media message containing an image.
                </div>
                <div className="imageBubbleWrapper" style={{margin: "0 auto",marginTop: "15px", marginBottom: "15px",}}>
                  <cometchat-image-bubble src={SampleImg} imageStyle={JSON.stringify(imageStyle)}/>
                </div>
              </div>
             </div>)

}
export { ImageBubble };