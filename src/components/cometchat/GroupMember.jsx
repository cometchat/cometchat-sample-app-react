import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faUserPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const GroupMember = ({ name, status, uid, avatar, banned, handleBanUnbanMember, handleKickMember, subjectUID, ownerRights }) => {

    let action_button;
    let tab_title;
    let classes;
    let status_classes = "status mr-1 status-";
    status_classes += status;

    if(banned === false)
    {
        if(uid !== subjectUID && ownerRights)
        {
            action_button = <React.Fragment>
                                <div className="mb-2 mt-3 pr-2 ban-member" >
                                    <FontAwesomeIcon icon={faBan} title="Ban Member" onClick={() => handleBanUnbanMember(uid, banned)} />
                                </div>
                                <div className="mb-2 mt-3 pr-2 kick-member">
                                    <FontAwesomeIcon icon={faTrashAlt} title="Kick Member" onClick={() => handleKickMember(uid)} />
                                </div>
                            </React.Fragment>;
        }
        
        tab_title = "";
        classes = "contact-tab p-2 bg-white ban-member-tab";
        return (
            <div className={classes}
                    title={tab_title} >
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
    }
    else
    {
        if(uid !== subjectUID && ownerRights)
        {
            action_button = <div className="mb-2 mt-3 pr-2 unban-member">
                                <FontAwesomeIcon icon={faUserPlus} />
                            </div>;
        }

        tab_title = "Unban member from group";
        classes = "contact-tab p-2 bg-white unban-member-tab";

        return (
            <div className={classes}
                    title={tab_title}  onClick={() => handleBanUnbanMember(uid, banned)}>
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
    }
};

export default GroupMember;
