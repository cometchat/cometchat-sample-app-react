import React,{Component} from "react";
import {Row,Col,OverlayTrigger,Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {connect} from 'react-redux'
class CCMessageHeader extends Component{

    render(){
        return  (
            <Row className = "ccMessageHeader">
                    
                    <Col lg={8} className="cc-no-padding h-100">
                        <div className = "ccMessagetitle">{this.props.user.name}</div> 
                    </Col>
        
                    <Col lg={4} className="cc-no-padding h-100">
                        <div className="ccMessageHeaderMenu">
                            <FontAwesomeIcon  className = "cc-icon " icon="phone" flip="horizontal" /> 
                            <FontAwesomeIcon  className = "cc-icon " icon="video" />
                            <FontAwesomeIcon  className = "cc-icon " icon="info-circle" />
                        </div>
                    </Col>
                    
                    
                    
        
            </Row>
        );
    }
}

const mapStateToProps = (store) =>{
    return {
      user : store.users.activeUsers
    };
};
  
const mapDispachToProps = dispatch => {
    return {
        //UpdateActiveUser: (key) => dispatch({ type: "updateActiveUser", uid:key }),
    };
};

export default connect( mapStateToProps, mapDispachToProps )(CCMessageHeader);
