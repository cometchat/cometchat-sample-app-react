const monthNames = [
    "Jan", 
    "Feb",
    "Mar", 
    "Apr", 
    "May", 
    "Jun",
    "Jul", 
    "Aug", 
    "Sep", 
    "Oct", 
    "Nov", 
    "Dec"
];



export function calculateAvailableHeight(top = 0 ,bottom = 0,tag="system"){
   
    var cc_app  = document.getElementById("cometchat");
    
    var availableHeight = cc_app.offsetHeight;
    var totalAvailableHeightDiv = (availableHeight - (top + bottom));

    return (totalAvailableHeightDiv);
  
}


/**function isEmpty  
 * 
 * Input : Any object
 * output : boolean
 */
export function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

/**function CheckEmpty  
 * 
 * Input : Any object
 * output : boolean
 */

export function CheckEmpty(obj){
    
    if(obj === undefined){
        return false;
    }else if(obj.length === 0) {
        return false;
    }else{
        return true;
    }
} 


export function convertStringToDate(strTime){
    var timestamp = Number(strTime)*1000;
    var date = new Date(timestamp);
    let timestr = formatAMPM(date);
    return (timestr.toString());
    
  
}

function formatAMPM(date) {

    var hours = date.getHours();
    var minutes = date.getMinutes();

    var ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;

    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

