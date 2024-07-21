import {Controls} from "flume";


const nodeType = {
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

}

const resolveFunction = (inputValues)  => {
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
}

export default {nodeType: nodeType, resolveFunction: resolveFunction};