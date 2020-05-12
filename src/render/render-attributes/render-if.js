
import { forEach } from "sage";

import { resolveData } from "../../services/resolve-data.service";
// import { render } from "../render";
// import { Template } from "../../models/Template.model";
import { TemplateComponent } from "../../models/TemplateComponent.model";
import { indexOf } from "../../common/index-of";

const fireOnInsertedEvents = function(template){
    if (template.component instanceof TemplateComponent && template.data.hasOwnProperty("oninserted")) {
        template.data.oninserted();
    }
    template.childTemplates && forEach(template.childTemplates,function(x){
        if (x.if && !x.if.initialValue) {
            return;
        }
        fireOnInsertedEvents(x);
    });
}

const removeChildElements = function(parent,childTemplates){
    forEach(childTemplates,function(childTemplate){
        if (childTemplate.component instanceof TemplateComponent) {
            removeChildElements(parent,childTemplate.childTemplates);
        }
        else if (childTemplate.element.parentNode === parent) {
            parent.removeChild(childTemplate.element);
        }
    });
}

export const renderIf = function(template,Template,render){

    const element = template.element;
    const data = template.data;

    let newValue = resolveData(data,template.if.value);

    if (template.if.inverse) {
        newValue = !newValue;
    }
    if (newValue && template.if.initialValue) {
        return;
    }
    else if (newValue && !template.if.initialValue) {
        if (template.parent.component instanceof TemplateComponent) {
            (function(){
                var parent = template.parent;
                var elementIndex;
                var added = false;
                while (parent !== undefined && parent.component instanceof TemplateComponent) {
                    parent = parent.parent;
                }
                elementIndex = indexOf(parent.orderOfChildren,element);
                forEach(template.if.parent.children,function(child){
                    var isOnDOM = child.parentNode !== null;
                    var childIndex = indexOf(parent.orderOfChildren,child);
                    if (element === child || !isOnDOM || childIndex < elementIndex) {
                        return;
                    }
                    template.if.parent.insertBefore(element,child);
                    added = true;
                    return false;
                });
                if (!added) {
                    template.if.parent.appendChild(element);
                }
            }());
        }
        else {
            let referenceChild = null;
            const currentIndex = template.parent.orderOfChildren.indexOf(element);
            forEach(template.if.parent.childNodes,child => {
                if (template.parent.orderOfChildren.indexOf(child) <= currentIndex) {
                    return;
                }
                referenceChild = child;
                return false;
            });
            template.component instanceof TemplateComponent
                ? forEach(template.component.children,function(child){
                    referenceChild === null
                        ? template.if.parent.appendChild(child)
                        : template.if.parent.insertBefore(child,referenceChild);
                })
                : referenceChild === null
                    ? template.if.parent.appendChild(element)
                    : template.if.parent.insertBefore(element,referenceChild);
        }
        if (!template.if.templated) {
            const newTemplate = new Template(template.dillModule,template.data,element,template);
            template.childTemplates = newTemplate.childTemplates;
            template.attributes = newTemplate.attributes;
            template.if.templated = true;
            if (newTemplate.component instanceof TemplateComponent) {
                template.component = newTemplate.component;
                template.data = newTemplate.data;
            }
        }
        fireOnInsertedEvents(template);
        template.if.initialValue = true;
        render(template);
        return 2;
    }
    else if (!newValue && template.if.initialValue) {
        template.component instanceof TemplateComponent
            ? removeChildElements(template.if.parent,template.childTemplates)
            : template.if.parent.removeChild(element);
        template.if.initialValue = false;
        return 0;
    }
    return 1;
}
