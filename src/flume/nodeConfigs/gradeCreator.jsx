
const nodeType = {
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

            }));


        }

        portsList.push(ports.integer({
            name: "total",
            label: "total",

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

}

const resolveFunction = (inputValues) => {

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
}

export default {nodeType: nodeType, resolveFunction: resolveFunction};