import { FlumeConfig, Colors, Controls } from 'flume'

import gradeCreator from "./nodeConfigs/gradeCreator.jsx";
import weightedSum from "./nodeConfigs/weightedSum.jsx";
import sum from "./nodeConfigs/sum.jsx";
import totalConverter from "./nodeConfigs/totalConverter.jsx";
import integerOperation from "./nodeConfigs/integerOperation.jsx";
import constant  from "./nodeConfigs/constant.jsx"
import percentageToInteger from "./nodeConfigs/percentageToInteger.jsx";
import integerToPercentage from "./nodeConfigs/integerToPercentage.jsx"
import requiredGrade from "./nodeConfigs/requiredGrade.jsx";

const config = new FlumeConfig()

config.addPortType({
    type: "grade",
    name: "grade",
    label: "grade",
    color: Colors.orange
})

config.addPortType({
    type: "percentage",
    name: "percentage",
    label: "percentage",
    color: Colors.blue,
    controls: [
        Controls.number({
            name: "percentage",
            label: "percentage",
            defaultValue: 0,

        })
    ]
})

config.addPortType({
    type: "integer",
    name: "integer",
    label: "integer",
    color: Colors.yellow,
    controls: [
        Controls.number({
            name: "integer",
            label: "integer",
            defaultValue: 10,
        })
    ]
})

config.addPortType({
    type: "operation",
    name: "operation",
    label: "operation",
    color: Colors.green,
    hidePort: true,
    controls: [
        Controls.select({
            name: "operation",
            label: "operation",
            options: [
                {value: "+", label: "+ (Add)"},
                {value: "-", label: "- (Subtract)"},
                {value: "*", label: "* (Multiply)"},
                {value: "/", label: "/ (Divide)"},
                {value: "**", label: "** (Power)"},
                {value: "%", label: "% (Modulo)"},
                {value: "<<", label: "<< (Shift Left)"},
                {value: ">>", label: ">> (Shift Right)"},
                {value: "!", label: "! (Logical Not)"},
                {value: "&&", label: "&& (Logical And)"},
                {value: "||", label: "|| (Logical Or)"},
                {value: "&", label: "& (Bitwise And)"},
                {value: "|", label: "| (Bitwise Or)"},
                {value: "~", label: "~ (Bitwise Not)"},
                {value: "^", label: "^ (Bitwise Xor)"}


            ],
            defaultValue: "+"
        })
    ]
})

config.addPortType({
    type: "constantType",
    name: "constantType",
    label: "Constant Type",
    color: Colors.green,
    hidePort: true,
    controls: [
        Controls.select({
            name: "constantType",
            label: "Constant Type",
            options: [
                {value: "integer", label: "Integer"},
                {value: "percentage", label: "Percentage"},
            ]
        })
    ]
})


config.addPortType({
    type: "boolean",
    name: "boolean",
    label: "boolean",
    color: Colors.red,
    controls: [
        Controls.checkbox({
            name: "boolean",
            label: "boolean"
        })
    ]
})

config.addNodeType(gradeCreator.nodeType);
config.addNodeType(weightedSum.nodeType);
config.addNodeType(sum.nodeType);
config.addNodeType(totalConverter.nodeType);
config.addNodeType(integerOperation.nodeType);
config.addNodeType(constant.nodeType);
config.addNodeType(percentageToInteger.nodeType);
config.addNodeType(integerToPercentage.nodeType);
config.addNodeType(requiredGrade.nodeType)


config.addRootNodeType({
    type: "resultNode",
    label: "Results",
    initialWidth: 170,
    inputs: ports => [
        ports.grade({
            name: "finalGrade",
            label: "Final Grade"
        })
    ]
})

export default config;