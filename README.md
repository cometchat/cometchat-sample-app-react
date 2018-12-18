
  

# Javascript Reactjs Sample using CometChat Pulse 

This is full screen chat sample like Facebook Messenger using the [CometChat Pulse SDK](https://cometchat.com) for desktop browsers.


  

1. [Config Development Environment](#Config-your-Development-Environment)

2.  [Config Chat App](#Config-Chat-App)

3. [Run the Sample](#Run-the-Sample)


  
  
  

## Config Development Environment

Setup your development environment for **Reactjs** Sample. 

If you don't have node install, Please download appropriate version from official website: [Nodejs.org](https://nodejs.org/)

Once node and npm is installed successfully. You can verify from running following  command : 
```bash

node -v

```
```bash

npm -v

```


Now you are ready to sync application dependencies.  Please follow the following steps:



1. Install packages 


  

```bash

npm install

```

Please Check **package.json** file for the dependency list. 

  

## Config Chat App

If you want to put some changes into the sample app, you should build it using `webpack`. Sample uses Webpack version : 4+

>To know more about Webpack, visit Webpack official documentation : [HERE](https://webpack.js.org/concepts/)
  
Please change  `appId` and `apiKey` in *src/js/lib/cometchat/ccmanager.js* to the provided credentials.

 ![Studio Guide](https://github.com/CometChat-Pulse/javascript-reactjs-chat-app/blob/master/screenshots/code.png)   


## Run the Sample


1. Test the sample 

You can test the sample with local server by running the following command.

```bash

npm run dev

```

Navigate to **localhost:8080** to check sample app.  You can update host in **package.json** file.   
  

2. Build the sample

  

When the modification is complete, you'll need to bundle the file using `webpack`. The bundled files are created in the `test` folder.

Please check `webpack.config.js` for settings.
  

```bash

npm run build

```
# Screenshots

![Studio Guide](https://github.com/CometChat-Pulse/javascript-reactjs-chat-app/blob/master/screenshots/chat.png)   




#  NOTE : 
Develop you Real time Chat Application using Cometchat pulse. 


Download CometChat Pulse from npm library : 
[https://www.npmjs.com/package/@cometchat-pulse/cometchat-pulse.js](https://www.npmjs.com/package/@cometchat-pulse/cometchat-pulse.js)
