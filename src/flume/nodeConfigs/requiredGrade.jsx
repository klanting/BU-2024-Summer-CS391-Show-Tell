import {getMinGrade, getNanGrade, getPercentage} from "../gradeLogic.jsx";


const nodeType = {
    type: "requiredGrade",
    label: "Required Grade",
    description: "Require that the grade is higher than the minimum else give it an else grade",

    inputs: ports => [
        ports.grade({
            name: `grade`,
            label: `grade`
        }),
        ports.percentage({
            name: `minimum`,
            label: `minimum`
        }),
        ports.grade({
            name: `elseMaxGrade`,
            label: `Else Max Grade`
        })
    ],
    outputs: ports => [
        ports.grade(),
    ]

}

const resolveFunction = (inputValues)=> {

    if (inputValues.grade === undefined){inputValues.grade = getNanGrade()}
    console.log("v", inputValues)
    if (inputValues.elseMaxGrade === undefined){inputValues.elseMaxGrade = getNanGrade()}

    const lowerPCT = getPercentage(inputValues.grade.gradeRange[0]);
    const upperPCT = getPercentage(inputValues.grade.gradeRange[1]);

    let lowerBound = inputValues.grade.gradeRange[0];
    let upperBound = inputValues.grade.gradeRange[1];

    if (lowerPCT < inputValues.minimum){
        lowerBound = getMinGrade(inputValues.elseMaxGrade.gradeRange[0], inputValues.grade.gradeRange[0]);
    }

    if (upperPCT < inputValues.minimum){
        upperBound =  getMinGrade(inputValues.elseMaxGrade.gradeRange[1], inputValues.grade.gradeRange[1]);
    }

    return {grade: {gradeRange: [lowerBound, upperBound]}}
}

export default {nodeType: nodeType, resolveFunction: resolveFunction};