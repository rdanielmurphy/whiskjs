const Util = Object.assign({}, {
    searchForStateVars : function(val) {
        var results = [];
        
        var regEx = new RegExp('(\\$\\{[\\w\\(\\)]*\\})', 'g');
        var response = regEx.exec(val);
        while(response) {
            results.push(response[0]);
            response = regEx.exec(val);
        }
        
        return results;
    },
    mergeObjects : function(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    },
    replaceAllStateVars : function(string, scope) {
        var vars = this.mergeObjects(scope, scope.state);

        var newString = "'" + string + "'";
    
        var results = this.searchForStateVars(string);
        
        for (let value of results) {
            var key = value.substring(2, value.length - 1);
            newString = newString.split(value).join("' + this." + key + " + '");
        }

        var func = new Function("return " + newString + ";");
        newString = func.apply(vars);
        
        return newString;
    }
});

export default Util;