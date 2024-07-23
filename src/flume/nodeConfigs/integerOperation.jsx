/*
* This file, contains all the information needed to make the 'integerOperation' node component
* */

const nodeType = {
    type: "integerOperation",
    label: "Integer Operation",
    description: "Do operations with integers",

    inputs: ports => (inputData) => {

        let portsList = [ports.operation(),
            ports.integer({name: "integer1"})

        ];

        if (inputData.operation !== undefined && !["!", "~"].includes(inputData.operation.operation)){
            portsList.push(ports.integer({name: "integer2"}))
        }

        return portsList;
    }
    ,
    outputs: ports => [
        ports.integer()
    ]

}

const resolveFunction = (inputValues) => {

    const operationMap = {
        "+": (a, b) => a+b,
        "-": (a, b) => a-b,
        "*": (a, b) => a*b,
        "/": (a, b) => Math.floor(a/b),
        "**": (a, b) => a**b,
        "%": (a, b) => a%b,
        "<<": (a, b) => a<<b,
        ">>": (a, b) => a>>b,
        "&&": (a, b) => a&&b,
        "||": (a, b) => a||b,
        "&": (a, b) => a&b,
        "|": (a, b) => a|b,
        "^": (a, b) => a^b
    }

    const unaryOperationMap = {
        "!": (a) => !a,
        "~": (a) => ~a
    }

    if (Object.keys(operationMap).includes(inputValues.operation)){
        return {integer: operationMap[inputValues.operation](inputValues.integer1, inputValues.integer2)}
    }else{
        return {integer: unaryOperationMap[inputValues.operation](inputValues.integer1)}
    }


}

export default {nodeType: nodeType, resolveFunction: resolveFunction};