import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Conversation from "./Conversation";
import _ from "lodash";
import defaultUserIco from "../../resources/images/user-default-avatar.png";
import defaultGroupIco from "../../resources/images/group-default-avatar.png";

class Conversations extends Component {
  state = {
    conversations: [],
    conversationsFetched: false,
    searchString: "",
    unreadCounts: []
  };

  componentDidUpdate(prevProps) {
    if (
      (_.isEmpty(this.state.conversations) &&
        this.state.conversationsFetched === false) ||
        (this.props.lastMessageId !== prevProps.lastMessageId)
    ) {
      var conversationsRequest = new CometChat.ConversationsRequestBuilder()
        .setLimit(50)
        .build();

        conversationsRequest.fetchNext().then(
            conversationList => {
           
              this.setState({
                conversations: conversationList,
                conversationsFetched: true
              });
          
        },
        error => {
           
          this.setState({
            conversations: [],
            conversationsFetched: true
          });
        }
      );
    }
  }

  handleSearchStringChange = e => {

    this.setState({ searchString: e.target.value });

    let search_string =  e.target.value;

    var conversationsRequest = new CometChat.ConversationsRequestBuilder()
        .setLimit(100)
        .build();

        conversationsRequest.fetchNext().then(
          
            conversationList => {
           
              let keys_to_remove = [];

              if(conversationList.length > 0)
              {
                _.forEach(conversationList, function(c,k) { 
                  
                  if(_.toLower(c.conversationWith.name).indexOf(_.toLower(search_string)) < 0)
                  {
                    keys_to_remove = _.concat(keys_to_remove, k);
                    
                  }
                  
                });
                
                _.pullAt(conversationList, keys_to_remove);

                this.setState({ conversations : conversationList });

              }
        }

      );
  };

  render() {
    const { conversations, conversationsFetched } = this.state;

    const conversations_length = conversations.length;

    if (conversations_length === 0 && this.state.searchString === "") {
      if (conversationsFetched) {
        return (
          <div className="empty-contacts p-2 bg-white">
            No conversations available.{" "}
          </div>
        );
      } else {
        return (
          <div className="contact-tab p-2 bg-white">Fetching conversations...</div>
        );
      }
    } else {
      let show_contacts_warning = "d-none mt-1";

      if (conversations_length === 0 && this.state.searchString !== "") {
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
              <i>No matching conversations found.</i>
            </small>
          </div>
          <div className="contact-listing bg-white">
            {conversations.map(c => (
              <Conversation
                key={c.conversationId}
                id={c.conversationWith.uid !== undefined ? c.conversationWith.uid : c.conversationWith.guid !== undefined ? c.conversationWith.guid : ""}
                name={c.conversationWith.name}
                avatar={c.conversationWith.avatar !== undefined ? c.conversationWith.avatar : 
                  c.conversationWith.icon !== undefined ? c.conversationWith.icon : 
                  c.conversationType === CometChat.RECEIVER_TYPE.GROUP ? defaultGroupIco : defaultUserIco
                }
                lastMessage={c.lastMessage.category === "message" && c.lastMessage.type === "text" ? c.lastMessage.data.text 
                : c.lastMessage.category === "message" ? c.lastMessage.type
                : c.lastMessage.category === "action" && c.lastMessage.action !== "deleted" ? c.lastMessage.message
                : c.lastMessage.category === "action" && c.lastMessage.action === "deleted" ? 'Message deleted' : false }
                handleConversationClick={this.props.handleConversationClick}
                activeID={this.props.activeID}
                conversationType={c.conversationType}
              />
            ))}
          </div>
        </React.Fragment>
      );
    }
  }
}

export default Conversations;