
import { forEach } from "sage";
import { deBracer } from "../services/de-bracer.service";
import { renderAttributes } from "./render-attributes/render-attributes";
// import { renderIf } from "./render-attributes/render-if";
// import { renderFor } from "./render-attributes/render-for";
// import { renderDillTemplate } from "./render-attributes/render-dill-template";
import { TemplateComponent } from "../models/TemplateComponent.model";

// -- Development only --
// var limit = 0;
// /-- Development only --

export var render = function(template,index){

// -- Development only --
// Prevent and infinite loop
    // limit++;
    // if (limit > 500) {
    //     return console.log("Limit reached");
    // }
// /-- Development only --

    var data = template.data;
    var element = template.element;
    var ifResult;

    if (template.name === "#comment" || template.name === "SCRIPT") {
        return;
    }

    if (template.name === "#text") {
        element.nodeValue = deBracer(template.textValue,data);
        return;
    }

    // if (template.if) {
    //     ifResult = renderIf(template,index);
    //     if (typeof ifResult === "number") {
    //         return ifResult;
    //     }
    // }

    // if (template.for) {
    //     return renderFor(template,index);
    // }

    if (!(template.component instanceof TemplateComponent)) {
        // renderDillTemplate(template);
        renderAttributes(template);
    }
    // else if (template.data.hasOwnProperty("onchange")) {
    //     template.data.onchange();
    // }

    template.childTemplates && forEach(template.childTemplates,function(x){
        render(x,x.index);
    });
}
