import React from "react";

const DemoUser = ({ uid, name, avatar, margin, handleDemoLogin }) => {
  let classes = "test-user-box mb-3 d-inline-flex p-1 ";
  classes += margin;
  return (
    <div className={classes} id={uid} onClick={e => handleDemoLogin(e, uid)}>
      <div>
        <img className="user-avatar-small mr-2" src={avatar} alt={name} />
      </div>
      <div>
        <p className="mb-0 demo-user-name">{name}</p>
        <p className="m-0 text-font-grey demo-user-uid">{uid}</p>
      </div>
    </div>
  );
};

export default DemoUser;
