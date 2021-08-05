# Data Validation

A (work in progress) data validation library

## Installation
```shell
npm install @mbokinala/data-validator
```
or
```shell
yarn add @mbokinala/data-validator
```

## Example
```js
const {validate, isDefined, isNotEmpty, isType, isGreaterThan, validateArray, includes} = require('@mbokinala/data-validator');

let data = {
    age: 18,
    profession: false,
    favoriteLanguages: [
        'java',
        'go',
        12,
        'python'
    ]
}

let [valid, errors] = validate(data, {
    name: [isDefined, isType('string'), isNotEmpty],
    age: [isDefined, isType('number'), isGreaterThan(21)],
    profession: [isDefined, isType('string')],
    favoriteLanguages: [isDefined, validateArray([isDefined, isType('string')]), includes('typescript')]
})

console.log('Validation result is', valid);

if (!valid) {
    console.log(JSON.stringify(errors, null, 4));
} else {
    console.log('valid');
}
```
Output:
```
Validation result is false
{
    "name": [
        "is null or undefined",
        "is not of type `string`",
        "is empty"
    ],
    "age": [
        "is not greater than 21"
    ],
    "profession": [
        "is not of type `string`"
    ],
    "favoriteLanguages": [
        {
            "2": [
                "is not of type `string`"
            ]
        },
        "does not include `typescript`"
    ]
}
```

## Usage
`validate(data, validators) => [valid: boolean, errors? ValidationErrors]`
The library is designed so that you can return `errors` as a JSON object in something like a REST API.

`validators` should match the structure of the data you want to validate. For each key, the value should be an array of validator functions to be run on the field.
There are some built-in validator functions (see below), but you can create custom validators using the format:

```js
// valid: true if input passes the validation test, false if otherwise
// message: an error message to be displayed if validation fails
(input: any) => [valid: boolean, message?: string];
```

### Built-in validators:
| Function                                         | Description                                                        |
|--------------------------------------------------|--------------------------------------------------------------------|
| `isDefined`                                      | Passes if input is not `null` or `undefined`                       |
| `isType(type: string)`                           | Passes if input matches provided type                              |
| `isNotEmpty`                                     | Passes if input string or array is not empty                       |
| `equals(val: any)`                               | Passes if input matches provided value                             |
| `includes(element: any)`                         | Passes if input array contains provided element                    |
| `isGreaterThan(val: number)`                     | Passes if input is greater than provided value                     |
| `isGreaterThanOrEqualTo(val: number)`            | Passes if input is greater than or equal to provided value         |
| `isLessThan(val: number)`                        | Passes if input is less than provided value                        |
| `isLessThanOrEqualTo(val: number)`               | Passes if input is less than or equal to provided value            |
| `validateArray(validators: ValidatorFunction[])` | Passes if all elements in input array pass all provided validators |
