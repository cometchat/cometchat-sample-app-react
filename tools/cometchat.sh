#!/usr/bin/env bash
#!/bin/bash

DIR="cometchat-sample"
CCMANAGER_PATH="src/js/lib/cometchat/"

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

		printf " Please install Node and Npm"
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

curl -LJ https://github.com/cometchat-pro-samples/javascript-reactjs-chat-app/archive/master.zip -o $DIR.tar.gz

printf "\n Sample App is downloaded to \e[34 $(pwd)/$DIR \e[0 \n"
echo ""


echo "=========== Upacking Sample App ==========="

tar xvzf $DIR.tar.gz &> /dev/null

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
if [ $WENV ]
then
# for dev 
	npm run dev -- --cc_apikey $APIKEY --cc_appId $APPID

else
# for build 
	npm run build -- --cc_apikey $APIKEY --cc_appId $APPID
fi