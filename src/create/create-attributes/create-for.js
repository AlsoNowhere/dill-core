
export var createFor = function(template){
    var element = template.element;
    var value;

    if (!element.attributes["dill-for"]) {
        return;
    }
    value = element.attributes["dill-for"].nodeValue;
    element.removeAttribute("dill-for");
    template.for = new function TemplateFor(){
        this.initialCount = 0;
        // this.clone = element.cloneNode(true);
        this.clone = element;
        this.value = value;
        this.parent = element.parentElement;
        this.templates = [];
        Object.seal(this);
    }
    element.parentElement.removeChild(element);
}
