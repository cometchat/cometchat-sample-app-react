export const wrapperStyle = () => {

    return {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    }
}

export const titleStyle = () => {

    const mq = [`@media (min-width : 320px) and (max-width: 767px)`];

    return {
        textAlign: "center",
        color: "rgb(67, 171, 255)",
        fontSize: "24px",
        width: "100%",
        padding: "0 1em",
        margin: "1em 0 0 0",
        [mq[0]]: {
            fontSize: "20px",
        }
    }
}

export const subTitleStyle = () => {

    const mq = [`@media (min-width : 320px) and (max-width: 767px)`];

    return {
        textAlign: "center",
        color: "#AAA",
        fontSize: "14px",
        width: "100%",
        padding: "0 1em",
        margin: "1em 0 2em 0",
        [mq[0]]: {
            fontSize: "16px",
        }
    }
}

export const helpTextStyle = () => {

    return {
        fontSize: "14px",
        textAlign: "center",
        width: "100%",
        color: "#333",
        padding: "0 1em",
    }
}

export const componentStyle = () => {

    const mq = [`@media (min-width : 320px) and (max-width: 767px)`, `@media (min-width : 768px) and (max-width: 1024px)`];

    return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 120px",
        width: "100%",
        [mq[0]]: {
            flexDirection: "column",
            padding: "50px 100px",
        },
        [mq[1]]: {
            flexDirection: "column",
            padding: "50px 50px",
        }
    }
}

export const UIComponentStyle = () => {

    const mq = [`@media (min-width : 320px) and (max-width: 767px)`, `@media (min-width : 768px) and (max-width: 1024px)`];

    return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 35.5%",
        width: "100%",
        [mq[0]]: {
            flexDirection: "column",
            padding: "50px 150px",
        },
        [mq[1]]: {
            flexDirection: "column",
            padding: "50px 50px",
        }
    }
}

export const boxStyle = () => {

    const mq = [`@media (min-width : 768px) and (max-width: 1024px)`];

    return {
        margin: "10px 20px",
        padding: "20px",
        boxShadow: "0 0 10px #bbb",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: "1",
        minWidth: "300px",
        [mq[0]]: {
            width: "400px",
        }
    }
}

export const titleWrapperStyle = () => {

    return {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    }
}

export const thumbnailWrapperStyle = () => {

    return {
        width: "36px",
        height: "36px",
    }
}

export const componentTitleStyle = () => {

    return {
        width: "calc(100% - 40px)",
        padding: "10px",
        margin: "0",
    }
}

export const descWrapperStyle = () => {

    return {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        "p": {
            textOverflow: "ellipsis",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word"
        },
        "code": {
            padding: "2px",
            color: "crimson",
            borderRadius: "4px",
            backgroundColor: "#f1f1f1",
        }
    }
}

export const linkWrapperStyle = () => {

    const mq = [`@media (min-width : 320px) and (max-width: 767px)`];

    return {
        borderTop: "0.3px solid #e8e8e8",
        padding: "10px",
        display: "flex",
        margin: 0,
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
        "li": {
            listStyleType: "none",
        },
        [mq[0]]: {
            flexDirection: "column",
            "li": {
                padding: "10px",
            },
        }
    }
}

export const linkStyle = () => {

    return {
        color: "rgb(67, 171, 255)!important",
        fontWeight: 600,
        fontSize: "14px",
        "&:hover": {
            color: "darken(rgb(67, 171, 255), 20%)",
            fontWeight: "600",
            fontSize: "14px",
        }
    }
}

export const logoutBtn = () => {

    return {
        margin: "16px ​auto 24px auto",
        "button": {
            outline: "none",
            backgroundColor: "#333",
            borderRadius: "10px",
            color: "white",
            padding: "8px 24px",
            "&:hover": {
                cursor: "pointer",
            }
        },
        
    }
}