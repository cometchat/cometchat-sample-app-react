import React, { Component } from 'react';
import CCMessageHeader from './CCMessageHeader';
import CCMessageFooter from './CCMessageFooter';
import CCMessageBox from './CCMessageBox';
import { connect } from 'react-redux';

class CCMessageContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      loader : true,
    }
  } 

  render() {
    return (
      <div className="ccMessageContainer h-100" >
        <CCMessageHeader></CCMessageHeader>
        <CCMessageBox/>
        <CCMessageFooter/>
      </div>
    );
  }

}

const mapStateToProps = (store) =>{
  return {
    user :  store.message.activeMessage,
  };
};

export default connect( mapStateToProps, null )(CCMessageContainer);


