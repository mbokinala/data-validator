import { validate, isDefined, isNotEmpty, isType, isGreaterThan, ifDefined, equals } from "../src/index";

let data = {
    name: '',
    age: 22,
    occupation: 'Programmer',
    colors: [
        'red',
        'green',
        'blue'
    ],
}

let [valid, errors] = validate(data, {
    name: [isDefined, ifDefined([equals('12')]), isNotEmpty],
    age: [isDefined, isType('number'), isGreaterThan(21)],
    occupation: [isDefined, isNotEmpty],
    colors: [isDefined]
})

if (!valid) {
    console.log('not valid');
    console.log(JSON.stringify(errors, null, 4));
}