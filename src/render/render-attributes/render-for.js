
import { forEach } from "sage";

import { resolveData } from "../../services/resolve-data.service";
import { createData } from "../../services/create-data.service";

const DillFor = function(_item,_index){
    this._item = _item;
    this._index = _index;
};

const cleanData = function(data,list,template,forIndex){
    var key;
    var listItem = list[forIndex];
    if (listItem instanceof Object) {
        for (key in data) {
            if (!listItem.hasOwnProperty(key)) {
                delete data[key];
            }
        }
        for (key in listItem) {
            if (data.hasOwnProperty(key)) {
                data[key] = listItem[key];
            }
            else {
                Object.defineProperty(data,key,{
                    value: listItem[key],
                    writable: true
                });
            }
        }
    }
    data._item = listItem;
    data._index = forIndex;
    data._parent = template.data;
};

export const renderFor = function(template,Template,render){
    var initialCount;
    var parent;
    var list;
    var clone;
    var i = 0;
    var newClone;
    var data;
    var nextElement;
    var newTemplate;
    if (!template.for) {
        return;
    }
    initialCount = template.for.initialCount;
    parent = template.for.parent;
    list = resolveData(template.data,template.for.value);
    clone = template.for.clone;
    let referenceChild = null;
    let index = template.for.parent.childNodes.length-1;
    const currentIndex = template.parent.orderOfChildren.indexOf(template.for.clone);
    forEach(template.for.parent.childNodes,(child,i) => {
        if (template.parent.orderOfChildren.indexOf(child) <= currentIndex) {
            return;
        }
        index = i-1;
        referenceChild = child;
        return false;
    });
    if (initialCount > list.length) {
        for (; i < initialCount - list.length ; i++) {
            parent.removeChild(parent.childNodes[index]);
            template.for.templates.splice(index,1);
        }
        i = 0;
        for (; i < list.length ; i++) {
            data = template.for.templates[i].data;
            cleanData(data,list,template,i);
        }
    }
    else if (initialCount < list.length) {
        for (; i < list.length - initialCount ; i++) {
            newClone = clone.cloneNode(true);
            nextElement = parent.childNodes[index+initialCount+i];
            nextElement !== undefined
                ? parent.insertBefore(newClone,nextElement)
                : parent.appendChild(newClone);
            data = createData(new DillFor(list[initialCount+i],initialCount+i),template.data);
            cleanData(data,list,template,initialCount+i);
            newTemplate = new Template(template.dillModule,
                data,
                newClone,
                template
            );
            template.for.templates.push(newTemplate);
        }
        i = 0;
        for (; i < initialCount ; i++) {
            data = template.for.templates[i].data;
            cleanData(data,list,template,i);
        }
    }
    else {
        for (; i < initialCount ; i++) {
            data = template.for.templates[i].data;
            cleanData(data,list,template,i);
        }
    }
    forEach(template.for.templates,function(forTemplate){
        render(forTemplate);
    });
    template.for.initialCount = list.length;
    return list.length;
}
