import React,{Component} from "react";
import {Row,Col} from 'react-bootstrap';
import CCLeftSidebarHeader from './CCLeftSidebarHeader';
import CCUserList from './CCUserList';
 
export default class CCLeftSidebar extends Component{

    render(){
        if(this.props.children){
            return EXtHTML;
        }else{
            return EXtHTML;
        }
        
    }
}

const EXtHTML = (
    <div className="ccMainContainer">
        
            <CCLeftSidebarHeader></CCLeftSidebarHeader>
       
            <CCUserList></CCUserList>
        
    </div>
);


