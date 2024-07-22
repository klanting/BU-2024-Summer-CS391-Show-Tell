import {Controls} from "flume";
import {getGrades, getMinGrade, getNanGrade, getPercentage} from "../gradeLogic.jsx";

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

        portsList.push(ports.boolean({
            label: "Minimum Required",
            hidePort: true
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
            console.log(inputData)
            if (inputData.boolean.boolean){
                portsList.push(ports.percentage({
                    name: `minimum${i+1}`,
                    label: `Minimum ${i+1}`
                }));
            }

        }

        if (inputData.boolean.boolean){
            portsList.push(ports.grade({
                name: "elseMaxGrade",
                label: `Else Max Grade`,

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

    let aboveMinimumLower = true;
    let aboveMinimumUpper = true;

    const gradeList = getGrades(inputValues);
    console.log("v", inputValues)
    if (inputValues.elseMaxGrade === undefined){inputValues.elseMaxGrade = getNanGrade()}
    console.log("v", inputValues)
    for (let i=0; i<gradeList.length; i++){
        const grade = gradeList[i];

        const lowerPCT = getPercentage(inputValues[`grade${grade[0]}`].gradeRange[0]);
        const upperPCT = getPercentage(inputValues[`grade${grade[0]}`].gradeRange[1]);

        lowerBound += weightedSum(lowerPCT, inputValues[`weight${grade[0]}`]);

        upperBound += weightedSum(upperPCT, inputValues[`weight${grade[0]}`]);

        if (inputValues.boolean){

            aboveMinimumLower = aboveMinimumLower && (lowerPCT >= inputValues[`minimum${grade[0]}`]);
            aboveMinimumUpper = aboveMinimumUpper && (upperPCT >= inputValues[`minimum${grade[0]}`]);
        }
    }

    const total = inputValues.total;

    let lowerGrade = [lowerBound*total, total];
    let upperGrade = [upperBound*total, total];

    if (!aboveMinimumLower){
        lowerGrade = getMinGrade(lowerGrade, inputValues.elseMaxGrade.gradeRange[0])
        console.log("lower", lowerGrade)
    }

    if (!aboveMinimumUpper){
        upperGrade = getMinGrade(upperGrade, inputValues.elseMaxGrade.gradeRange[1])
    }

    console.log("v3", [lowerGrade, upperGrade])

    return {grade:
            {
                gradeRange: [lowerGrade, upperGrade]
            }
    }
}

export default {nodeType: nodeType, resolveFunction: resolveFunction};