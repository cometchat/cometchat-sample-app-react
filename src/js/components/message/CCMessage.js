import React,{Component} from 'react';
import { connect } from 'react-redux';
import * as util from './../../lib/uiComponentLib';

class CCMessage extends Component{

    render(){
   
        let msg = {
            data            :   this.props.msgData.data.text,
            sid             :   this.props.msgData.sender,
            username        :   this.props.activeUser.name,
            avatar          :   this.props.activeUser.avatar,
            loggedInUser    :   this.props.loggedUid,
            sendAt          :   this.props.msgData.sentAt,
        }

        return(<MessageType msg = {msg}/>);
    }
}

function MessageType(props){
    if(props.msg.loggedInUser == props.msg.sid){
        //outgoing message
        return <OutgoingMessage msg={props.msg}/>;
    }else{
        //incoming message 
       return <IncomingMessage msg={props.msg}/>;
    }
}


function IncomingMessage(props){
    
    return( 
        <div className="incoming_msg">
            <div className="incoming_msg_img"> 
                <img className = "img-circle" src={props.msg.avatar} alt="" style={{width:"42px",height:"42px"}}/>
            </div>          

            <div className="received_msg">
                <div className="received_withd_msg">
                    <p>{props.msg.data}
                    <span className="time_date">{util.convertStringToDate(props.msg.sendAt)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function OutgoingMessage(props){
    return(
    <div class="outgoing_msg">
        <div class="sent_msg">
            <p>
                {props.msg.data}
                <span class="time_date">{util.convertStringToDate(props.msg.sendAt)}</span>
            
            </p>
            
        </div>
    </div>    
  );
}

const mapStateToProps = (store) =>{
    return {
      loggedUid : store.users.loggedInUser.uid,
      users :store.users.usersList,
      activeUser : store.users.activeUsers,
    };
};
  
const mapDispachToProps = dispatch => {
    return {
    };
};

export default connect( mapStateToProps, mapDispachToProps )(CCMessage);



