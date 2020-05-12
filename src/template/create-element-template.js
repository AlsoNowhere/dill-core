
import { Component } from "dill-core";
import { forEach } from "sage";

import { dillModule } from "../module/Module.model";

export var createElementTemplate = function(
    nameOrComponent,
    attributes,
    children
){
    var name,
        element;

    if (typeof nameOrComponent === "string") {
        name = nameOrComponent;
    }
    else if (nameOrComponent instanceof Object && nameOrComponent.component instanceof Component) {
        name = nameOrComponent.component.name;
        dillModule.setComponent(nameOrComponent);
    }

    element = document.createElement(name);

    if (attributes instanceof Array) {
        attributes.forEach(function(attribute){
            element.setAttribute(attribute.name,attribute.value);
        });
    }

    if (children instanceof Array) {
        forEach(children,function(child){
            if (child instanceof Array) {
                children = child;
                return false;
            }
        });
        children.forEach(function(child){
            typeof child === "string" && (child = document.createTextNode(child));
            element.appendChild(child);
        });
    }

    return element;
}
