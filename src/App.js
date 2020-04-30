import React from 'react';
import './App.css';
import KitchenSinkApp from './defaultPages/KitchenSinkApp'
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import HomePage from './defaultPages/HomePage';
import AllComponents from './defaultPages/AllComponents';


import {CometChatConversationList,CometChatUserList,CometChatUnified,CometChatGroupList,CometChatUserListScreen,CometChatConversationListScreen,CometChatGroupListScreen }from './lib/CometChat';
class App extends React.Component {
  
 componentDidMount(){
 
 }

  render() {
    return (
      <div  style={{height:"100vh",overflowY:"auto", overflowX:"hidden"}}>
      <Router>    
          <Switch>
          <Route exact path="/">
          <HomePage></HomePage>
          </Route>
          <Route path="/login">
          <KitchenSinkApp></KitchenSinkApp>
          </Route>
          <Route path="/embeded-app"> 
          <CometChatUnified></CometChatUnified>           
          </Route>
          <Route path="/contact-list"> 
          
           <CometChatUserList onItemClick={(item)=>{
              alert("item clicked"+ JSON.stringify(item.name));
           }}></CometChatUserList> 
          
          </Route>
          <Route path="/group-list"> 
          <CometChatGroupList onItemClick={(item)=>{
              alert("item clicked"+ JSON.stringify(item.name));
           }}></CometChatGroupList> 
          </Route>
          <Route path="/conversations-list"> 
          <CometChatConversationList onItemClick={(item)=>{
              alert("item clicked"+ JSON.stringify(item.name));
           }}></CometChatConversationList> 
          </Route>
          <Route path="/contact-screen"> 
          <CometChatUserListScreen></CometChatUserListScreen>
          </Route>
          <Route path="/conversation-screen"> 
          <CometChatConversationListScreen></CometChatConversationListScreen>
          </Route>
          <Route path="/group-screen"> 
          <CometChatGroupListScreen></CometChatGroupListScreen>
          </Route>
          <Route path="/components"> 
          <AllComponents></AllComponents>
          </Route>
        </Switch>  
      </Router>
</div>
    );
  }
}



export default App;
