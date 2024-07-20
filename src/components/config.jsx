import { FlumeConfig, Colors, Controls } from 'flume'

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
            defaultValue: 0
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
            defaultValue: 0
        })
    ]
})

config.addPortType({
    type: "string",
    name: "string",
    label: "string",
    color: Colors.green,
    controls: [
        Controls.text({
            name: "string",
            label: "string",
            defaultValue: "Unnamed text"
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



config.addNodeType({
    type: "gradeCreator",
    label: "Grade Creator",
    description: "Create a grade object using grade information",

    inputs: ports => (inputData, connections, context) => {

        let portsList = [];

        portsList.push(ports.boolean({
            name: "isGradeKnown",
            label: "grade is known",
            hidePort: true
        }));

        portsList.push(ports.string({
            name: "evaluationName",
            label: "evaluation name",
            hidePort: true
        }));

        console.log("pdwdwd", inputData, connections, context)

        if (inputData.isGradeKnown && inputData.isGradeKnown["boolean"]){

            portsList.push(ports.integer({
                name: "score",
                label: "score",
                hidePort: true
            }));


        }


        portsList.push(ports.integer({
            name: "total",
            label: "total",
            hidePort: true
        }));


        return portsList;
    }
    ,

    outputs: ports => [
        ports.grade({
            name: "grade",
            label: "grade"
        }),
    ]

})

config.addNodeType({
    type: "weightedSum",
    label: "Weighted Sum",
    description: "Takes a Weighted sum between grades",

    inputs: ports => (inputData, connections, context) =>
        {
            console.log("cond ports", inputData, connections, context)

            const connKeys = Object.keys(connections.inputs);

            const re = /grade*/g;

            let matchCounter = 0;
            let highest = 0;
            for (let i=0; i<connKeys.length; i++){

                const connKey = connKeys[i];
                const match = connKey.match(re).length > 0;
                console.log("kwak", match);
                matchCounter++;
                highest = Math.max(Number(connKey.slice(5)), highest);
            }
            console.log("hhh", highest)
            let portsList = []
            /*
            * Dynamically determine the amount of grades
            * */
            for (let i =0; i < Math.max(matchCounter+1, highest); i++){
                portsList.push(ports.grade({
                    name: `grade${i+1}`,
                    label: `grade ${i+1}`
                }));
                portsList.push(ports.percentage({
                    name: `weight${i+1}`,
                    label: `weight ${i+1}`
                }));

            }



            return portsList
        }
        ,

    outputs: ports => [
        ports.grade({
            name: "grade",
            label: "grade"
        }),
    ]

})

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