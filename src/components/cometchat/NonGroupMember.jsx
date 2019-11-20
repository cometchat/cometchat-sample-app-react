import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const NonGroupMember = ({
  name,
  status,
  uid,
  avatar,
  handleAddMember,
  subjectUID,
  ownerRights
}) => {
  let action_button;
  let tab_title;
  let classes;
  let status_classes = "status mr-1 status-";
  status_classes += status;

  if (uid !== subjectUID && ownerRights) {
    action_button = (
      <div className="mb-2 mt-3 pr-2 add-member">
        <FontAwesomeIcon icon={faUserPlus} />
      </div>
    );
  }

  tab_title = "Add member to group";
  classes = "contact-tab p-2 bg-white add-member-tab";

  return (
    <div
      className={classes}
      title={tab_title}
      onClick={() => handleAddMember(uid)}
    >
      <div className="contact-avatar-small">
        <img className="mr-2" src={avatar} alt={name} />
      </div>
      <div className="contact-data">
        <p className="mb-0 contact-name va-super">{name}</p>
        <p className="m-0 text-light-grey contact-status">
          <span className={status_classes}></span>
          <span className="status-text">{status}</span>
        </p>
      </div>
      {action_button}
    </div>
  );
};

export default NonGroupMember;
