  import "@cometchat/uikit-elements";
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
  import { fontHelper, CometChatSchedulerBubble, SchedulerMessage, AvatarStyle, ListItemStyle, CalendarStyle, TimeSlotStyle, QuickViewStyle, SchedulerBubbleStyle, CometChatThemeContext } from "@cometchat/chat-uikit-react";
  import { createComponent } from "@lit-labs/react";
  
  const SchedulerMessageBubble = createComponent({
    tagName: "cometchat-scheduler-bubble",
    elementClass: CometChatSchedulerBubble,
    react: React,
    events: {
      ccSubmitClicked: "cc-submit-clicked",
    },
  });
  
  const SchedulerBubble = (props: any) => {
    const { activeComponent, handleCloseComponentModal, showComponentModal } =
      props;
    let showModal = false;
    const bubbleSlug = "scheduler-bubble";
    if (showComponentModal && activeComponent === bubbleSlug) showModal = true;
    const { theme } = useContext(CometChatThemeContext);
    const themeMode = theme.palette.mode;
  
    function getSchedulerMessageBubbleStyle() {
        const avatarStyle = new AvatarStyle({
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          border: "none",
          backgroundColor: theme.palette.getAccent700(),
          nameTextColor: theme.palette.getAccent900(),
          backgroundSize: "cover",
          nameTextFont: fontHelper(theme.typography.subtitle1),
        });
        const listItemStyle = new ListItemStyle({
          height: "auto",
          width: "100%",
          background: "inherit",
          activeBackground: "transparent",
          borderRadius: "0",
          titleFont: fontHelper(theme.typography.text1),
          titleColor: theme.palette.getAccent(),
          border: "none",
          separatorColor: "",
          hoverBackground: "transparent",
        });
        const calendarStyle = new CalendarStyle({
          height: "100%",
          width: "100%",
          border: "none",
          borderRadius: "0",
          background: "transparent",
          dateTextFont: fontHelper(theme.typography.subtitle2),
          dateTextColor: theme.palette.getAccent(),
          dayTextFont: fontHelper(theme.typography.text2),
          dayTextColor: theme.palette.getAccent(),
          monthYearTextFont: fontHelper(theme.typography.text2),
          monthYearTextColor: theme.palette.getAccent(),
          defaultDateTextBackground: "transparent",
          disabledDateTextColor: theme.palette.getAccent400(),
          disabledDateTextFont: fontHelper(theme.typography.subtitle2),
          disabledDateTextBackground: "transparent",
          titleTextFont: fontHelper(theme.typography.text1),
          titleTextColor: theme.palette.getAccent(),
          timezoneTextFont: fontHelper(theme.typography.caption2),
          timezoneTextColor: theme.palette.getAccent(),
          arrowButtonTextColor: theme.palette.getAccent(),
          arrowButtonTextFont: fontHelper(theme.typography.title2),
        });
        const timeSlotStyle = new TimeSlotStyle({
          background: "transparent",
          height: "fit-content",
          width: "100%",
          border: "none",
          borderRadius: "0",
          calendarIconTint: theme.palette.getAccent(),
          timezoneIconTint: theme.palette.getAccent(),
          emptySlotIconTint: theme.palette.getAccent500(),
          emptySlotTextColor: theme.palette.getAccent500(),
          emptySlotTextFont: fontHelper(theme.typography.subtitle1),
          dateTextColor: theme.palette.getAccent(),
          dateTextFont: fontHelper(theme.typography.subtitle1),
          seperatorTint: theme.palette.getAccent100(),
          slotBackground: theme.palette.getAccent900(),
          slotBorder: "none",
          slotBorderRadius: "8px",
          slotTextColor: theme.palette.getAccent(),
          slotTextFont: fontHelper(theme.typography.caption2),
          timezoneTextColor: theme.palette.getAccent(),
          timezoneTextFont: fontHelper(theme.typography.caption2),
          titleTextColor: theme.palette.getAccent(),
          titleTextFont: fontHelper(theme.typography.text1),
        });
        const qucikViewStyle = new QuickViewStyle({
          background: theme.palette.getAccent50(),
          height: "fit-content",
          width: "100%",
          titleFont: fontHelper(theme.typography.subtitle2),
          titleColor: theme.palette.getAccent(),
          subtitleFont: fontHelper(theme.typography.subtitle2),
          subtitleColor: theme.palette.getAccent600(),
          leadingBarTint: theme.palette.getPrimary(),
          leadingBarWidth: "4px",
          borderRadius: "8px",
        });
        return new SchedulerBubbleStyle({
          avatarStyle: avatarStyle,
          listItemStyle: listItemStyle,
          quickViewStyle: qucikViewStyle,
          dateSelectorStyle: calendarStyle,
          timeSlotSelectorStyle: timeSlotStyle,
          backButtonIconTint: theme.palette.getPrimary(),
          background: theme.palette.getSecondary(),
          height: "100%",
          width: "100%",
          border: `1px solid ${theme.palette.getAccent100()}`,
          borderRadius: "8px",
          loadingIconTint: theme.palette.getAccent600(),
          suggestedTimeBackground: theme.palette.getAccent900(),
          suggestedTimeBorder: `1px solid ${theme.palette.getPrimary()}`,
          suggestedTimeBorderRadius: "8px",
          suggestedTimeDisabledBackground: theme.palette.getAccent50(),
          suggestedTimeDisabledBorder: `1px solid ${theme.palette.getAccent200()}`,
          suggestedTimeDisabledBorderRadius: "8px",
          suggestedTimeDisabledTextColor: theme.palette.getAccent700(),
          suggestedTimeDisabledTextFont: fontHelper(theme.typography.text3),
          suggestedTimeTextColor: theme.palette.getPrimary(),
          suggestedTimeTextFont: fontHelper(theme.typography.text3),
          moreButtonDisabledTextBackground: "transparent",
          moreButtonDisabledTextBorder: "none",
          moreButtonDisabledTextBorderRadius: "0",
          moreButtonDisabledTextColor: theme.palette.getAccent600(),
          moreButtonDisabledTextFont: fontHelper(theme.typography.caption2),
          moreButtonTextBackground: "transparent",
          moreButtonTextBorder: "none",
          moreButtonTextBorderRadius: "0",
          moreButtonTextColor: theme.palette.getPrimary(),
          moreButtonTextFont: fontHelper(theme.typography.caption2),
          goalCompletionTextColor: theme.palette.getAccent(),
          goalCompletionTextFont: fontHelper(theme.typography.text3),
          errorTextColor: theme.palette.getError(),
          errorTextFont: fontHelper(theme.typography.text3),
          scheduleButtonStyle: {
            iconHeight: "16px",
            iconWidth: "16px",
            buttonIconTint: theme.palette.getAccent(),
            buttonTextFont: fontHelper(theme.typography.name),
            buttonTextColor: theme.palette.getAccent("dark"),
            border: "none",
            borderRadius: "8px",
            background: theme.palette.getPrimary(),
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "8px",
          },
          seperatorTint: theme.palette.getAccent200(),
          subtitleTextColor: theme.palette.getAccent400(),
          subtitleTextFont: fontHelper(theme.typography.name),
          summaryTextColor: theme.palette.getAccent(),
          summaryTextFont: fontHelper(theme.typography.subtitle1),
          timezoneTextColor: theme.palette.getAccent600(),
          timezoneTextFont: fontHelper(theme.typography.caption2),
          titleTextColor: theme.palette.getAccent(),
          titleTextFont: fontHelper(theme.typography.title1),
          timezoneIconTint: theme.palette.getAccent(),
          calendarIconTint: theme.palette.getAccent(),
          clockIconTint: theme.palette.getAccent(),
        });
      }
  
      function getSchedulerMessage() {
        const json = {
          id: "951",
          conversationId: "group_supergroup",
          sender: "superhero1",
          receiverType: "group",
          receiver: "supergroup",
          category: "interactive",
          type: "scheduler",
          data: {
            duration: 30,
            entities: {
              sender: {
                entity: {
                  uid: "superhero1",
                  name: "Iron Man",
                  role: "default",
                  avatar:
                    "https://data-us.cometchat-staging.com/assets/images/avatars/ironman.png",
                  status: "available",
                  createdAt: 1683717043,
                  lastActiveAt: 1704362403,
                },
                entityType: "user",
              },
              receiver: {
                entity: {
                  guid: "supergroup",
                  icon: "https://data-us.cometchat-staging.com/assets/images/avatars/supergroup.png",
                  name: "Comic Heros' Hangout",
                  type: "public",
                  owner: "superhero1",
                  createdAt: 1683717041,
                  membersCount: 3,
                  conversationId: "group_supergroup",
                  onlineMembersCount: 207,
                },
                entityType: "group",
              },
            },
            bufferTime: 0,
            interactionGoal: {
              type: "anyAction",
              elementIds: [],
            },
            interactiveData: {
              title: "Meet with Dr. Jacob",
              duration: 60,
              bufferTime: 15,
              icsFileUrl:
                "https://data-us.cometchat.io/23965108c9b89ad2/media/1704380186_864562419_ab59586ed5ab5f89d2c960457ceee249.ics",
              availability: {
                friday: [
                  {
                    to: "2359",
                    from: "0000",
                  },
                ],
                monday: [
                  {
                    to: "1700",
                    from: "0600",
                  },
                ],
                tuesday: [
                  {
                    to: "1400",
                    from: "1000",
                  },
                  {
                    to: "2000",
                    from: "1700",
                  },
                ],
                saturday: [
                  {
                    to: "0800",
                    from: "0600",
                  },
                  {
                    to: "2300",
                    from: "1200",
                  },
                ],
                thursday: [
                  {
                    to: "2359",
                    from: "0000",
                  },
                ],
                wednesday: [
                  {
                    to: "0800",
                    from: "0600",
                  },
                  {
                    to: "2300",
                    from: "1200",
                  },
                ],
              },
              dateRangeEnd: "2024-02-09",
              timezoneCode: "Asia/Kolkata",
              dateRangeStart: "2023-02-10",
              scheduleElement: {
                action: {
                  url: "test.com",
                  method: "post",
                  actionType: "apiAction",
                },
                elementId: "1",
                buttonText: "Schedule",
                elementType: "button",
                disableAfterInteracted: true,
              },
              goalCompletionText: "Appointment scheduled",
              interactableElementIds: ["1"],
              allowSenderInteraction: true,
            },
            allowSenderInteraction: true,
          },
          sentAt: 1706806090,
          updatedAt: 1706806090,
        };
  
        const schedulerMessage = SchedulerMessage.fromJSON(json);
  
        return schedulerMessage;
      }
  
    return (
      <div style={loadingComponentModalStyle(showModal)}>
        <div style={componentDetailsModalStyle(themeMode)}>
          <div style={componentDetailsModalHeaderStyle}>
            <div style={componentDetailsModalTitleStyle}>Scheduler Bubble</div>
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
          The CometChatSchedulerBubble component is used to render a scheduler
          within a chat bubble. To learn more about this component tap here
          </div>
          <div
            className="schedulerbubbleWrapper"
            style={{ margin: "0 auto", marginTop: "15px", marginBottom: "15px" }}
          >
            <SchedulerMessageBubble
              schedulerMessage={getSchedulerMessage()}
              schedulerBubbleStyle={getSchedulerMessageBubbleStyle()}
            />
          </div>
        </div>
      </div>
    );
  };
  export { SchedulerBubble };
  