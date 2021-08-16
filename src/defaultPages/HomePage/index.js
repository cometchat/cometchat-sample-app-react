import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";

import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { wrapperStyle, titleStyle, subTitleStyle, componentStyle, boxStyle, titleWrapperStyle, thumbnailWrapperStyle, componentTitleStyle, UIComponentStyle, descWrapperStyle, linkWrapperStyle, linkStyle, logoutBtn } from "./style";

import * as actions from "../../store/action";

import CometChatUI from "./resources/CometChatUI.png";
import Component from "./resources/components.png";
import listComponent from "./resources/wall.png";

class HomePage extends React.Component {
	render() {
		let authRedirect = null;
		if (!this.props.isLoggedIn) {
			authRedirect = <Redirect to="/login" />;
		}

		return (
			<div css={wrapperStyle()}>
				{authRedirect}
				<p css={titleStyle()}>The UI Kit has different ways to make fully customizable UI required to build a chat application.</p>
				<p css={subTitleStyle()}>The UI Kit has been developed to help developers of different levels of experience to build a chat application in a few minutes to a couple of hours.</p>

				<div css={UIComponentStyle()}>
					<div css={boxStyle()}>
						<div css={titleWrapperStyle()}>
							<div css={thumbnailWrapperStyle}>
								<img src={CometChatUI} alt="CometChatUI" />
							</div>
							<h2 css={componentTitleStyle()}>CometChatUI</h2>
						</div>
						<div css={descWrapperStyle()}>
							<p>
								The <code>CometChatUI</code> component launches a fully working chat application.
							</p>
						</div>
						<ul css={linkWrapperStyle()}>
							<li>
								<Link css={linkStyle()} to="/embedded-app">
									Launch
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div css={componentStyle()}>
					<div css={boxStyle()}>
						<div css={titleWrapperStyle()}>
							<div css={thumbnailWrapperStyle}>
								<img src={Component} alt="Conversations" />
							</div>
							<h2 css={componentTitleStyle()}>Conversations</h2>
						</div>
						<div css={descWrapperStyle()}>
							<p>
								The <code>CometChatConversationListWithMessages</code> component launches Conversation list with messaging.
							</p>
						</div>
						<ul css={linkWrapperStyle()}>
							<li>
								<Link css={linkStyle()} to="/conversations">
									Launch
								</Link>
							</li>
						</ul>
					</div>

					<div css={boxStyle()}>
						<div css={titleWrapperStyle()}>
							<div css={thumbnailWrapperStyle}>
								<img src={Component} alt="Groups" />
							</div>
							<h2 css={componentTitleStyle()}>Groups</h2>
						</div>
						<div css={descWrapperStyle()}>
							<p>
								The <code>CometChatGroupListWithMessages</code> component launches Group list with messaging.
							</p>
						</div>
						<ul css={linkWrapperStyle()}>
							<li>
								<Link css={linkStyle()} to="/groups">
									Launch
								</Link>
							</li>
						</ul>
					</div>

					<div css={boxStyle()}>
						<div css={titleWrapperStyle()}>
							<div css={thumbnailWrapperStyle}>
								<img src={Component} alt="Users" />
							</div>
							<h2 css={componentTitleStyle()}>Users</h2>
						</div>
						<div css={descWrapperStyle()}>
							<p>
								The <code>CometChatUserListWithMessages</code> component launches User list with messaging.
							</p>
						</div>
						<ul css={linkWrapperStyle()}>
							<li>
								<Link css={linkStyle()} to="/users">
									Launch
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div css={componentStyle()}>
					<div css={boxStyle()}>
						<div css={titleWrapperStyle()}>
							<div css={thumbnailWrapperStyle}>
								<img src={listComponent} alt="Conversation List" />
							</div>
							<h2 css={componentTitleStyle()}>Conversation List</h2>
						</div>
						<div css={descWrapperStyle()}>
							<p>
								The <code>CometChatConversationList</code> component launches Conversation list.
							</p>
						</div>
						<ul css={linkWrapperStyle()}>
							<li>
								<Link css={linkStyle()} to="/conversation-list">
									Launch
								</Link>
							</li>
						</ul>
					</div>

					<div css={boxStyle()}>
						<div css={titleWrapperStyle()}>
							<div css={thumbnailWrapperStyle}>
								<img src={listComponent} alt="Group List" />
							</div>
							<h2 css={componentTitleStyle()}>Group List</h2>
						</div>
						<div css={descWrapperStyle()}>
							<p>
								The <code>CometChatGroupList</code> component launches Group list.
							</p>
						</div>
						<ul css={linkWrapperStyle()}>
							<li>
								<Link css={linkStyle()} to="/group-list">
									Launch
								</Link>
							</li>
						</ul>
					</div>

					<div css={boxStyle()}>
						<div css={titleWrapperStyle()}>
							<div css={thumbnailWrapperStyle}>
								<img src={listComponent} alt="User List" />
							</div>
							<h2 css={componentTitleStyle()}>User List</h2>
						</div>
						<div css={descWrapperStyle()}>
							<p>
								The <code>CometChatUserList</code> component launches User list.
							</p>
						</div>
						<ul css={linkWrapperStyle()}>
							<li>
								<Link css={linkStyle()} to="/user-list">
									Launch
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div css={componentStyle()}>
					<div css={boxStyle()} style={{ maxWidth: "33%" }}>
						<div css={titleWrapperStyle()}>
							<div css={thumbnailWrapperStyle}>
								<img src={listComponent} alt="CometChatMessages" />
							</div>
							<h2 css={componentTitleStyle()}>CometChatMessages</h2>
						</div>
						<div css={descWrapperStyle()}>
							<p>
								The <code>CometChatMessages</code> component launches User list.
							</p>
						</div>
						<ul css={linkWrapperStyle()}>
							<li>
								<Link css={linkStyle()} to="/messages">
									Launch
								</Link>
							</li>
						</ul>
					</div>
				</div>
				
				<div css={logoutBtn()}>
					<button type="button" onClick={this.props.onLogout}>
						Logout
					</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		loading: state.loading,
		error: state.error,
		isLoggedIn: state.isLoggedIn,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLogout: () => dispatch(actions.logout()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
