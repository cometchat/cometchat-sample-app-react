import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import BlockedContact from "./BlockedContact";
import _ from 'lodash';
import defaultUserIco from "../../resources/images/user-default-avatar.png";

class BlockedContacts extends Component {

    state = {
                contacts: [],
                contactsFetched : false,
                searchString : ""
            };

    componentDidUpdate(prevProps) {

        if ((_.isEmpty(this.state.contacts) && this.state.contactsFetched === false)  || this.props.showBlockedContacts !== prevProps.showBlockedContacts) {
        
            var limit = 50;
            
            var blockedUsersRequest = new CometChat.BlockedUsersRequestBuilder().setLimit(limit).setSearchKeyword(this.state.searchString).build();
            
            blockedUsersRequest.fetchNext().then(
                
                userList => {        
                    this.setState({ contacts: userList, contactsFetched : true });       
                },

                error => {
                    this.setState({ contacts: [], contactsFetched : true });
                }

            ); 

        }
    }

    handleSearchStringChange = (e) =>
    {
        this.setState({searchString:e.target.value});

        var limit = 50;

        var blockedUsersRequest = new CometChat.BlockedUsersRequestBuilder().setSearchKeyword(e.target.value).setLimit(limit).build();
        
        blockedUsersRequest.fetchNext().then(
            
            userList => {        
                
                this.setState({ contacts: userList, contactsFetched : false });       
            },

            error => {
                this.setState({ contacts: [], contactsFetched : false });
            }

        );

    }

    handleUnBlockUser = (usersList) =>
    {
        CometChat.unblockUsers(usersList).then(list => {
            
            let contacts = this.state.contacts;

            _.forEach(list, function(v, k) {
                
                    _.remove(contacts, function(c) {
                
                        return c.uid === k;

                    });
            });
            
            this.setState({contacts});
        });
    }

    render() {
        const { contacts, contactsFetched } = this.state;
    
        const contacts_length = contacts.length;
    
        if (contacts_length === 0 && this.state.searchString === "") {
            if(contactsFetched)
            {
              return (
                  <div className="empty-contacts p-2 bg-white">No users available. </div>
              );
            }
            else
            {
              return (
                  <div className="contact-tab p-2 bg-white">Fetching users...</div>
              );
            }
         
        } 
        else {
          let show_contacts_warning = "d-none mt-1";
          
          if (contacts_length === 0 && this.state.searchString !== "") {
               show_contacts_warning = "mt-1";
          } 
    
          
          return (
            <React.Fragment>
              <div className="search-container mb-3">
                  <div className="input-group">
                      <div className="input-group-btn">
                          <button className="btn btn-default" type="submit"><FontAwesomeIcon icon={faSearch} /></button>
                      </div>
                      <input type="text" className="form-control" placeholder="Search name" name="search"
                          onChange={e => this.handleSearchStringChange(e)}
                          value={this.state.searchString} />
                  </div>
                  <small className={show_contacts_warning}><i>No matching users found.</i></small>
              </div>
              <div className="contact-listing bg-white">
                {contacts.map(c => (
                  
                  <BlockedContact
                    key={c.uid}
                    uid={c.uid}
                    name={c.name}
                    avatar={c.avatar === undefined ? defaultUserIco : c.avatar}
                    handleUnBlockUser={this.handleUnBlockUser}
                  />
                ))}
              </div>
            </React.Fragment>
          );
        }
      }
}
 
export default BlockedContacts;