import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

const Group = ({ name, guid, icon, membersCount, handleGroupClick, activeGUID, unreadCount }) => {

  let group_classes = "group-tab p-2 bg-white";
  let unreadCountHtml;

  if(activeGUID !== undefined && guid === activeGUID)
    group_classes += ' active';

  return (
    <div
      className={group_classes}
      onClick={() => handleGroupClick(guid)}>
      <div className="group-icon-small">
        <img className="mr-2" src={icon} alt={name} />
      </div>
      <div className="group-data">
        <p className="mb-0 group-name">{name}</p>
        <p className="m-0 text-light-grey contact-status">
          <span className="status-text">Members : {membersCount}</span>
        </p>
      </div>
      <div className="group-view-arrow mb-3 mt-2 pr-2">
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
      {unreadCountHtml}
    </div>
  );
};

export default Group;
