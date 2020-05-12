import { resolveData } from "../../services/resolve-data.service";

export var createIf = function(template){
    var element = template.element;
    var value;
    var inverse = false;
    var initialValue;
    if (!element.attributes["dill-if"]) {
        return true;
    }
    value = element.attributes["dill-if"].nodeValue;
    if (value.substr(0,1) === "!") {
        value = value.substring(1,value.length);
        inverse = true;
    }
    element.removeAttribute("dill-if");
    initialValue = resolveData(template.data,value);
    if (inverse) {
        initialValue = !initialValue;
    }
    template.if = new function TemplateIf(){
        this.initialValue = initialValue;
        this.templated = initialValue;
        this.value = value;
        this.inverse = inverse;
        this.parent = element.parentElement;
        Object.seal(this);
    };
    if (!initialValue) {
        element.parentElement.removeChild(element);
    }
    return initialValue;
}
