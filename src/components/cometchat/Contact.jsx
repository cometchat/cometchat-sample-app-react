import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

const Contact = ({ name, status, uid, avatar, handleContactClick, activeContactUID, unreadCount }) => {
  
  let status_classes = "status mr-1 status-";
  status_classes += status;
  let unreadCountHtml;
  let contact_classes = "contact-tab p-2 bg-white";

  if(activeContactUID !== undefined && uid === activeContactUID)
    contact_classes += ' active';
  else{

    if(unreadCount > 0)
    {
      unreadCountHtml = <div className="unread-msg-count-contact mb-3 mt-2 pr-2">
          <span className="badge badge-danger">{unreadCount}</span>
        </div>
    }
    
  }
 
  return (
    <div
      className={contact_classes}
      onClick={() => handleContactClick(uid)}
    >
      <div className="contact-avatar-small">
        <img className="mr-2" src={avatar} alt={name} />
      </div>
      <div className="contact-data">
        <p className="mb-0 contact-name">{name}</p>
        <p className="m-0 text-light-grey contact-status">
          <span className={status_classes}></span>
          <span className="status-text">{status}</span>
        </p>
      </div>
      <div className="contact-view-arrow mb-3 mt-2 pr-2">
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
      {unreadCountHtml}
    </div>
  );
};

export default Contact;
