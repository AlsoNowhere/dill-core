
export const createData = (newData, parentData) => {
    const Data = function(){
        for (let key in newData) {
            let _value = newData[key];
            Object.defineProperty(this, key, {
                get: () => _value,
                set: value => _value = value,
                enumerable: true,
                configurable: true
            });
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
