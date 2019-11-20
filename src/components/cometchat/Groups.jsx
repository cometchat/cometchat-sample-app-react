import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUsers } from "@fortawesome/free-solid-svg-icons";
import Group from "./Group";
import _ from "lodash";
import defaultGroupIco from "../../resources/images/group-default-avatar.png";

class Groups extends Component {
  state = {
    groups: { joined: [], others: [] },
    searchString: "",
    unreadCounts: [],
    newGroupGuid: "",
    newGroupName: "",
    newGroupType: "public",
    newGroupPassword: "",
    protectedGroupPassword: ""
  };

  componentDidUpdate(prevProps) {
    if (
      (_.isEmpty(this.state.groups.joined) &&
        _.isEmpty(this.state.groups.others)) ||
      this.props.activeGUID !== prevProps.activeGUID
    ) {
      var groupsRequest = new CometChat.GroupsRequestBuilder()
        .setLimit(30)
        .setSearchKeyword(this.state.searchString)
        .build();

      let groupListJoined;
      let groupListOthers;

      groupsRequest.fetchNext().then(
        groupList => {
          groupListJoined = _.filter(groupList, function(o) {
            return o.hasJoined;
          });
          groupListOthers = _.filter(groupList, function(o) {
            return !o.hasJoined && !o.isBanned;
          });
          CometChat.getUnreadMessageCountForAllGroups().then(
            unreadCounts => {
              this.setState({
                groups: { joined: groupListJoined, others: groupListOthers },
                unreadCounts
              });
            },
            error => {
              this.setState({
                groups: { joined: groupListJoined, others: groupListOthers },
                unreadCounts: []
              });
            }
          );
        },
        error => {
          this.setState({
            groups: { joined: [], others: [] },
            unreadCounts: []
          });
        }
      );
    }
  }

  handleSearchStringChange = e => {
    this.setState({ searchString: e.target.value });

    var groupsRequest = new CometChat.GroupsRequestBuilder()
      .setLimit(50)
      .setSearchKeyword(e.target.value)
      .build();

    groupsRequest.fetchNext().then(groupList => {
      let groupListJoined = _.filter(groupList, function(o) {
        return o.hasJoined;
      });
      let groupListOthers = _.filter(groupList, function(o) {
        return !o.hasJoined && !o.isBanned;
      });
      this.setState({
        groups: { joined: groupListJoined, others: groupListOthers }
      });
    });
  };

  refreshNewGroupFields = () => {
    this.setState({
      newGroupGuid: "",
      newGroupName: "",
      newGroupType: "public",
      newGroupPassword: ""
    });
    this.props.hideCreateGroupModal();
  };

  refreshPasswordField = () => {
    this.setState({ protectedGroupPassword: "" });
    this.props.hideAskPasswordModal();
  };

  handleCreateNewGroup = () => {
    var GUID = this.state.newGroupGuid;
    var groupName = this.state.newGroupName;
    var groupType = this.state.newGroupType;
    var password = "";

    if (this.state.newGroupType === "password") {
      password = this.state.newGroupPassword;
    }

    var group = new CometChat.Group(GUID, groupName, groupType, password);

    CometChat.createGroup(group).then(
      group => {
        let groups = this.state.groups;
        groups.joined = [...groups.joined, group];
        this.setState({
          groups,
          newGroupGuid: "",
          newGroupName: "",
          newGroupPassword: "",
          newGroupType: "public"
        });
        this.props.hideCreateGroupModal();
      },
      error => {
        
      }
    );
  };

  handleGroupNameChange = e => {
    this.setState({ newGroupName: e.target.value });
  };

  handleGroupGuidChange = e => {
    this.setState({ newGroupGuid: e.target.value });
  };

  handleGroupTypeChange = e => {
    this.setState({ newGroupType: e.target.value, newGroupPassword: "" });
  };

  handleGroupPasswordChange = e => {
    this.setState({ newGroupPassword: e.target.value });
  };

  handleProtectedGroupPasswordChange = e => {
    this.setState({ protectedGroupPassword: e.target.value });
  };
  render() {
    const { groups } = this.state;

    let groups_length = groups.joined.length + groups.others.length;

    if (groups_length === 0 && this.state.searchString === "") {
      return <div className="group-tab p-2 bg-white">Fetching groups ...</div>;
    } else {
      let show_groups_warning = "d-none mt-1";

      if (groups_length === 0 && this.state.searchString !== "") {
        show_groups_warning = "mt-1";
      }

      let joinedTitle = "";
      if (groups.joined.length > 0)
        joinedTitle = <div className="groups-type-title">JOINED GROUPS</div>;

      let othersTitle = "";
      if (groups.others.length > 0)
        othersTitle = <div className="groups-type-title">OTHER GROUPS</div>;

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
            <small className={show_groups_warning}>
              <i>No matching groups found.</i>
            </small>
          </div>
          <div className="groups-container bg-white">
            <div className="groups-listing">
              {joinedTitle}
              {groups.joined.map(c => (
                <Group
                  key={c.guid}
                  askPassword={false}
                  guid={c.guid}
                  name={c.name}
                  icon={c.icon !== undefined ? c.icon : defaultGroupIco}
                  membersCount={c.membersCount}
                  handleGroupClick={this.props.handleGroupClick}
                  activeGUID={this.props.activeGUID}
                  unreadCount={
                    this.state.unreadCounts[c.guid] !== undefined
                      ? this.state.unreadCounts[c.guid]
                      : 0
                  }
                />
              ))}
              {othersTitle}
              {groups.others.map(c => (
                <Group
                  key={c.guid}
                  askPassword={c.type === "password" ? true : false}
                  guid={c.guid}
                  name={c.name}
                  icon={c.icon !== undefined ? c.icon : defaultGroupIco}
                  membersCount={c.membersCount}
                  handleGroupClick={this.props.handleGroupClick}
                  activeGUID={this.props.activeGUID}
                  unreadCount={
                    this.state.unreadCounts[c.guid] !== undefined
                      ? this.state.unreadCounts[c.guid]
                      : 0
                  }
                />
              ))}
            </div>
          </div>
          <CreateGroupFormModal
            createGroupFormShow={this.props.createGroupFormShow}
            handleGroupPasswordChange={this.handleGroupPasswordChange}
            handleGroupNameChange={this.handleGroupNameChange}
            handleGroupTypeChange={this.handleGroupTypeChange}
            handleGroupGuidChange={this.handleGroupGuidChange}
            handleCreateNewGroup={this.handleCreateNewGroup}
            newGroupGuid={this.state.newGroupGuid}
            newGroupName={this.state.newGroupName}
            newGroupType={this.state.newGroupType}
            newGroupPassword={this.state.newGroupPassword}
            refreshNewGroupFields={this.refreshNewGroupFields}
          />
          <AskPasswordModal
            createGroupFormShow={this.props.createGroupFormShow}
            showAskPasswordModal={this.props.showAskPasswordModal}
            refreshPasswordField={this.refreshPasswordField}
            protectedGroupPassword={this.state.protectedGroupPassword}
            handleProtectedGroupPasswordChange={
              this.handleProtectedGroupPasswordChange
            }
            handleGroupClick={this.props.handleGroupClick}
            protectedGroupAskPasswordGuid={
              this.props.protectedGroupAskPasswordGuid
            }
          />
        </React.Fragment>
      );
    }
  }
}

function CreateGroupFormModal({
  createGroupFormShow,
  refreshNewGroupFields,
  handleGroupNameChange,
  handleGroupTypeChange,
  handleGroupPasswordChange,
  handleCreateNewGroup,
  handleGroupGuidChange,
  newGroupType,
  newGroupGuid,
  newGroupName,
  newGroupPassword
}) {
  let passwordDisabled = "disabled";
  if (newGroupType === "password") {
    passwordDisabled = "";
  }
  const showHideClassName = createGroupFormShow
    ? "modal fade display-block"
    : "modal fade display-none";
  const showHideBackdropClasses = createGroupFormShow
    ? "modal-backdrop fade in"
    : "";
  return (
    <div
      className={showHideClassName}
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className={showHideBackdropClasses}></div>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              <FontAwesomeIcon icon={faUsers} /> &nbsp;New group
            </h5>
            <button
              onClick={() => refreshNewGroupFields()}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="group-guid" className="col-form-label">
                  GUID:
                </label>
                <input
                  value={newGroupGuid}
                  autoFocus
                  type="text"
                  className="form-control"
                  id="group-guid"
                  onChange={e => handleGroupGuidChange(e)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="group-name" className="col-form-label">
                  Name:
                </label>
                <input
                  value={newGroupName}
                  autoFocus
                  type="text"
                  className="form-control"
                  id="group-name"
                  onChange={e => handleGroupNameChange(e)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="group-type" className="col-form-label">
                  Type:
                </label>
                <select
                  className="form-control"
                  defaultValue={CometChat.GROUP_TYPE.PUBLIC}
                  id="group-type"
                  onChange={e => handleGroupTypeChange(e)}
                >
                  <option value={CometChat.GROUP_TYPE.PUBLIC}>Public</option>
                  <option value={CometChat.GROUP_TYPE.PASSWORD}>
                    Password protected
                  </option>
                  <option value={CometChat.GROUP_TYPE.PRIVATE}>Private</option>
                </select>
              </div>
              <div className="form-group" htmlFor="group-password">
                <label htmlFor="group-password" className="col-form-label">
                  Password:
                </label>
                <input
                  disabled={passwordDisabled}
                  value={newGroupPassword}
                  type="text"
                  className="form-control"
                  id="group-password"
                  onChange={e => handleGroupPasswordChange(e)}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer align-center">
            <button
              type="button"
              className="btn btn-cc btn-sm btn-block"
              onClick={event => handleCreateNewGroup(event)}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AskPasswordModal({
  refreshPasswordField,
  showAskPasswordModal,
  createGroupFormShow,
  protectedGroupPassword,
  handleProtectedGroupPasswordChange,
  handleGroupClick,
  protectedGroupAskPasswordGuid
}) {
  const modalClasses = showAskPasswordModal
    ? "modal fade display-block"
    : "modal fade display-none";
  const backdropClasses = showAskPasswordModal ? "modal-backdrop fade in" : "";
  return (
    <div
      className={modalClasses}
      id="exampleModal1"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className={backdropClasses}></div>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              <FontAwesomeIcon icon={faUsers} /> &nbsp;Enter password to join
            </h5>
            <button
              onClick={() => refreshPasswordField()}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group" htmlFor="group-password">
                <label htmlFor="group-password" className="col-form-label">
                  Password:
                </label>
                <input
                  value={protectedGroupPassword}
                  type="text"
                  className="form-control"
                  id="group-password"
                  onChange={e => handleProtectedGroupPasswordChange(e)}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer align-center">
            <button
              type="button"
              className="btn btn-cc btn-sm btn-block"
              onClick={() =>
                handleGroupClick(
                  protectedGroupAskPasswordGuid,
                  protectedGroupPassword
                )
              }
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Groups;
