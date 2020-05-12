
import { logger } from "sage";

// import { render } from "../render/render";
import { apps } from "../constants/apps.constant";
import { createData } from "../services/create-data.service";

import { Module } from "../models/Module.model";
import { Template } from "../models/Template.model";

export var createApp = function(
    dillModule,
    Data = function(){},
    element = document.body
){

// -- Dev
    if (!(dillModule instanceof Module)) {
        logger("Dill","create","dillModule","You must pass a dillModule to the module part of createApp (dillModule,Data,DOM element).");
    }
    if (!(Data instanceof Function)) {
        logger("Dill","create","Data","You must pass a Function to the Data part of createApp (dillModule,Data,DOM element).");
    }
    if (!(element instanceof Element)) {
        logger("Dill","create","element","You must pass a DOM Element to the element part of createApp (dillModule,Data,DOM element).");
    }
// /-- Dev

/* Create the root level data. */
    const data = createData(new Data());
/* We need to add the relevant module here to so that components can be looked up. */
    data._module = dillModule;

    const template = new Template(dillModule,data,element);
    apps.push(template);

    data.onprerender && data.onprerender();

    // render(template,0);

    data.oninit && data.oninit();

    return data;
}
