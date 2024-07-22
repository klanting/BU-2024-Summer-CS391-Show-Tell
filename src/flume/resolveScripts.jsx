import gradeCreator from "./nodeConfigs/gradeCreator.jsx";
import weightedSum from "./nodeConfigs/weightedSum.jsx";
import sum from "./nodeConfigs/sum.jsx";
import totalConverter from "./nodeConfigs/totalConverter.jsx";
import constant from "./nodeConfigs/constant.jsx";
import integerOperation from "./nodeConfigs/integerOperation.jsx";
import percentageToInteger from "./nodeConfigs/percentageToInteger.jsx";
import integerToPercentage from "./nodeConfigs/integerToPercentage.jsx";
import requiredGrade from "./nodeConfigs/requiredGrade.jsx";

export function resolvePorts(portType, data){

    /*
    * This dictionary/Map is a trick I often use because I don't like switch statements
    * It just maps the key, to its corresponding value (by mapping to a lambda function)
    * This is just another way to write a switch statement, but I am personally a bigger
    * fan of this method because it allows high readability while being able to add more
    * complex logic to the methods. This can be seen as a map to function ptrs
    * */
    const entryMap = {
        "boolean": () => data.boolean,
        "integer": () => data.integer,
        "string": () => data.string,
        "grade": () => data.grade,
        "percentage": () => data.percentage/100,
        "constantType": () => data.constantType,
        "operation": () => data.operation
    }

    return entryMap[portType]();
}

export function resolveNodes(node, inputValues, nodeType){

    /*
    * This dictionary/Map is a trick I often use because I don't like switch statements
    * It just maps the key, to its corresponding value (by mapping to a lambda function)
    * This is just another way to write a switch statement, but I am personally a bigger
    * fan of this method because it allows high readability while being able to add more
    * complex logic to the methods. This can be seen as a map to function ptrs
    * */
    const entryMap = {
        "gradeCreator": gradeCreator.resolveFunction,
        "weightedSum": weightedSum.resolveFunction,
        "sum": sum.resolveFunction,
        "totalConverter": totalConverter.resolveFunction,
        "constant": constant.resolveFunction,
        "integerOperation": integerOperation.resolveFunction,
        "percentageToInteger": percentageToInteger.resolveFunction,
        "integerToPercentage": integerToPercentage.resolveFunction,
        "requiredGrade": requiredGrade.resolveFunction
    }

    return entryMap[nodeType.type](inputValues);
}