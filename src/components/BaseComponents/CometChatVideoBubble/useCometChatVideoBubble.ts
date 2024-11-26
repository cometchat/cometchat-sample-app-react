import { useState } from "react";

export const useCometChatVideoBubble = ({
    src = "",
}) => {
    const [posterImage, setPosterImage] = useState("");

    /* 
        The purpose of this function is to update the poster image displayed on the video. 
        It sets the poster on the load event and resets the poster on the error event.
    */
    const updateImage: () => void = () => {
        try {
            setPosterImage("");
            const img = new Image();
            img.onload = () => {
                setPosterImage(img.src);
            };
            img.onerror = () => {
                setPosterImage("");
            };
            img.src = src;
        } catch (error) {
            console.error(error);
        }
    }

    return {
        posterImage,
        updateImage,
    }
}