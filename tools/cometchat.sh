#!/usr/bin/env bash
#!/bin/bash

DIR="cometchat-sample"
CCMANAGER_PATH="src/js/lib/cometchat/"

WDIR=$(pwd)

while getopts :k:i:d: options; do

	case $options in 
		k) APIKEY=$OPTARG;;
		i) APPID=$OPTARG;;
		d) WENV=$OPTARG;;
	esac
done

if [ -e $APIKEY ] 
then
	echo "ERROR :  API Key is not provided. Exiting...  "
	exit;	
fi

if [ -e $APPID ] 
then
	echo " APP ID is not provided. Exiting...  "
	exit;	
fi

if [ -e $WENV ] 
then	
	WENV=true
fi

# check for node and npm 

echo "=========== Checking for System Environment  ==========="
if which node > /dev/null
	then
        echo " Node is installed "
		
		printf " Node version : "  
		node -v 	
		
		printf " NPM version : "  
		npm -v
		
    else

		printf " Please install Node and NPM"
		exit;
fi

printf " System Envrionment is READY [\e[32m*\e[0m] \n"
echo ""

echo "=========== Downloading Sample App ==========="
if [ -e $DIR ]
then
	
printf "\n Repo is Present, SKIPPING Downloading...[\e[32m*\e[0m] \n"
echo "" 
else	

wget -q -c https://github.com/cometchat-pro-samples/javascript-reactjs-chat-app/archive/master.tar.gz -O $DIR.tar.gz || curl -LJ https://github.com/cometchat-pro-samples/javascript-reactjs-chat-app/archive/master.tar.gz -o $DIR.tar.gz

printf "\n Sample App is downloaded to \e[34 $WDIR/$DIR\e[0 \n"
echo ""


echo "=========== Unpacking Sample App ==========="

tar -zxvf $DIR.tar.gz &> /dev/null

mv javascript-reactjs-chat-app-master $DIR 

rm $DIR.tar.gz

printf " Sample app is Ready[\e[32m*\e[0m] \n"
echo ""

fi


echo "=========== Updating dependencies ==========="
cd $DIR
npm install

printf "\n Dependencies Syncing Completed [\e[32m*\e[0m] \n"
echo ""


echo "=========== Configuring CometChat Manager ==========="
cd $CCMANAGER_PATH
sed -i.bak "s/ZZZ_CC_APPID/$APPID/g" ccManager.js
sed -i.bak "s/ZZZ_CC_APIKEY/$APIKEY/g" ccManager.js

printf "\n Configuration is Completed [\e[32m*\e[0m] \n"
echo ""





echo "=========== Starting React Server ==========="

echo ""
echo "============================="
echo "CometChat Demo is now live at: https://localhost:5000"
printf "\n  You will recieve 'Your connection is not private' error. \n To Resolve this issue :  \n 1. Please accept the https warning in your browser by clicking Advanced \n2. Proceed to localhost (unsafe) \n "
echo ""
echo "============================="



if [ $WENV ]
then

# echo "Do you want to secured server(https) ? Please  (y/n) : "

# read SECURE_SERVER

# # for dev 
# case $SECURE_SERVER in 
# 			y):
# 					npm run sdev -- --cc_apikey $APIKEY --cc_appId $APPID 
# 				;;

# 			n)
# 				npm run dev -- --cc_apikey $APIKEY --cc_appId $APPID 
# 				;;
# 			*)
# 				echo "Incorrect Input, Starting insecure server"
# 				npm run dev -- --cc_apikey $APIKEY --cc_appId $APPID 
# 				;;
# esac

npm run sdev -- --cc_apikey $APIKEY --cc_appId $APPID 
else
# for build 
	npm run build -- --cc_apikey $APIKEY --cc_appId $APPID
fi