
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
            "percentage": () => data.percentage/100
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


                return {grade:
                        {
                            gradeRange: [
                                [lowerBound*100, 100],
                                [upperBound*100, 100]

                            ]
                        }
                }
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