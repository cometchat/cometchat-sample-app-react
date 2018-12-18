import React,{Component} from "react";
import { connect } from "react-redux";
import {isEmpty} from "./../../lib/uiComponentLib";
import {Grid,Row,Col} from 'react-bootstrap';
import CCLeftSidebar from '../../components/embed/CCLeftSidebar';
import CCMessageContainer from '../../components/message/CCMessageContainer';
import * as actionCreator from './../../store/actions/cc_action';


class Embeded extends Component{

    constructor(props){
        super(props);

        this.state = {
            loader : true,
        }
    }

     componentDidMount(){
        this.fetchAllInit();               
    }

    async fetchAllInit(){
        this.startLoader();
        try{
            await this.props.fetchUser(50);
            await this.props.fetchGroup(50);
            //this.props.registerListener();
            await this.stopLoader();
         }catch(error){
            console.log(error);
        };
    }        

    startLoader(){
        console.log("starting loader");
        this.setState({
            loader : true,
        });
    }

    stopLoader(){
        console.log("stoping loader");
        this.setState({
            loader : false,
        });
    }

    render(){
        
        if(this.state.loader){

            return ( <div class="outer">
            <div class="middle">
                <div class="inner">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="sunil"/> 
                    <h1>Loading ...</h1>
                </div>
            </div>
        </div>);

        }else{
            return (
        
                <Grid fluid={true}>
                    <Row className="ccShowGrid">
                        <Col xs={12} lg={3} style = {{borderRight : "1px solid #ccc", height: "100%"}}>
                           <CCLeftSidebar></CCLeftSidebar>
                        </Col>
                        <Col xsHidden lg={9} style={{height:"100%"}}>
                          <ActiveUserMessageContainer dataContent={this.props.activeUsers}/>
                        </Col>
                    </Row>
                </Grid>
                 
            
            );
        }

        
        
    };

    
}
   
function ActiveUserMessageContainer(props){

    const contentType = props.dataContent;
    if(isEmpty(contentType)){
        return <BlankMessageContainer/>;
    }else{
        return <ShowActiveMessage/>;
    }
}



function BlankMessageContainer(props) {
    return (
        <div class="outer">
            <div class="middle">
                <div class="inner">
                    <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> 
                    <h1>Start Chatting </h1>
                    <p>Once upon a midnight dreary...</p>
                </div>
            </div>
        </div>
    );
  }
  

function ShowActiveMessage(props) {
    return <CCMessageContainer/>;
  }


const mapStateToProps = (store) =>{
    return {
        activeUsers : store.users.activeUsers
    };
};
  
const mapDispachToProps = dispatch => {
    return {
        fetchUser        :  (limit) =>  dispatch(actionCreator.getUsers(limit)),
        fetchGroup       :  (limit) =>  dispatch(actionCreator.getGroups(limit)),
        //registerListener :  ()      =>  actionCreator.addMessageListener(dispatch)

    };
};

export default connect( mapStateToProps, mapDispachToProps )(Embeded);
