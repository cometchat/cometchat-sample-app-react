import React,{Component} from 'react';
import { Row,} from 'react-bootstrap';


var Userthumbnail = require('./../../../public/img/user.png');
import icon_close from './../../../public/img/icon_close.svg';
export default class CCBlockedUser extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div key={this.props.uid}  onClick={this.props.handleUnblock}>
                <Row className="userItem" >
                    <span className="sidebarUserListItemAvatar">
                        <img className="userAvatar img-circle" src={this.props.avt != false ? this.props.avt : Userthumbnail} height="40px" width="40px" />
                    </span>

                    <div className="buUserTitle">
                        <span >{this.props.children}</span>
                    </div>
                    {/* <div className="sidebarUserListItemStatus" data={this.props.status}>
                        <span >{this.props.status}</span>
                    </div> */}


                    <div className="buCloseButton" dangerouslySetInnerHTML={{__html:icon_close}}>
                        
                    </div>


                </Row>
            </div>
        );
    }
}