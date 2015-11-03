# jquery-plugin-boilerplate
Template for jquery plugin. Support CommonJS module, with/without jquery

#Using Person (with JQuery)
```javascript
var person = $("#IDSelector").Person();

// Call a method on the MyPlugin
var name = person.Person('getName');

// For non-getter methods, you can chain together commands
    person
        .Person('setName', 'Juan')
        .Person('setAge', 7);
```
#Using Person (without JQuery)
```javascript

// Instantiate a Person
var person = new Person("#selector", {
    // initial options object
});

// Call a method on the Person
var name = person.getName();

// For non-getter methods, you can chain together commands
person
    .setName('Juan')
    .setAge(7);
```

#Using as CommonJS module
```javascript
var Person = require("Person");
var person = new Person();
```

#What if there is already a Person plugin bound to the JQuery namespace?
```javascript
// Instantiate a Person
var person = $("#selector").Person2();

// Call a method on the slider
var value = person.Person2('getName');

// For non-getter methods, you can chain together commands
    person
        .Person2('setName', 'Juan')
        .Person2('setAge', 7);
```


