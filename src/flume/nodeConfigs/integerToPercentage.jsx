/*
* This file, contains all the information needed to make the 'integerToPercentage' node component
* */

const nodeType = {
    type: "integerToPercentage",
    label: "integer to percentage",
    description: "Convert an integer to a percentage using rounding (integer 100 equals 100%)",

    inputs: ports => [
        ports.integer()
    ],
    outputs: ports => [
        ports.percentage()
    ]

}

const resolveFunction = (inputValues) => {
    return {percentage: inputValues.integer/100}
}


export default {nodeType: nodeType, resolveFunction: resolveFunction};