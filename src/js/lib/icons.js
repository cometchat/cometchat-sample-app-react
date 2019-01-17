

import React, { Component } from "react";
import {faEdit, faCog, faVideo,faPhone,faInfoCircle,faFileUpload,faSmile,faCamera,faThumbsUp,faStickyNote,faMicrophone,faPaperPlane,faEllipsisV} from '@fortawesome/free-solid-svg-icons';

const iconPath ="./../../public/img/";


export default class Icon extends Component{

    constructor(props){
        super(props);
    }
    render(){

        let svgFile =  iconPath + this.props.icon + ".svg";
        let iconFile =  require(svgFile);
        console.log("icons",iconFile);



        return (

            {iconFile}
        );
    }

}


export var icons = [
    faEdit,
    faCog,
    faVideo,
    faPhone,
    faInfoCircle,
    faFileUpload,
    faSmile,
    faCamera,
    faThumbsUp,
    faStickyNote,
    faMicrophone,
    faPaperPlane,
    faEllipsisV,
];

