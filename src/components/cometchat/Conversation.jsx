import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

const Conversation = ({ name, lastMessage, id, avatar, conversationType, handleConversationClick, activeID }) => {
  
  if(lastMessage === false)
      return false;
  let contact_classes = "contact-tab p-2 bg-white";

  if(activeID !== undefined && id === activeID)
    contact_classes += ' active';
  
  return (
    <div
      className={contact_classes}
      onClick={() => handleConversationClick(id, conversationType)}
    >
      <div className="contact-avatar-small">
        <img className="mr-2" src={avatar} alt={name} />
      </div>
      <div className="contact-data">
        <p className="mb-0 contact-name">{name}</p>
        <div className="m-0 text-light-grey contact-status">
          <div className="status-text last-msg mb-0">{lastMessage}</div>
        </div>
      </div>
      <div className="contact-view-arrow mb-3 mt-2 pr-2">
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
    </div>
  );
};

export default Conversation;