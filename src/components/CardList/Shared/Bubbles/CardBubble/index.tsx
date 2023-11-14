import { CardBubbleStyle, CometChatCardBubble } from "@cometchat/uikit-shared";
import { CardMessage, fontHelper } from "@cometchat/uikit-resources";
import React, { useContext } from "react";
import {
  componentDetailModalCloseIconStyle,
  componentDetailsModalCloseIconWrapperStyle,
  componentDetailsModalDescriptionStyle,
  componentDetailsModalHeaderStyle,
  componentDetailsModalStyle,
  componentDetailsModalTitleStyle,
  loadingComponentModalStyle,
} from "../../style";

import CloseIcon from "../assets/close2x.png";
import { CometChatThemeContext } from "@cometchat/chat-uikit-react";
import { createComponent } from "@lit-labs/react";

const CardMessageBubble = createComponent({
  tagName: 'cometchat-card-bubble',
  elementClass: CometChatCardBubble,
  react: React
});

const CardBubble = (props: any) => {
  const { activeComponent, handleCloseComponentModal, showComponentModal } =
    props;
  let showModal = false;
  const bubbleSlug = "card-bubble";
  if (showComponentModal && activeComponent === bubbleSlug) showModal = true;
  const { theme } = useContext(CometChatThemeContext);
  const themeMode = theme.palette.mode;


  function getCardMessageBubbleStyle() {
    const buttonStyle = {
      height: "40px",
      width: "100%",
      background: "transparent",
      border: `none`,
      borderRadius: "0px",
      buttonTextFont: fontHelper(theme.typography.subtitle2),
      buttonTextColor: `${theme.palette.getPrimary()}`,
      justifyContent: "center",
    };

    return new CardBubbleStyle({
      background: "transparent",
      border: `1px solid ${theme.palette.getAccent100()}`,
      borderRadius: "8px",
      height: "fit-content",
      width: "300px",
      imageHeight: "auto",
      imageWidth: "100%",
      imageRadius: "8px",
      imageBackgroundColor: "transparent",
      descriptionFontColor: theme.palette.getAccent(),
      descriptionFont: fontHelper(theme.typography.subtitle2),
      buttonStyle: buttonStyle,
      dividerTintColor: theme.palette.getAccent100(),
      wrapperBackground: theme.palette.getBackground(),
      wrapperBorderRadius: "8px",
      wrapperPadding: "2px",
      disabledButtonColor: theme.palette.getAccent600(),
    });
  }

  function getCardMessage() {
    const json = {
      id: "1978",
      muid: "1697641596",
      conversationId: "nakul_user_rohit",
      sender: "nakul",
      receiverType: "user",
      receiver: "rohit",
      category: "interactive",
      type: "card",
      data: {
        entities: {
          sender: {
            entity: {
              uid: "nakul",
              name: "Nakul",
              role: "default",
              status: "available",
              lastActiveAt: 1697636600,
            },
            entityType: "user",
          },
          receiver: {
            entity: {
              uid: "rohit",
              name: "Rohit",
              role: "default",
              status: "available",
              lastActiveAt: 1696508846,
              conversationId: "nakul_user_rohit",
            },
            entityType: "user",
          },
        },
        resource:
          "REACT_NATIVE-4_0_0-2d83fe8e-a47e-444c-bbbf-c5d68afc030a-1697640527366",
        interactionGoal: {
          type: "none",
          elementIds: [],
        },
        interactiveData: {
          text: "Introducing our latest product, the Super Widget 5000! With its advanced features and sleek design, this widget is sure to revolutionize the industry. Don't miss out on the opportunity to experience the future of widgets. Order yours today!",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/en/e/e1/Thomas_D._Baird_%28low-resolution%29.jpg",
          cardActions: [
            {
              action: {
                url: "https://api.example.com/register",
                actionType: "urlNavigation",
              },
              elementId: "submitButton1",
              buttonText: "Order Now",
              elementType: "button",
              disableAfterInteracted: true,
            },
            {
              action: {
                url: "https://api.example.com/register",
                actionType: "urlNavigation",
              },
              elementId: "submitButton2",
              buttonText: "Register Now",
              elementType: "button",
              disableAfterInteracted: true,
            },
            {
              action: {
                url: "https://api.example.com/register",
                actionType: "urlNavigation",
              },
              elementId: "submitButton3",
              buttonText: "Login Now",
              elementType: "button",
              disableAfterInteracted: true,
            },
          ],
          interactableElementIds: [
            "submitButton1",
            "submitButton2",
            "submitButton3",
          ],
        },
        allowSenderInteraction: true,
      },
      sentAt: 1697641596,
      deliveredAt: 1697641596,
      readAt: 1697708285,
      updatedAt: 1697708285,
    };

    const cardMessage = CardMessage.fromJSON(json);

    return cardMessage;
  }

  return (
    <div style={loadingComponentModalStyle(showModal)}>
      <div style={componentDetailsModalStyle(themeMode)}>
        <div style={componentDetailsModalHeaderStyle}>
          <div style={componentDetailsModalTitleStyle}>Card Bubble</div>
          <div
            onClick={handleCloseComponentModal}
            style={componentDetailsModalCloseIconWrapperStyle}
          >
            <img
              style={componentDetailModalCloseIconStyle}
              alt="closeIcon"
              src={CloseIcon}
            />
          </div>
        </div>
        <div style={componentDetailsModalDescriptionStyle}>
        The CometChatCardBubble component is used to display a card within a
        chat bubble. To learn more about this component tap here.
        </div>
        <div
          className="cardbubbleWrapper"
          style={{ margin: "0 auto", marginTop: "15px", marginBottom: "15px" }}
        >
          <CardMessageBubble
          message={getCardMessage()}
          cardBubbleStyle={getCardMessageBubbleStyle()}
          />
        </div>
      </div>
    </div>
  );
};
export { CardBubble };
