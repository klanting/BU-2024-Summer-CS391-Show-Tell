
import {NodeEditor, RootEngine, useRootEngine} from 'flume'
import config from './config'
import {useState} from "react";

function getPercentage(gradeValue){
    return gradeValue[0]/gradeValue[1];
}

function getGrades(inputObject){

    const connKeys = Object.keys(inputObject);

    let gradeList = [];

    for (let i=0; i<connKeys.length; i++){

        const connKey = connKeys[i];

        const re = /grade*/g;

        if (connKey.match(re) === null){
            continue;
        }

        const match = connKey.match(re).length > 0;
        if (!match || inputObject[connKey] === undefined){
            continue;
        }

        const index = Number(connKey.slice(5));

        gradeList.push([index, inputObject[connKey]]);
    }

    return gradeList;
}

function getNanGrade(){
    return {gradeRange: [[NaN, NaN], [NaN, NaN]]}
}

export default function Editor(){


    function resolvePorts(portType, data){

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

    function resolveNodes(node, inputValues, nodeType){

        /*
        * This dictionary/Map is a trick I often use because I don't like switch statements
        * It just maps the key, to its corresponding value (by mapping to a lambda function)
        * This is just another way to write a switch statement, but I am personally a bigger
        * fan of this method because it allows high readability while being able to add more
        * complex logic to the methods. This can be seen as a map to function ptrs
        * */
        const entryMap = {
            "gradeCreator": () => {

                let gradeRange = [[0, inputValues.total], [inputValues.total, inputValues.total]];

                if (inputValues.isGradeKnown){

                    const gradeTuple = [inputValues.score, inputValues.total];
                    gradeRange = [gradeTuple, gradeTuple]
                }

                return {grade:
                        {
                            gradeRange: gradeRange
                        }
                }
            },
            "weightedSum": () => {

                function weightedSum(a1, w1){
                    return a1*w1;
                }

                let lowerBound = 0;
                let upperBound = 0;

                const gradeList = getGrades(inputValues);

                for (let i=0; i<gradeList.length; i++){
                    const grade = gradeList[i];

                    lowerBound += weightedSum(
                        getPercentage(inputValues[`grade${grade[0]}`].gradeRange[0]),
                        inputValues[`weight${grade[0]}`]);

                    upperBound += weightedSum(

                        getPercentage(inputValues[`grade${grade[0]}`].gradeRange[1]),
                        inputValues[`weight${grade[0]}`]);
                }

                const total = inputValues.total;

                return {grade:
                        {
                            gradeRange: [
                                [lowerBound*total, total],
                                [upperBound*total, total]

                            ]
                        }
                }
            },
            "sum": () => {

                let lowerBound = 0;
                let upperBound = 0;

                let total = 0;

                const gradeList = getGrades(inputValues);

                for (let i=0; i<gradeList.length; i++){
                    const grade = gradeList[i];
                    lowerBound += inputValues[`grade${grade[0]}`].gradeRange[0][0];
                    upperBound += inputValues[`grade${grade[0]}`].gradeRange[1][0];

                    total += inputValues[`grade${grade[0]}`].gradeRange[0][1];
                }



                return {grade:
                        {
                            gradeRange: [
                                [lowerBound, total],
                                [upperBound, total]

                            ]
                        }
                }
            },
            "totalConverter": () => {
                const grade = inputValues.grade;

                const pctLower = grade.gradeRange[0][0]/grade.gradeRange[0][1];
                const pctUpper = grade.gradeRange[1][0]/grade.gradeRange[1][1];

                const newTotal = inputValues.total;

                return {grade: {
                        gradeRange: [
                            [pctLower*newTotal, newTotal],
                            [pctUpper*newTotal, newTotal]

                        ]
                    }
                }
            },
            "constant": () => {

                return {output: inputValues.input}

            },
            "integerOperation": () => {

                console.log("integerOperation", inputValues)

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


            },
            "percentageToInteger": () => {
                return {integer: Math.round(inputValues.percentage*100)}
            },
            "integerToPercentage": () => {
                return {percentage: inputValues.integer/100}
            },
            "requiredGrade": () => {
                console.log("jiwpdw", inputValues)
                if (inputValues.grade === undefined){inputValues.grade = getNanGrade()}
                if (inputValues.elseMaxGrade === undefined){inputValues.elseMaxGrade = getNanGrade()}

                const lowerPCT = getPercentage(inputValues.grade.gradeRange[0]);
                const upperPCT = getPercentage(inputValues.grade.gradeRange[1]);

                let lowerBound = inputValues.grade.gradeRange[0];
                let upperBound = inputValues.grade.gradeRange[1];

                if (lowerPCT < inputValues.minimum){
                    lowerBound = inputValues.elseMaxGrade.gradeRange[0];
                }

                if (upperPCT < inputValues.minimum){
                    upperBound = inputValues.elseMaxGrade.gradeRange[1];
                }

                return {grade: {gradeRange: [lowerBound, upperBound]}}
            }
        }

        return entryMap[nodeType.type]();
    }

    const [nodes, setNodes] = useState({})

    const engine = new RootEngine(config, resolvePorts, resolveNodes);
    const results = useRootEngine(nodes, engine);

    return (
        <>
            <div style={{width: "90vw", height: "90vh"}}>
                <NodeEditor
                    portTypes={config.portTypes}
                    nodeTypes={config.nodeTypes}

                    defaultNodes={[
                        {
                            type: "resultNode",
                            x: 190,
                            y: -150
                        }
                    ]}

                    nodes={nodes}
                    onChange={setNodes}
                />
            </div>



            {results.finalGrade?.gradeRange && <p>{`${getPercentage(results.finalGrade.gradeRange[0])*100}-${getPercentage(results.finalGrade.gradeRange[1])*100}`}</p>}


        </>
    )
}