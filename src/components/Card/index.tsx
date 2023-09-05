import { CSSProperties, useContext } from "react";
import { arrowImageStyle, cardStyle, descriptionStyle, iconStyle, textContentContainerStyle, titleStyle } from "./style";

import { CometChatThemeContext } from "@cometchat/chat-uikit-react";
import RightArrow from "../../assets/right-arrow.png";

export interface ICardProps {
    title : string,
    description : string,
    onClick : () => void,
    imageInfo? : {url : string, altText : string},
    cardContainerStyle? : CSSProperties
};

export function Card(props : ICardProps) {
    const {
        title,
        description,
        onClick,
        imageInfo,
        cardContainerStyle
    } = props;

    const { theme } = useContext(CometChatThemeContext);

    function getImage() {
        if (!imageInfo) {
            return null;
        }
        return (
            <span
                style = {{
                    flexShrink: "1"
                }}
            >
                <cometchat-icon 
                    URL = {imageInfo.url}
                    iconStyle = {JSON.stringify(iconStyle(theme))}
                />
            </span>
        );
    }

    function getTextContent() {
        return (
            <div
                style = {textContentContainerStyle()}
            >
                <div
                    style = {titleStyle(theme)}
                >
                    {title}
                </div>
                <div
                    style = {descriptionStyle(theme)}
                >
                    {description}
                </div>
            </div>
        );
    }

    function getArrow() {
        if (imageInfo) {
            return null;
        }
        return (
            <img 
                src = {RightArrow}
                alt = "Right arrow"
                style = {arrowImageStyle()}
            />
        );
    }

    return (
        <button
            onClick = {onClick}
            style = {cardStyle(cardContainerStyle, theme)}
        >
            {getImage()}
            {getTextContent()}
            {getArrow()}
        </button>
    );
}
