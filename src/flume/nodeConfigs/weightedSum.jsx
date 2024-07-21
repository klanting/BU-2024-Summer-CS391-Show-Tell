import {Controls} from "flume";
import {getGrades, getPercentage} from "../gradeLogic.jsx";

const nodeType = {
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
            const match = connKey.match(re) !== null;
            console.log(match, connKey.match(re), connKey)
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
        for (let i = 0; i < Math.max(matchCounter+1, highest); i++){
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

}

const resolveFunction = (inputValues) => {

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
}

export default {nodeType: nodeType, resolveFunction: resolveFunction};