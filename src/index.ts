type ValidatorFunction = (input: any) => [valid: boolean, message?: string | ValidationErrors];

interface ValidationErrors {
    [key: string]: (string | ValidationErrors)[]
}

interface Validators {
    [key: string]: ValidatorFunction[];
}

interface Data {
    [key: string]: any
}

export function validate(data: Data, validators: Validators): [valid: boolean, errors?: ValidationErrors] {
    let errors: ValidationErrors = {};
    let allValid = true;
    for (const property in validators) {
        if (validators[property]) {
            let propValid = true;
            errors[property] = [];
            for (const validatorFunction of validators[property]) {
                let [valid, message] = validatorFunction(data[property]);
                if (!valid) {
                    propValid = false;
                    errors[property].push(message!);
                }
            }

            if (!propValid) allValid = false;
        }
    }

    errors = clean(errors);

    return [allValid, errors];
}

function clean(errors: ValidationErrors) {
    for (var propName in errors) {
        if (errors[propName].length === 0) {
            delete errors[propName];
        }
    }
    return errors
}

/**
 * Passes if input is not `null` or `undefined`
 */
export const isDefined: ValidatorFunction = (input: any): [valid: boolean, message?: string] => {
    if (input == null) { // null == undefined so this catches both values
        return [false, 'is null or undefined'];
    }

    return [true];
}

/**
 * Returns a validator function that passes if input matches provided type
 * @param type The type to be matched against
 */
export function isType(type: string): ValidatorFunction {
    const validator: ValidatorFunction = (input: any): [valid: boolean, message?: string] => {
        if (typeof input !== type) {
            return [false, `is not of type \`${type}\``];
        }

        return [true];
    }

    return validator;
}

export const isNotEmpty: ValidatorFunction = (input: string | any[]): [valid: boolean, message?: string] => {
    if (typeof input === 'string') {
        if (input === "") {
            return [false, 'is empty'];
        }
        return [true];
    } else {
        if (input.length == 0) {
            return [false, 'is empty'];
        }
        return [true];
    }
}

export function equals(val: string): ValidatorFunction {
    const validator: ValidatorFunction = (input: string): [valid: boolean, message?: string] => {
        if (!(input === val)) {
            return [false, `does not equal \`${val}\``];
        }

        return [true];
    }

    return validator;
}

// number functions
export function isGreaterThan(val: number): ValidatorFunction {
    const validator: ValidatorFunction = (input: number): [valid: boolean, message?: string] => {
        if (!(input > val)) {
            return [false, `is not greater than ${val}`];
        }

        return [true];
    }

    return validator;
}

export function isGreaterThanOrEqualTo(val: number): ValidatorFunction {
    const validator: ValidatorFunction = (input: number): [valid: boolean, message?: string] => {
        if (!(input >= val)) {
            return [false, `is not greater than or equal to ${val}`];
        }

        return [true];
    }

    return validator;
}


export function isLessThan(val: number): ValidatorFunction {
    const validator: ValidatorFunction = (input: number): [valid: boolean, message?: string] => {
        if (!(input < val)) {
            return [false, `is not less than ${val}`];
        }

        return [true];
    }

    return validator;
}

export function isLessThanOrEqualTo(val: number): ValidatorFunction {
    const validator: ValidatorFunction = (input: number): [valid: boolean, message?: string] => {
        if (!(input <= val)) {
            return [false, `is not less than or equal to ${val}`];
        }

        return [true];
    }

    return validator;
}

/**
 * Returns a validator function that passes if all elements in the array pass all of the provided validators
 * @param validators An array of validators for all elements of the array to be checked against
 */
export function validateArray(validators: ValidatorFunction[]): ValidatorFunction {
    const arrayValidator: ValidatorFunction = (input: any[]): [valid: boolean, ValidationErrors?: ValidationErrors] => {        
        let allValid = true;
        let errors: ValidationErrors = {};

        for (const element of input) {
            let allValidForElement = true;
            errors[input.indexOf(element).toString()] = [];
            let errorsForElement: (string | ValidationErrors)[] = [];
            for (const validator of validators) {
                let [valid, error] = validator(element);
                if (!valid) {
                    allValidForElement = false;
                    errorsForElement.push(error!);
                }
            }

            if (!allValidForElement) {
                allValid = false;
                errors[input.indexOf(element).toString()].push(...errorsForElement)
            }
        }

        if (!allValid) {
            return [false, clean(errors)];
        }
        
        return [true];
    }

    return arrayValidator;
}