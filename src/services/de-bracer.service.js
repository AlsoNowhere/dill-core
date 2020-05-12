import { resolveData } from "./resolve-data.service";

export var deBracer = function(string,data){
    return string.replace(/{[A-Za-z0-9_$]+}/g,function(match,index){
        if (string.charAt(index-1) === "\\") {
            return match;
        }
        return resolveData(data,match.substring(1,match.length-1));
    });
}
