# jquery-plugin-boilerplate
Template for jquery plugin. Support CommonJS module, with/without jquery

#Using MyPlugin (with JQuery)
```javascript
var myPlugin = $("#IDSelector").MyPlugin();

// Call a method on the MyPlugin
var value = myPlugin.MyPlugin('getMethod1');

// For non-getter methods, you can chain together commands
    myPlugin
        .slider('setValue', 5)
        .slider('setValue', 7);
```
#Using MyPlugin (without JQuery)
```javascript

// Instantiate a myplugin
var myPlugin = new MyPlugin("#selector", {
    // initial options object
});

// Call a method on the MyPlugin
var value = myPlugin.getValue();

// For non-getter methods, you can chain together commands
myPlugin
    .setValue(5)
    .setValue(7);
```

#Using as CommonJS module
```javascript
var MyPlugin = require("MyPlugin");
var myPlugin = new MyPlugin();
```

#What if there is already a MyPlugin plugin bound to the JQuery namespace?
```javascript
// Instantiate a MyPlugin
var myPlugin = $("#selector").MyPlugin2();

// Call a method on the slider
var value = myPlugin.MyPlugin2('getValue');

// For non-getter methods, you can chain together commands
    myPlugin
        .MyPlugin2('setValue', 5)
        .MyPlugin2('setValue', 7);
```


