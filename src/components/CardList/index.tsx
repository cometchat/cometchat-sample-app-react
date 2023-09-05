import { CSSProperties, useContext, useState } from "react";
import { Card, ICardProps } from "../Card";
import { useLocation, useNavigate } from "react-router-dom";

import { CometChatThemeContext } from "@cometchat/chat-uikit-react";
import { Shared } from "./Shared";
import { fontHelper } from "@cometchat/uikit-resources";

interface ICardListProps {
    title : string,
    cardDataList : Omit<ICardProps, "onClick">[],
    titleStyle? : CSSProperties,
};

type CardData = ICardListProps["cardDataList"][number];

export function CardList({ title, cardDataList, titleStyle } : ICardListProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useContext(CometChatThemeContext);
    const [showComponentModal, setShowComponentModal] = useState(false);
    const [activeComponent, setActiveComponent] = useState('');

    function handleClick({ title : cardTitle } : CardData) {
        
       if(location.pathname === "/home/shared-module")
       {
        // console.log("cardTitle.toLowerCase()",cardTitle.toLowerCase())
            setActiveComponent(cardTitle.toLowerCase().replaceAll(" ", "-"))
            setShowComponentModal(true)
       }
       else
       navigate(`/home/${title.toLowerCase()}-module/${cardTitle.toLowerCase().replaceAll(" ", "-")}`);
    }

    function handleCloseComponentModal() {
        setShowComponentModal(false)
        setActiveComponent('')
    }

    return (
        <div
            style = {{
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                rowGap: "16px",
                height: "100%"
            }}
        >
            {<Shared showComponentModal={showComponentModal} activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal}  />}
            <div
                style = {{
                    font: fontHelper(theme.typography.heading),
                    color: theme.palette.getAccent(),
                    textTransform: "capitalize",
                    ...titleStyle
                }}
            >
                {title}
            </div>
            <div
                style = {{
                    flexGrow: "1",
                    padding: "16px 0"
                }}
            >
                <div
                    style = {{
                        display: "grid",
                        gap: "16px",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    }}
                >
                    {
                        cardDataList.map(cardData => (
                            <Card 
                                key = {cardData.title}
                                title = {cardData.title}
                                description = {cardData.description}
                                imageInfo = {cardData.imageInfo}
                                onClick = {() => handleClick(cardData)}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
