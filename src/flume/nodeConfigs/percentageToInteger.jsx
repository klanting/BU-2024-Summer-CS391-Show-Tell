/*
* This file, contains all the information needed to make the 'percentageToInteger' node component
* */

const nodeType = {
    type: "percentageToInteger",
    label: "percentage to integer",
    description: "Convert a percentage to an integer using rounding (integer 100 equals 100%)",

    inputs: ports => [
        ports.percentage()
    ],
    outputs: ports => [
        ports.integer()
    ]

}

const resolveFunction = (inputValues) => {
    return {integer: Math.round(inputValues.percentage*100)}
}

export default {nodeType: nodeType, resolveFunction: resolveFunction};