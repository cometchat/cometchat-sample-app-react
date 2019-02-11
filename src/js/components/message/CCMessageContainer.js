import React, { Component } from 'react'
import {Row} from 'react-bootstrap' 
import CCMessageHeader from './CCMessageHeader'
import CCMessageFooter from './CCMessageFooter'
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
            {/* area for portal in details */}
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

const mapDispachToProps = dispatch => {
  return {
      
  };
};

export default connect( mapStateToProps, mapDispachToProps )(CCMessageContainer);


