import React, {Component} from "react";
import Dock from "./dock/dock";
import Embed from "./embed/Embeded";

export default class Layout extends Component {

  render() {

        
    
    switch(this.props.cc_layout){
        case "cc_dock" :
          return (
              <Dock/>        
          );
      
        break;

        case "cc_embed" : 
        default:
          return (
                  <Embed/>        
            );
        break;
      }

 
  }
}
