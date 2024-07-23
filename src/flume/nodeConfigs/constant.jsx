/*
* This file, contains all the information needed to make the 'constant' node component
* */

const nodeType = {
    type: "constant",
    label: "Constant",
    description: "Get a constant value",

    inputs: ports => (inputData) => {

        if (inputData.constantType === undefined){
            return [ports.constantType()];
        }

        if (inputData.constantType.constantType === "integer"){
            return [ports.constantType(), ports.integer({hidePort: true, name: "input"})];
        }else if (inputData.constantType.constantType === "percentage"){
            return [ports.constantType(), ports.percentage({hidePort: true, name: "input"})];
        }

        return [ports.constantType()];


    },
    outputs: ports => (inputData) => {
        if (inputData.constantType.constantType === "integer"){
            return [ports.integer({name: "output"})];
        }else if (inputData.constantType.constantType === "percentage"){
            return [ports.percentage({name: "output"})];
        }

        return [];


    }

}

const resolveFunction = (inputValues)=> {

    return {output: inputValues.input}

}

export default {nodeType: nodeType, resolveFunction: resolveFunction};