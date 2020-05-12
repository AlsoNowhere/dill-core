
import { forEach } from "sage";
import { render } from "../render/render";
import { apps } from "../constants/apps.constant";

export var change = function(data){
    // console.log("Change: =======================================");
    if (data === undefined) {
        return forEach(apps,function(x){
            render(x);
        });
    }
    else {
        render(data,
            Array.prototype.indexOf.apply(data._dillTemplate.element.parentNode.children,[data._dillTemplate.element])    
        );
    }
}
