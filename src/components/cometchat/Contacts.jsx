import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Contact from "./Contact";
import _ from "lodash";
import defaultUserIco from "../../resources/images/user-default-avatar.png";

class Contacts extends Component {
  state = {
    contacts: [],
    contactsFetched: false,
    searchString: "",
    unreadCounts: []
  };

  componentDidUpdate(prevProps) {
    if (
      (_.isEmpty(this.state.contacts) &&
        this.state.contactsFetched === false) ||
      this.props.activeContactUID !== prevProps.activeContactUID ||
      this.props.showBlockedContacts !== prevProps.showBlockedContacts ||
      this.props.onlineUsers !== prevProps.onlineUsers
    ) {
      var usersRequest = new CometChat.UsersRequestBuilder()
        .setLimit(50)
        .setSearchKeyword(this.state.searchString)
        .hideBlockedUsers(true)
        .build();

      usersRequest.fetchNext().then(
        userList => {
          CometChat.getUnreadMessageCountForAllUsers().then(
            unreadCounts => {
              this.setState({
                contacts: userList,
                unreadCounts,
                contactsFetched: true
              });
            },
            error => {
              this.setState({
                contacts: userList,
                unreadCounts: [],
                contactsFetched: true
              });
            }
          );
        },
        error => {
          this.setState({
            contacts: [],
            unreadCounts: [],
            contactsFetched: true
          });
        }
      );
    }
  }

  handleSearchStringChange = e => {
    this.setState({ searchString: e.target.value });

    var usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(50)
      .setSearchKeyword(e.target.value)
      .hideBlockedUsers(true)
      .build();

    usersRequest.fetchNext().then(userList => {
      this.setState({ contacts: userList });
    });
  };
  render() {
    const { contacts, contactsFetched } = this.state;

    const contacts_length = contacts.length;

    if (contacts_length === 0 && this.state.searchString === "") {
      if (contactsFetched) {
        return (
          <div className="empty-contacts p-2 bg-white">
            No users available.{" "}
          </div>
        );
      } else {
        return (
          <div className="contact-tab p-2 bg-white">Fetching users...</div>
        );
      }
    } else {
      let show_contacts_warning = "d-none mt-1";

      if (contacts_length === 0 && this.state.searchString !== "") {
        show_contacts_warning = "mt-1";
      }

      return (
        <React.Fragment>
          <div className="search-container mb-3">
            <div className="input-group">
              <div className="input-group-btn">
                <button className="btn btn-default" type="submit">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Search name"
                name="search"
                onChange={e => this.handleSearchStringChange(e)}
                value={this.state.searchString}
              />
            </div>
            <small className={show_contacts_warning}>
              <i>No matching users found.</i>
            </small>
          </div>
          <div className="contact-listing bg-white">
            {contacts.map(c => (
              <Contact
                key={c.uid}
                uid={c.uid}
                name={c.name}
                avatar={c.avatar !== undefined ? c.avatar : defaultUserIco}
                status={c.status}
                lastActiveAt={new Date(c.lastActiveAt * 1000)}
                handleContactClick={this.props.handleContactClick}
                activeContactUID={this.props.activeContactUID}
                unreadCount={
                  this.state.unreadCounts[c.uid] !== undefined
                    ? this.state.unreadCounts[c.uid]
                    : 0
                }
              />
            ))}
          </div>
        </React.Fragment>
      );
    }
  }
}

export default Contacts;
