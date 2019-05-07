
import defaultLang from "./default.js";
import enLang from "./enLang.js";
import hinLang from "./hinLang.js";

export let langCode = "en";

function translate(){
    console.log("inside " + langCode);
    if(langCode && langCode.length != 0){
        switch(langCode){

            case 'en':

                console.log("inside enlang");
                return enLang;        
            break;

            case 'hin':
                 return hinLang;   
            break;

            case 'default':
                return defaultLang;        
            break;
        }
    }else{
        console.log("inside else");
        return defaultLang;
    }
  
};

export default translate = translate();




