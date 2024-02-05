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
import { CometChatThemeContext, SingleSelectStyle, QuickViewStyle } from "@cometchat/chat-uikit-react";
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
      borderRadius: "6px",
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
      borderRadius: "6px",
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
      borderRadius: "6px",
      buttonTextFont: fontHelper(theme.typography.subtitle2),
      buttonTextColor: theme.palette.getBackground(),
      justifyContent: "center",
    };
    const singleSelectStyle = new SingleSelectStyle({
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
      optionBorderRadius: "3px",
      hoverTextFont: fontHelper(theme.typography.subtitle2),
      hoverTextColor: theme.palette.getAccent()!,
      hoverTextBackground: theme.palette.getAccent100()!,
    });
    const quickViewStyle = new QuickViewStyle({
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
    });
    return new FormBubbleStyle({
      width: "300px",
      height: "fit-content",
      border: "none",
      background: theme.palette.getSecondary(),
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
      datePickerBorder: `1px solid ${theme.palette.getAccent100()}`,
      datePickerBorderRadius: "6px",
      datePickerFont: fontHelper(theme.typography.subtitle2),
      datePickerFontColor: theme.palette.getAccent(),
    });
  }

  function getFormMessage() {
    const json = {
      id: "757",
      conversationId: "group_group_1706078382528",
      sender: "superhero2",
      receiverType: "group",
      receiver: "group_1706078382528",
      category: "interactive",
      type: "form",
      data: {
        entities: {
          sender: {
            entity: {
              uid: "superhero2",
              name: "Captain America",
              role: "default",
              avatar:
                "https://data-us.cometchat-staging.com/assets/images/avatars/captainamerica.png",
              status: "available",
              createdAt: 1683717043,
              lastActiveAt: 1704738138,
            },
            entityType: "user",
          },
          receiver: {
            entity: {
              guid: "group_1706078382528",
              name: "Scheduler TimeDate",
              type: "public",
              owner: "superhero2",
              createdAt: 1706078391,
              updatedAt: 1706078425,
              membersCount: 12,
              conversationId: "group_group_1706078382528",
              onlineMembersCount: 8,
            },
            entityType: "group",
          },
        },
        interactionGoal: {
          type: "none",
          elementIds: ["element8"],
        },
        interactiveData: {
          title: "Form Title",
          formFields: [
            {
              label: "Name",
              maxLines: 1,
              optional: false,
              elementId: "element1",
              elementType: "textInput",
              placeholder: {
                text: "write your name here",
              },
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
              to: "2024-02-09T23:59",
              from: "2024-02-08T12:00",
              mode: "dateTime",
              label: "Select Date & Time",
              optional: false,
              elementId: "67",
              elementType: "dateTime",
              defaultValue: "2024-01-01T12:00",
              timezoneCode: "Asia/Kolkata",
              dateTimeFormat: "yyyy-MM-dd HH:mm",
            },
            {
              to: "2024-02-09",
              from: "2024-01-09",
              mode: "date",
              label: "Select Date",
              optional: false,
              elementId: "68",
              elementType: "dateTime",
              defaultValue: "2024-01-11",
              timezoneCode: "Asia/Kolkata",
              dateTimeFormat: "yyyy-MM-dd",
            },
            {
              to: "15:30",
              from: "14:30",
              mode: "time",
              label: "Select Time",
              optional: false,
              elementId: "69",
              elementType: "dateTime",
              defaultValue: "14:55",
              timezoneCode: "Asia/Kolkata",
              dateTimeFormat: "HH:mm",
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
              optional: true,
              elementId: "element5",
              elementType: "checkbox",
              defaultValue: ["option1", "option2"],
            },
            {
              label: "Wing",
              options: [
                {
                  label: "A Wing",
                  value: "option1",
                },
                {
                  label: "B Wing",
                  value: "option2",
                },
              ],
              optional: false,
              elementId: "element10",
              elementType: "dropdown",
              defaultValue: "option1",
            },
            {
              label: "Wing",
              options: [
                {
                  label: "A Wing",
                  value: "option1",
                },
                {
                  label: "B Wing",
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
                url: "https://www.cometchat.com",
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
              url: "https://www.cometchat.com",
              method: "POST",
              actionType: "apiAction",
            },
            elementId: "element8",
            buttonText: "Submit",
            elementType: "button",
            disableAfterInteracted: true,
          },
        },
        allowSenderInteraction: true,
        interactions: [
          {
            elementId: "element8",
            interactedAt: 1706677823,
          },
        ],
      },
      sentAt: 1706092684,
      updatedAt: 1706092684,
      replyCount: 2,
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
