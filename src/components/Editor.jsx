
import {NodeEditor, RootEngine, useRootEngine} from 'flume'
import config from './config'
import {useState} from "react";

export default function Editor(){


    function resolvePorts(portType, data){
        console.log("portType", portType, data)

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

    function resolveNodes(node, inputValues, nodeType, context){
        console.log("nodeType", nodeType, inputValues)

        /*
        * This dictionary/Map is a trick I often use because I don't like switch statements
        * It just maps the key, to its corresponding value (by mapping to a lambda function)
        * This is just another way to write a switch statement, but I am personally a bigger
        * fan of this method because it allows high readability while being able to add more
        * complex logic to the methods. This can be seen as a map to function ptrs
        * */
        const entryMap = {
            "gradeCreator": () => {

                let gradeRange = [0, 1];

                if (inputValues.isGradeKnown){

                    const pct = (inputValues.score/inputValues.total);
                    gradeRange = [pct, pct]
                }

                return {grade:
                        {
                            gradeRange: gradeRange
                        }
                }
            },
            "weightedSum": () => {

                function weigthedSum(a1, w1, a2, w2){
                    return a1*w1+a2*w2;
                }
                console.log("weightedSum", inputValues)
                return {grade:
                        {
                            gradeRange: [
                                weigthedSum(
                                    inputValues.grade1.gradeRange[0],
                                    inputValues.weight1,
                                    inputValues.grade2.gradeRange[0],
                                    inputValues.weight2),
                                weigthedSum(
                                    inputValues.grade1.gradeRange[1],
                                    inputValues.weight1,
                                    inputValues.grade2.gradeRange[1],
                                    inputValues.weight2)
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

    console.log( results,  results.finalGrade)

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

            {results.finalGrade?.percentage && <p>{results.finalGrade.percentage*100}</p>}
            {results.finalGrade?.gradeRange && <p>{`${results.finalGrade.gradeRange[0]*100}-${results.finalGrade.gradeRange[1]*100}`}</p>}


        </>
    )
}