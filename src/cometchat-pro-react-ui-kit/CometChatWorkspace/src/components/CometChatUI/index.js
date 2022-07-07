import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { CometChatNavBar } from "./CometChatNavBar";
import { CometChatMessages } from "../Messages";
import { CometChatIncomingCall, CometChatIncomingDirectCall } from "../Calls";

import { CometChatContextProvider } from "../../util/CometChatContext";
import * as enums from "../../util/enums.js";
import { theme } from "../../resources/theme";
import Translator from "../../resources/localization/translator";

import {
	unifiedStyle,
	unifiedSidebarStyle,
	unifiedMainStyle,
} from "./style";

class CometChatUI extends React.Component {

	loggedInUser = null;

	constructor(props) {
		
		super(props);
		this.state = {
			sidebarview: false,
			fromNotification: false,
			isUserNotification: false,
			isGroupNotification: false,
			notificationFor: '',
			isCallNotification: false,
			isChatNotification: false
		}

		this.navBarRef = React.createRef();
		this.contextProviderRef = React.createRef();
	}
	
	componentDidMount() {

		const notificationBroadcast = new BroadcastChannel('notification_broadcaster');
        notificationBroadcast.onmessage = (event) => {
            let value = event.data.key;
            let message = JSON.parse(value);
			let baseMessage = CometChat.CometChatHelper.processMessage(JSON.parse(message));
			if(baseMessage.category === 'message'){
				this.setState({fromNotification: true, isUserNotification: baseMessage.receiverType === 'user' ? true : false, isGroupNotification: baseMessage.receiverType === 'group' ?true : false, notificationFor: baseMessage.receiverType === 'user' ? baseMessage.sender.uid : baseMessage.receiver.guid, isChatNotification: true});
			}
			if(baseMessage.category === 'call'){
				if(baseMessage.status === 'incoming'){
					this.setState({fromNotification: true, isCallNotification: true, notificationFor: baseMessage});
				}
			}
        }

		if (this.props.chatWithUser.length === 0 && this.props.chatWithGroup.length === 0) {
			this.toggleSideBar();
		}

	}

	navBarAction = (action, type, item) => {
		
		switch(action) {
			case enums.ACTIONS["ITEM_CLICKED"]:
				this.itemClicked(item, type);
			break;
			case enums.ACTIONS["TOGGLE_SIDEBAR"]:
				this.toggleSideBar();
			break;
			default:
			break;
		}
	}
	
	itemClicked = (item, type) => {
		
		this.contextProviderRef.setTypeAndItem(type, item);    
		this.toggleSideBar()
	}

	actionHandler = (action, item, count, ...otherProps) => {
		
		switch(action) {
			case enums.ACTIONS["TOGGLE_SIDEBAR"]:
				this.toggleSideBar();
			break;
			case enums.GROUP_MEMBER_SCOPE_CHANGED:
			case enums.GROUP_MEMBER_KICKED:
			case enums.GROUP_MEMBER_BANNED:
				this.groupUpdated(action, item, count, ...otherProps);
			break;
			default:
			break;
		}
	}

	toggleSideBar = () => {

		const sidebarview = this.state.sidebarview;
		this.setState({ sidebarview: !sidebarview });
	}

	/**
	 If the logged in user is banned, kicked or scope changed, update the chat window accordingly
	 */
	groupUpdated = (key, message, group, options) => {
		
		switch(key) {
			case enums.GROUP_MEMBER_BANNED:
			case enums.GROUP_MEMBER_KICKED: {
				
				if (this.contextProviderRef.state.type === CometChat.ACTION_TYPE.TYPE_GROUP 
				&& this.contextProviderRef.state.item.guid === group.guid
				&& options.user.uid === this.loggedInUser.uid) {

					this.contextProviderRef.setItem({});
					this.contextProviderRef.setType("");
				}
				break;
			}
			case enums.GROUP_MEMBER_SCOPE_CHANGED: {
				
				if (this.contextProviderRef.state.type === CometChat.ACTION_TYPE.TYPE_GROUP
				&& this.contextProviderRef.state.item.guid === group.guid
				&& options.user.uid === this.loggedInUser.uid) {

					const newObject = Object.assign({}, this.contextProviderRef.state.item, { "scope": options["scope"] })
					this.contextProviderRef.setItem(newObject);
					this.contextProviderRef.setType(CometChat.ACTION_TYPE.TYPE_GROUP);
				}
				break;
			}
			default:
			break;
		}
	}

	render() {
		let {isUserNotification, isGroupNotification, notificationFor, fromNotification, isChatNotification, isCallNotification} = this.state;

		let messageScreen = (
				<CometChatMessages 
				theme={this.props.theme}
				lang={this.props.lang}
				_parent="unified"
				actionGenerated={this.actionHandler} />
			);

		let incomingCall = isCallNotification ? notificationFor : null;

		let incomingCallScreen = (
			<CometChatIncomingCall theme={this.props.theme} lang={this.props.lang} actionGenerated={this.actionHandler} incomingCall={incomingCall} />
		);

		console.log("this.props.chatWithUser", this.props.chatWithUser);
		let user = this.props.chatWithUser ? this.props.chatWithUser : fromNotification && isChatNotification ? (isUserNotification ? notificationFor : '') : '';
		let group = this.props.chatWithUser ? this.props.chatWithUser : fromNotification && isChatNotification ? (isGroupNotification ? notificationFor : '') : '';

		return (
			<CometChatContextProvider ref={el => this.contextProviderRef = el} user={user} group={group} language={this.props.lang}>
				<div css={unifiedStyle(this.props)} className="cometchat cometchat--unified" dir={Translator.getDirection(this.props.lang)}>
					<div css={unifiedSidebarStyle(this.state, this.props)} className="unified__sidebar">
						<CometChatNavBar
							ref={el => this.navBarRef = el}
							theme={this.props.theme}
							actionGenerated={this.navBarAction} />
					</div>
					<div css={unifiedMainStyle(this.state, this.props)} className="unified__main">
						{messageScreen}
					</div>
					{incomingCallScreen}
					<CometChatIncomingDirectCall theme={this.props.theme} lang={this.props.lang} actionGenerated={this.actionHandler} />
				</div>
			</CometChatContextProvider>
		);
	}
}

// Specifies the default values for props:
CometChatUI.defaultProps = {
	lang: Translator.getDefaultLanguage(),
	theme: theme,
	chatWithUser: "",
	chatWithGroup: "",
};

CometChatUI.propTypes = {
	lang: PropTypes.string,
	theme: PropTypes.object,
	chatWithUser: PropTypes.string,
	chatWithGroup: PropTypes.string,
}

export { CometChatUI };
