import { useEffect, useRef, useState } from "react";
import { CometChatEmoji, CometChatEmojiCategory } from "./CometChatEmoji";
import { Emojis } from "./emojis";

export const useCometChatEmojiKeyboard = ({
    emojiData = [],
}: {
    emojiData: CometChatEmojiCategory[];
}) => {
    const [activeCategory, setActiveCategory] = useState<string>("people");
    const [emojiDataState, setEmojiDataState] = useState<CometChatEmojiCategory[]>(emojiData);
    const [searchEmojiData, setSearchEmojiData] = useState<{ [key: string]: CometChatEmoji }>({});
    const [searchString, setSearchString] = useState<string>("");
    const emojiDataRef = useRef(emojiData);

    useEffect(() => {
        emojiDataRef.current = emojiDataState;
    }, [emojiDataState]);

    /* 
        This function is used for displaying emoji character in the keyboard.
        It accepts emojiData and it returns emoji character from the emoji data provided. 
    */
    const getEmojiData = (emojiData: CometChatEmoji) => {
        const emojiInstance = new CometChatEmoji({
            char: emojiData.char,
            keywords: emojiData.keywords
        });
        return emojiInstance.char;
    };

    /*
        This function is used for setting the emoji list data which is used for the keyboard.
        If the emojiData is not provided by the user, this function is triggered and sets the emoji data.
    */
    const getEmojiCategory = () => {
        if (emojiData && emojiData?.length == 0) {
            setEmojiDataState(() => {
                return Emojis.map((el) => {
                    const vals = Object.values(el)[0];
                    const emojiCategory = new CometChatEmojiCategory({
                        id: vals.id,
                        name: vals.name,
                        symbolURL: vals.symbol,
                        emojies: vals.emojis,
                    });
                    return emojiCategory;
                })
            });
        }
    }

    /*
        This function is used to navigate to a specific category in the emoji list after the category button is clicked.
    */
    const scrollToElement = (id: string) => {
        setActiveCategory(id);
        setSearchString("");
        setSearchEmojiData({});
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    /* Purpose of this function is to handle the emoji searching functionality. */
    const filterEmojis = (e: { value?: string }) => {
        const tempFilteredEmojis: { [key: string]: CometChatEmoji } = {};
        setSearchString(e.value!);
        if (e.value?.length! > 0) {
            emojiDataRef.current.forEach((emoji) => {
                Object.keys(emoji.emojies).forEach((item: string) => {
                    emoji.emojies[item].keywords.every((keyItr: string) => {
                        if (keyItr.includes(e.value?.toLowerCase()!)) {
                            tempFilteredEmojis[item] = emoji.emojies[item];
                            return false;
                        } else {
                            return true;
                        }
                    })
                })
            })
            setSearchEmojiData(tempFilteredEmojis);
        } else {
            setSearchEmojiData({});
        }
    }

    return {
        emojiDataState,
        activeCategory,
        searchEmojiData,
        searchString,
        getEmojiData,
        getEmojiCategory,
        scrollToElement,
        filterEmojis,
    }
}