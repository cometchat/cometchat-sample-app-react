export class CometChatEmoji {
    char: string = "";
    keywords: any = [];
    constructor({ char = "", keywords = [] }) {
        this.char = char;
        this.keywords = keywords;
    }
}

export class CometChatEmojiCategory {
    id: string;
    symbolURL: string;
    name: string;
    emojies: {
        [key: string]: CometChatEmoji
    };
    constructor({
        id = "",
        symbolURL = "",
        name = "",
        emojies = {},
    }) {
        this.id = id;
        this.symbolURL = symbolURL;
        this.name = name;
        this.emojies = emojies;
    }
}