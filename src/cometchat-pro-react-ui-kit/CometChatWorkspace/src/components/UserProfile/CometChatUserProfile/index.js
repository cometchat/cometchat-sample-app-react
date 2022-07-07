import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { CometChatAvatar, CometChatToastNotification } from "../../Shared";

import { theme } from "../../../resources/theme";
import Translator from "../../../resources/localization/translator";

import {
	userInfoScreenStyle,
	headerStyle,
	headerTitleStyle,
	detailStyle,
	thumbnailStyle,
	userDetailStyle,
	userNameStyle,
	userStatusStyle,
	optionsStyle,
	optionStyle,
	optionNameStyle
} from "./style";
// import reportIcon from "./resources/warning.svg";
import logout from "./resources/logout.svg";
import { googleLogout } from '@react-oauth/google';
class CometChatUserProfile extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			loggedInUser: null
		}

		this.toastRef = React.createRef();
	}

	componentDidMount() {
		
		CometChat.getLoggedinUser().then(user => {
			this.setState({ loggedInUser: user });
		}).catch(error => this.toastRef.setError("SOMETHING_WRONG"));
	}

	logout = () => {
		googleLogout();
		window.localStorage.removeItem("firebase_token");
		CometChat.logout().then(
			() => {
				window.location.reload();
			}, error => {
				window.location.reload();
			}
		)
	}

	render() {
		let userProfile = null;
		if(this.state.loggedInUser) {

			let avatar = <CometChatAvatar user={this.state.loggedInUser} />;
			userProfile = (
				<React.Fragment>
					<div css={headerStyle(this.props)} className="userinfo__header">
						<h4 css={headerTitleStyle()} className="header__title">
							{Translator.translate("MORE", this.props.lang)}
						</h4>
					</div>
					<div css={detailStyle()} className="userinfo__detail">
						<div css={thumbnailStyle()} className="detail__thumbnail">
							{avatar}
						</div>
						<div css={userDetailStyle()} className="detail__user" dir={Translator.getDirection(this.props.lang)}>
							<div css={userNameStyle()} className="user__name">
								{this.state.loggedInUser.name}
							</div>
							<p css={userStatusStyle(this.props)} className="user__status">
								{Translator.translate("ONLINE", this.props.lang)}
							</p>
						</div>
					</div>
					<div css={optionsStyle()} className="userinfo__options">
						<div css={optionStyle(logout)} className="option option-report">
							<div css={optionNameStyle()} className="option_name">
								<button type="button" onClick={() => this.logout()}>
									{Translator.translate("LOGOUT", this.props.lang)}
								</button>
							</div>
						</div>
					</div>
				</React.Fragment>
			);
		}

		return (
			<div css={userInfoScreenStyle(this.props)} className="userinfo">
				{userProfile}
				<CometChatToastNotification ref={el => (this.toastRef = el)} lang={this.props.lang} />
			</div>
		);
	}
}

// Specifies the default values for props:
CometChatUserProfile.defaultProps = {
	lang: Translator.getDefaultLanguage(),
	theme: theme
};

CometChatUserProfile.propTypes = {
	lang: PropTypes.string,
	theme: PropTypes.object
}

export { CometChatUserProfile };
