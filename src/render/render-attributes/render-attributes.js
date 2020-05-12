
import { forEach } from "sage";

import { resolveData } from "../../services/resolve-data.service";
import { deBracer } from "../../services/de-bracer.service";
import { attributeSpecialCharacter } from "../../constants/attribute-special-character.constant";
import { elementProperties } from "../../constants/element-properties.constant";

export const renderAttributes = template => {
    const data = template.data;
    const element = template.element;

    if (!template.attributes) {
        return;
    }

    // console.log("Att: ", template.attributes, element, data);

    forEach(template.attributes,attribute => {
        if (attribute.name.charAt(attribute.name.length-1) === attributeSpecialCharacter) {
            const name = attribute.name.substring(
                0,
                attribute.name.length-1
            );
            const value = resolveData(
                data,
                attribute.value
            );
            if (elementProperties.indexOf(name) > -1) {
                element[name] = value;
            }
            else if (value === false || value === "") {
                element.removeAttribute(name);
            }
            else {
                element.setAttribute(name,value);
            }
        }
        else {
            element.setAttribute(
                attribute.name,
                deBracer(attribute.value,data)
            );
        }
    });
}
