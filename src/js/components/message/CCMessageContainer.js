import React, { Component } from 'react'
import {Row} from 'react-bootstrap' 
import CCMessageHeader from './CCMessageHeader'
import CCMessageFooter from './CCMessageFooter'
import CCMessageBox from './CCMessageBox';
import { connect } from 'react-redux';
import * as actionCreator from './../../store/actions/cc_action';

 

class CCMessageContainer extends Component {
  constructor(props){
    super(props);

    this.state = {
        loader : true,
    }
  } 

 

  async fetchMessage(){
    try{
      console.log("inside fetch Message" + this.props.user);
      await this.props.getMessage(this.props.user,50);
      
    }catch(error){
      console.log(error);
    };
  }

  
  render() {

    this.fetchMessage();

    return (
        <div className="ccMessageContainer h-100" >
            
            <CCMessageHeader></CCMessageHeader>
            <CCMessageBox/>
            {/* area for portal in details */}
            <CCMessageFooter/>
        
        </div>
    );
  }
}



const mapStateToProps = (store) =>{
  return {
    user : store.users.activeUsers.uid
  };
};

const mapDispachToProps = dispatch => {
  return {
      getMessage: (uid,limit) => dispatch(actionCreator.getUserMessageHistory(uid,limit)),
  };
};

export default connect( mapStateToProps, mapDispachToProps )(CCMessageContainer);


