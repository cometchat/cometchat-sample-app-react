import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

const BlockedContact = ({ name, uid, avatar, handleUnBlockUser, activeContactUID }) => {

    let contact_classes = "contact-tab blocked-tab p-2 bg-white";

  if(activeContactUID !== undefined && uid === activeContactUID)
    contact_classes += ' active';
  return (
        <div className={contact_classes}
                onClick={() => handleUnBlockUser([uid])} title="Unblock contact" >
            <div className="contact-avatar-small">
                <img className="mr-2" src={avatar} alt={name} />
            </div>
            <div className="contact-data">
                <p className="mb-0 contact-name va-super">{name}</p>
            </div>
            <div className="mb-2 mt-3 pr-2 contact-unblock">
                <FontAwesomeIcon icon={faUserPlus} />
            </div>
        </div>
  );
};

export default BlockedContact;
