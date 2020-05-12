
import { forEach, reverseForEach } from "sage";

import { createData } from "../services/create-data.service";
import { TemplateComponent } from "../models/TemplateComponent.model";
// import { Template } from "../models/Template.model";

export var createComponent = function(template,TemplateModel){
    var element = template.element;
    var name = template.name.toLowerCase();
    var data = template.data;
    var parentData = template.data;
    var childTemplate;
    var newTemplateComponent;
    var isIsolated;
    var component = template._module.components[name];

    if (!component) {
        return false;
    }

    isIsolated = component.Component.component.isolated;

    if (element.attributes["dill-isolate"]) {
        if (element.attributes["dill-isolate"].nodeValue === "true") {
            isIsolated = true;
        }
        else if (element.attributes["dill-isolate"].nodeValue === "false") {
            isIsolated = false;
        }
    }

    template.data = createData(
        new component.Component(),
        isIsolated
            ? undefined
            : parentData
    );
    template.data._template = element.innerHTML;

    reverseForEach(element.children,function(child){
        element.removeChild(child);
    });

    childTemplate = component.template;

    dill.renderComponent
        ? dill.renderComponent(template,childTemplate)
        : dill.defaultRenderComponent(template,childTemplate);

    // console.log("Children: ", children);

    // if (typeof children === "string") {
    //     element.innerHTML = children;
    // }
    // else {
    //     forEach(children,function(child){
    //         if (child instanceof Array) {
    //             children = child;
    //             return false;
    //         }
    //     });

    //     (function(){
    //         var parent = template.parent;
    //         // console.log("Parent: ", template);
    //         while (parent !== undefined && parent.component instanceof TemplateComponent) {
    //             parent = parent.parent;
    //         }
    //         children.forEach(function(x){
    //             var clone;
    //             typeof x === "string" && (x = document.createTextNode(x));
    //             clone = x.cloneNode(true);
    //             parent.orderOfChildren.push(clone);
    //             element.appendChild(clone);
    //         });
    //     }());
    // }

    if (element.attributes["dill-isolate"]) {
        element.removeAttribute("dill-isolate");
    }
    if (component.module !== data._module) {
        template.data._module = component.module;
    }

    template.data._dillTemplate = template;
    
    reverseForEach(element.attributes,function(attribute){
        var name = attribute.nodeName;
        if (attribute.nodeValue.charAt(0) === "'" && attribute.nodeValue.charAt(attribute.nodeValue.length-1) === "'") {
            template.data[name] = attribute.nodeValue.substring(1,attribute.nodeValue.length-1);
        }
        else {
            Object.defineProperty(template.data,name,{
                get: function(){
                    return parentData[attribute.nodeValue];
                },
                set: function(value){
                    parentData[attribute.nodeValue] = value;
                }
            });
        }
        element.removeAttribute(name);
    });

    // template.data.onprerender && template.data.onprerender.apply(template.data);

    newTemplateComponent = new TemplateComponent(Array.prototype.slice.call(element.children));

    forEach(element.children,function(child){
        element.parentNode.insertBefore(child,element);
        return -1;
    });
    element.parentNode.removeChild(element);

    forEach(newTemplateComponent.children,function(child){
        template.childTemplates.push(new TemplateModel(template._module,template.data,child,template));
    });

    return newTemplateComponent
}
