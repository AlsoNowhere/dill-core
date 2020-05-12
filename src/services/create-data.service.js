
import { define } from "sage";

export const createData = (newData,parentData) => {
    const Data = function(){
        for (let key in newData) {
            let _value = newData[key];
            define(this,key,()=>_value,value=>_value=value);
        }
        if (parentData !== undefined) {
            this._parent = parentData;
        }
    }
    Data.prototype = parentData === undefined
        ? {}
        : parentData;
    return new Data();
}
