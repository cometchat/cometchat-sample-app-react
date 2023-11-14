import {
  CheckboxStyle,
  DropdownStyle,
  InputStyle,
  LabelStyle,
  RadioButtonStyle,
} from "@cometchat/uikit-elements";
import { CometChatFormBubble, FormBubbleStyle } from "@cometchat/uikit-shared";
import { FormMessage, fontHelper } from "@cometchat/uikit-resources";
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

const FormMessageBubble = createComponent({
  tagName: "cometchat-form-bubble",
  elementClass: CometChatFormBubble,
  react: React,
  events: {
    ccSubmitClicked: "cc-submit-clicked",
  },
});

const FormBubble = (props: any) => {
  const { activeComponent, handleCloseComponentModal, showComponentModal } =
    props;
  let showModal = false;
  const bubbleSlug = "form-bubble";
  if (showComponentModal && activeComponent === bubbleSlug) showModal = true;
  const { theme } = useContext(CometChatThemeContext);
  const themeMode = theme.palette.mode;

  function getFormMessageBubbleStyle() {
    let textStyle = new InputStyle({
      width: "100%",
      height: "30px",
      border: `1px solid ${theme.palette.getAccent100()}`,
      borderRadius: "3px",
      padding: "0px 0px 0px 5px",
      placeholderTextColor: theme.palette.getAccent400(),
      placeholderTextFont: fontHelper(theme.typography.subtitle2),
      textFont: fontHelper(theme.typography.subtitle2),
      textColor: theme.palette.getAccent(),
      background: theme.palette.getBackground(),
    });
    const labelStyle = new LabelStyle({
      textFont: fontHelper(theme.typography.subtitle1),
      textColor: theme.palette.getAccent(),
      background: "transparent",
    });
    const radioButtonStyle = new RadioButtonStyle({
      height: "16px",
      width: "16px",
      border: "none",
      labelTextFont: fontHelper(theme.typography.subtitle2),
      labelTextColor: theme.palette.getAccent600(),
      borderRadius: "4px",
      background: "",
    });
    const checkboxStyle = new CheckboxStyle({
      height: "16px",
      width: "16px",
      border: "none",
      borderRadius: "4px",
      background: "",
      labelTextFont: fontHelper(theme.typography.subtitle2),
      labelTextColor: theme.palette.getAccent600(),
    });
    const dropdownStyle = new DropdownStyle({
      height: "35px",
      width: "100%",
      background: theme.palette.getBackground(),
      border: `1px solid ${theme.palette.getAccent100()}`,
      borderRadius: "12px",
      activeTextFont: fontHelper(theme.typography.subtitle2),
      activeTextColor: theme.palette.getAccent(),
      arrowIconTint: theme.palette.getAccent700(),
      textFont: fontHelper(theme.typography.subtitle2),
      textColor: theme.palette.getAccent(),
      optionBackground: theme.palette.getBackground(),
      optionBorder: `1px solid ${theme.palette.getAccent100()}`,
      optionHoverBorder: `1px solid ${theme.palette.getAccent100()}`,
      hoverTextFont: fontHelper(theme.typography.subtitle2),
      hoverTextColor: theme.palette.getAccent(),
      hoverTextBackground: theme.palette.getAccent100(),
    });
    const buttonGroupStyle = {
      height: "40px",
      width: "100%",
      background: theme.palette.getPrimary(),
      border: `none`,
      borderRadius: "12px",
      buttonTextFont: fontHelper(theme.typography.subtitle2),
      buttonTextColor: theme.palette.getBackground(),
      justifyContent: "center",
    };
    const singleSelectStyle = {
      height: "100%",
      width: "100%",
      background: theme.palette.getBackground()!,
      border: "none",
      borderRadius: "12px",
      activeTextFont: fontHelper(theme.typography.subtitle2),
      activeTextColor: theme.palette.getAccent()!,
      activeTextBackground: theme.palette.getAccent100()!,
      textFont: fontHelper(theme.typography.subtitle2),
      textColor: theme.palette.getAccent()!,
      optionBackground: theme.palette.getBackground()!,
      optionBorder: `1px solid ${theme.palette.getAccent100()}`,
      optionBorderRadius: "2px",
      hoverTextFont: fontHelper(theme.typography.subtitle2),
      hoverTextColor: theme.palette.getAccent()!,
      hoverTextBackground: theme.palette.getAccent100()!,
    };
    const quickViewStyle = {
      background: "transparent",
      height: "fit-content",
      width: "100%",
      titleFont: fontHelper(theme.typography.subtitle2)!,
      titleColor: theme.palette.getPrimary()!,
      subtitleFont: fontHelper(theme.typography.subtitle2)!,
      subtitleColor: theme.palette.getAccent600()!,
      leadingBarTint: theme.palette.getPrimary()!,
      leadingBarWidth: "4px",
      borderRadius: "8px",
      closeIconTint: "",
    };
    return new FormBubbleStyle({
      width: "300px",
      height: "fit-content",
      border: "1px solid #e0e0e0",
      background: "transparent",
      wrapperBackground: theme.palette.getBackground(),
      borderRadius: "8px",
      wrapperBorderRadius: "8px",
      textInputStyle: textStyle,
      labelStyle: labelStyle,
      radioButtonStyle: radioButtonStyle,
      checkboxStyle: checkboxStyle,
      dropdownStyle: dropdownStyle,
      buttonStyle: buttonGroupStyle,
      singleSelectStyle: singleSelectStyle,
      quickViewStyle: quickViewStyle,
      titleColor: theme.palette.getAccent(),
      titleFont: fontHelper(theme.typography.title1),
      goalCompletionTextColor: theme.palette.getAccent(),
      goalCompletionTextFont: fontHelper(theme.typography.subtitle1),
      wrapperPadding: "2px",
    });
  }

  function getFormMessage() {
    const json = {
      id: "2862",
      muid: "1698667506320",
      conversationId: "group_group_1696408979857",
      sender: "nakul",
      receiverType: "group",
      receiver: "group_1696408979857",
      category: "interactive",
      type: "form",
      data: {
        entities: {
          sender: {
            entity: {
              uid: "nakul",
              name: "Nakul",
              role: "default",
              status: "available",
              lastActiveAt: 1698830332,
            },
            entityType: "user",
          },
          receiver: {
            entity: {
              guid: "group_1696408979857",
              name: "chutiyaGang",
              type: "public",
              owner: "vivek",
              createdAt: 1696408980,
              updatedAt: 1698667314,
              membersCount: 7,
              conversationId: "group_group_1696408979857",
              onlineMembersCount: 14,
            },
            entityType: "group",
          },
        },
        metadata: {
          data: {
            text: "Thanks For filling the Form!",
          },
          type: "text",
          category: "message",
          receiver: "{$s}",
          receiverType: "{$t}",
        },
        resource:
          "WEB-4_0_1-a9b124b3-e092-43a7-9f78-cf507c93d153-1698830285347",
        interactions: [
          {
            elementId: "element8",
            interactedAt: 1699874632,
          },
        ],
        interactionGoal: {
          type: "none",
          elementIds: [],
        },
        interactiveData: {
          title: "Society Survey",
          formFields: [
            {
              label: "Name",
              maxLines: 1,
              optional: false,
              elementId: "element1",
              elementType: "textInput",
              defaultValue: "vivek",
            },
            {
              label: "Last Name",
              maxLines: 1,
              optional: false,
              elementId: "element2",
              elementType: "textInput",
            },
            {
              label: "Address",
              maxLines: 5,
              optional: false,
              elementId: "element3",
              elementType: "textInput",
            },
            {
              label: "Country",
              options: [
                {
                  label: "INDIA",
                  value: "option1",
                },
                {
                  label: "AUSTRALIA",
                  value: "option2",
                },
              ],
              optional: false,
              elementId: "element4",
              elementType: "dropdown",
              defaultValue: "option1",
            },
            {
              label: "Services",
              options: [
                {
                  label: "Garbage",
                  value: "option1",
                },
                {
                  label: "Electricity Bill",
                  value: "option2",
                },
                {
                  label: "Lift",
                  value: "option3",
                },
              ],
              optional: false,
              elementId: "element5",
              elementType: "checkbox",
              defaultValue: ["option1", "option2"],
            },
            {
              label: "Wing",
              options: [
                {
                  label: "A",
                  value: "option1",
                },
                {
                  label: "B",
                  value: "option2",
                },
              ],
              optional: false,
              elementId: "element6",
              elementType: "singleSelect",
              defaultValue: "option1",
            },
            {
              action: {
                url: "https://www.cometchat.com/",
                actionType: "urlNavigation",
              },
              elementId: "element9",
              buttonText: "About us",
              elementType: "button",
              disableAfterInteracted: true,
            },
          ],
          submitElement: {
            action: {
              url: "",
              actionType: "urlNavigation",
            },
            elementId: "element8",
            buttonText: "Submit",
            elementType: "button",
            disableAfterInteracted: true,
          },
        },
        allowSenderInteraction: true,
      },
      sentAt: 1698830332,
      updatedAt: 1698830332,
    };

    const formMessage = FormMessage.fromJSON(json);

    return formMessage;
  }

  return (
    <div style={loadingComponentModalStyle(showModal)}>
      <div style={componentDetailsModalStyle(themeMode)}>
        <div style={componentDetailsModalHeaderStyle}>
          <div style={componentDetailsModalTitleStyle}>Form Bubble</div>
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
          The CometChatFormBubble component is used to render a form within a
          chat bubble. To learn more about this component tap here
        </div>
        <div
          className="formbubbleWrapper"
          style={{ margin: "0 auto", marginTop: "15px", marginBottom: "15px" }}
        >
          <FormMessageBubble
            message={getFormMessage()}
            formBubbleStyle={getFormMessageBubbleStyle()}
          />
        </div>
      </div>
    </div>
  );
};
export { FormBubble };
