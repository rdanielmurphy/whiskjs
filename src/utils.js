const Util = Object.assign({}, {
    searchForStateVars : function(val) {
        var results = [];
        
        var regEx = new RegExp('(\\$\\{\\w*\\\})', 'g');
        var response = regEx.exec(val);
        while(response) {
            results.push(response[0]);
            response = regEx.exec(val);
        }
        
        return results;
    },
    replaceAllStateVars : function(string, vars) {
        var newString = string;
    
        var results = this.searchForStateVars(string);
        
        for (let value of results) {
            var key = value.substring(2, value.length - 1);
            var newValue = vars[key];
            newString = newString.split(value).join(newValue);
        }
        
        return newString;
    }
});

export default Util;