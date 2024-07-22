
import {NodeEditor, RootEngine, useRootEngine} from 'flume'
import config from '../flume/config.jsx'

import gradeCreator from "../flume/nodeConfigs/gradeCreator.jsx";
import weightedSum from "../flume/nodeConfigs/weightedSum.jsx";
import sum from "../flume/nodeConfigs/sum.jsx";
import totalConverter from "../flume/nodeConfigs/totalConverter.jsx";
import integerOperation from "../flume/nodeConfigs/integerOperation.jsx";
import constant  from "../flume/nodeConfigs/constant.jsx"
import percentageToInteger from "../flume/nodeConfigs/percentageToInteger.jsx";
import integerToPercentage from "../flume/nodeConfigs/integerToPercentage.jsx"
import requiredGrade from "../flume/nodeConfigs/requiredGrade.jsx";

import {useState} from "react";
import {getPercentage} from "../flume/gradeLogic.jsx";



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

    const [nodes, setNodes] = useState({})

    const engine = new RootEngine(config, resolvePorts, resolveNodes);
    const results = useRootEngine(nodes, engine);
    console.log("resukt", results.finalGrade.gradeRange[0])
    return (
        <>
            <div style={{width: "70vw", height: "90vh"}}>
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