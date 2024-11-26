import { MouseEvent } from "react";
import LoadingIcon from '../../../assets/loading_animation.svg'
interface ButtonProps {
    text?: string,
    hoverText?: string,
    iconURL?: string,
    disabled?: boolean,
    isLoading?: boolean,
    onClick?: (customEvent: CustomEvent<{ event: PointerEvent }>) => void,
};

const CometChatButton = (props: ButtonProps) => {
    const {
        text,
        hoverText,
        iconURL,
        disabled,
        isLoading = false,
        onClick = () => { },
    } = props;

    return (
        <div className="cometchat">
            <button
                onMouseUp={(event) => event?.stopPropagation()}
                onMouseDown={(event) => event?.stopPropagation()}
                className="cometchat-button"
                title={hoverText}
                onClick={(event: CustomEvent<{ event: PointerEvent }> & MouseEvent<HTMLButtonElement>) => onClick(event)}
                disabled={disabled || isLoading}
            >
                {isLoading ? (
                    <img src={LoadingIcon} alt="Loading..." className="cometchat-button__loading-view" />


                ) : (
                    <>
                        <div
                            style={iconURL ? { WebkitMask: `url(${iconURL}) center center no-repeat` } : undefined}
                            className={`${iconURL ? "cometchat-button__icon-default cometchat-button__icon" : "cometchat-button__icon"}`}
                        />
                        {text && <label className="cometchat-button__text">{text}</label>}
                    </>
                )}
            </button>
        </div>
    );
};

export { CometChatButton };
