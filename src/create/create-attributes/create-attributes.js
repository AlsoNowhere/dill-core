
import { reverseForEach } from "sage";

// import { change } from "../../services/change.service";
import { resolveData } from "../../services/resolve-data.service";

export var attributeSpecialCharacter = "-";

export var createAttributes = function(template){
    var element = template.element;
    var data = template.data;
    var extendsValue;
    var property;

    if (element.attributes["dill-extends"]) {
        extendsValue = resolveData(template.data,element.attributes["dill-extends"].nodeValue);
        for (let key in extendsValue) {
            property = key;
            element.setAttribute(property,extendsValue[key]);
        }
        element.removeAttribute("dill-extends");
    }

    template.attributes = reverseForEach(element.attributes,function(attribute){
        var name = attribute.nodeName;
        var attrName;
        if (name.substr(name.length-3) === "---") {
            template.data[name.substring(0,name.length-3)] = element;
            element.removeAttribute(name);
            return 0;
        }
        else if (
            name.substr(name.length-2) === attributeSpecialCharacter + attributeSpecialCharacter) {
            attrName = name.substring(0,name.length-2);
            element.addEventListener(
                attrName,
                function(event){
                    var checkForFalse = data[attribute.nodeValue].apply(data,[event,element]);
                    if (checkForFalse !== false) {
                        dill.change();
                    }
                }
            );
            element.removeAttribute(name);
            return 0;
        }
        else if (name.substr(name.length-1) === attributeSpecialCharacter) {
            element.removeAttribute(attribute.nodeName);
        }
        return {
            name: name,
            value: attribute.nodeValue
        };
    });
}
