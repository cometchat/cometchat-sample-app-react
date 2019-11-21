<div style="width:100%">
	<div style="width:50%; display:inline-block">
		<p align="center">
		<img align="center" width="180" height="180" alt="" src="https://github.com/cometchat-pro/ios-swift-chat-app/blob/master/Screenshots/CometChat%20Logo.png">	
		</p>	
	</div>	
</div>
<p>CometChat React JS Demo app (built using <strong>CometChat Pro</strong>) is a fully functional messaging app capable of <strong>one-on-one</strong> (private) and <strong>group</strong> messaging along with recent conversations. The app enables users to send <strong>text</strong> , <strong>multimedia messages like audio, video, images, documents and custom messages (eg : location).</strong></p>


## Table of Contents
1. [Screenshots](#Screenshots)
2. [Config Development Environment](#Config-your-Development-Environment)
3. [Config Chat App](#Config-Chat-App)
4. [RUN App](#RUN-App)
5. [Contributing](#Contribute)


## Screenshots
<p style="display:block;">
	<a target="_blank" rel="noopener noreferrer" href="https://github.com/cometchat-pro-samples/javascript-reactjs-chat-app/blob/master/readme screenshots/login.gif"><img align="center" src="readme screenshots/login.gif" style="max-width:100%;"></a>
</p>
<p style="display:block;">
	<a target="_blank" rel="noopener noreferrer" href="https://github.com/cometchat-pro-samples/javascript-reactjs-chat-app/blob/master/readme screenshots/search-and-one-on-one.gif"><img align="center" src="readme screenshots/search-and-one-on-one.gif" style="max-width:100%;"></a>
</p>
<p style="display:block;">
	<a target="_blank" rel="noopener noreferrer" href="https://github.com/cometchat-pro-samples/javascript-reactjs-chat-app/blob/master/readme screenshots/groups.gif"><img align="center" src="readme screenshots/groups.gif" style="max-width:100%;"></a>
</p>


## Config-your-Development-Environment
Clone or checkout the project using git or svn using the mentioned web URL

```bash

git clone <URL>

```

If you don't have node install, Please download appropriate version from official website: [Nodejs.org](https://nodejs.org/)

Once node and npm is installed successfully. You can verify from running following  command : 
```bash

node -v

```
```bash

npm -v

```

Now you are ready to sync application dependencies.  Please follow the following steps:


```bash

npm install

```

## Config-Chat-App

<h2> v2.0+ </h2>
<h4>
	Checkout master or v2 branch.
</h4>
<h4>Get your Application Keys</h4>
<a href="https://app.cometchat.io/" target="_blank">Signup for CometChat</a> and then:

1. Create a new app - select version as v2 and region as Europe or USA.
<p style="clear:both; display:block;">
	<a target="_blank" rel="noopener noreferrer" href="https://github.com/cometchat-pro-samples/javascript-reactjs-chat-app/blob/master/readme screenshots/constants.png"><img align="center" src="readme screenshots/create-v2-app.gif" style="max-width:100%;"></a>
</p>
2. Head over to the API Keys section and click on the Create API Key button
3. Enter a name and select the scope as Auth Only
4. Now note the API Key and App ID
5. Replace  `APP_ID`, &nbsp; `API_KEY` and &nbsp; `APP_REGION` in *src/constants.js* with your APP ID, &nbsp; API KEY &nbsp;and&nbsp; APP Region respectively.<br/>

Note : APP Region values to "us" or "eu".

<p style="clear:both; display:block;">
	<a target="_blank" rel="noopener noreferrer" href="https://github.com/cometchat-pro-samples/javascript-reactjs-chat-app/blob/master/readme screenshots/constants.png"><img align="center" src="readme screenshots/constants.png" style="max-width:100%;"></a>
</p>

<h2> v1.0+ </h2>
<h4>
	Checkout v1 branch.
</h4>
<h4>Get your Application Keys</h4>

<a href="https://app.cometchat.io/" target="_blank">Signup for CometChat</a> and then:

1. Create a new app - select version as v1

<p style="clear:both; display:block;">
	<a target="_blank" rel="noopener noreferrer" href="https://github.com/cometchat-pro-samples/javascript-reactjs-chat-app/blob/master/readme screenshots/constants.png"><img align="center" src="readme screenshots/create-v1-app.gif" style="max-width:100%;"></a>
</p>
<br>

2. Head over to the API Keys section and click on the Create API Key button<br/>
<br>

3. Enter a name and select the scope as Auth Only<br/>
<br>

4. Now note the API Key and App ID<br/>
<br>

5. Replace  `APP_ID`, &nbsp; `API_KEY` in *src/constants.js* with your APP ID, &nbsp;and&nbsp; API KEY respectively.<br/>

<p style="clear:both; display:block;">
	<a target="_blank" rel="noopener noreferrer" href="https://github.com/cometchat-pro-samples/javascript-reactjs-chat-app/blob/master/readme screenshots/constants.png"><img align="center" src="readme screenshots/constants.png" style="max-width:100%;"></a>
</p>


## Run-App

And your are done! You can now run your app by running the following command.

```bash

npm start

```


## Contribute 

Feel free to make a suggestion by creating a pull request.
