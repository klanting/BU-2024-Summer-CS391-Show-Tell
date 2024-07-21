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
                {value: "+", label: "+"},
                {value: "-", label: "-"},
                {value: "*", label: "*"},
                {value: "/", label: "/"},
                {value: "^", label: "^"},
            ]
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



config.addNodeType({
    type: "gradeCreator",
    label: "Grade Creator",
    description: "Create a grade object using grade information",

    inputs: ports => (inputData) => {

        let portsList = [];

        portsList.push(ports.boolean({
            name: "isGradeKnown",
            label: "grade is known",
            hidePort: true
        }));

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

    inputs: ports => (inputData, connections) =>
        {

            const connKeys = Object.keys(connections.inputs);

            const re = /grade*/g;

            let matchCounter = 0;
            let highest = 0;
            for (let i=0; i<connKeys.length; i++){

                const connKey = connKeys[i];
                const match = connKey.match(re) !== undefined;

                if (!match){
                    continue;
                }

                matchCounter++;
                highest = Math.max(Number(connKey.slice(5)), highest);
            }

            let portsList = []

            portsList.push(ports.integer({
                name: "total",
                label: "total",
                controls: [
                    Controls.number({
                        name: "integer",
                        label: "integer",
                        defaultValue: 100
                    })
                ]
            }))

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

config.addNodeType({
    type: "sum",
    label: "Sum",
    description: "Takes a normal sum of the grades",

    inputs: ports => (inputData, connections) =>
    {

        const connKeys = Object.keys(connections.inputs);

        const re = /grade*/g;

        let matchCounter = 0;
        let highest = 0;
        for (let i=0; i<connKeys.length; i++){

            const connKey = connKeys[i];
            const match = connKey.match(re).length > 0;

            if (!match){
                continue;
            }

            matchCounter++;
            highest = Math.max(Number(connKey.slice(5)), highest);
        }

        let portsList = []

        /*
        * Dynamically determine the amount of grades
        * */
        for (let i =0; i < Math.max(matchCounter+1, highest); i++){
            portsList.push(ports.grade({
                name: `grade${i+1}`,
                label: `grade ${i+1}`
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

config.addNodeType({
    type: "totalConverter",
    label: "Total Converter",
    description: "Convert the total of a grade (keeping the percentage)",

    inputs: ports => [
        ports.grade({
            name: "grade",
            label: "grade"
        }),
        ports.integer({
            name: "total",
            label: "new total",
            controls: [
                Controls.number({
                    name: "integer",
                    label: "integer",
                    defaultValue: 100
                })
            ]
        })
    ],
    outputs: ports => [
        ports.grade({
            name: "grade",
            label: "grade"
        }),
    ]

})

config.addNodeType({
    type: "integerOperation",
    label: "Integer Operation",
    description: "Do operations with integers",

    inputs: ports => [
        ports.integer(),
        ports.integer(),
        ports.operation()
    ],
    outputs: ports => [
        ports.integer()
    ]

})

config.addNodeType({
    type: "constant",
    label: "Constant",
    description: "Get a constant value",

    inputs: ports => (inputData) => {
        console.log(inputData, "w", inputData.constantType)

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
        console.log(inputData.constantType.constantType)
        if (inputData.constantType.constantType === "integer"){
            return [ports.integer({name: "output"})];
        }else if (inputData.constantType.constantType === "percentage"){
            return [ports.percentage({name: "output"})];
        }

        return [];


    }

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