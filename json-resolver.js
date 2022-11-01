module.exports = class JSONResolver {

    static action(json, option) {

        option = option ?? {};
        option.replaceKey = option?.replaceKey ?? function(key) { return key };
        option.returnValue = option?.returnValue ?? function (value) { return value };
        
        const result = {}
    
        if (json instanceof Array) {
            const arrResult = []
            for (let i = 0; i < json.length; i++) {
                if (json[i] instanceof Object) {
                    arrResult[i] = JSONResolver.action(json[i], option)
                } else {
                    arrResult[i] = option.returnValue(json[i]);
                }
            }
            return arrResult;
            
        } else {

            for (const key in json) {
                if (json[key] instanceof Object) {
                    result[key] = JSONResolver.action(json[key], option)    
                } else {
                    const keyDesc = Object.getOwnPropertyDescriptor(json, key);
                    const newKey = option.replaceKey(key);
                    delete json[key];
                    Object.defineProperty(json, newKey, keyDesc)
                    result[newKey] = option.returnValue(json[newKey])
                }
            }

            return result;
        }
    
    }

}