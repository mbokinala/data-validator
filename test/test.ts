import { validate, isDefined, isNotEmpty, isType, isGreaterThan } from "../src/index";

let data = {
    name: 'John',
    age: 18,
    occupation: 'Programmer',
    colors: [
        'red',
        'green',
        'blue'
    ]
}

let [valid, errors] = validate(data, {
    name: [isDefined],
    age: [isDefined, isType('number'), isGreaterThan(17)],
    occupation: [isDefined, isNotEmpty],
    colors: [isDefined]
})

if (!valid) {
    console.log('not valid');
    console.log(JSON.stringify(errors, null, 4));
}