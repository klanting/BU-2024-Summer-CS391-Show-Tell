import {getGrades} from "../gradeLogic.jsx";

/*
* This file, contains all the information needed to make the 'sum' node component
* */

const nodeType = {
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
            const match = connKey.match(re) !== null;

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

}

const resolveFunction = (inputValues) => {

    let lowerBound = 0;
    let upperBound = 0;

    let total = 0;

    const gradeList = getGrades(inputValues);

    for (let i=0; i<gradeList.length; i++){
        const grade = gradeList[i];
        lowerBound += inputValues[`grade${grade[0]}`].gradeRange[0][0];
        upperBound += inputValues[`grade${grade[0]}`].gradeRange[1][0];

        total += inputValues[`grade${grade[0]}`].gradeRange[0][1];
    }



    return {grade:
            {
                gradeRange: [
                    [lowerBound, total],
                    [upperBound, total]

                ]
            }
    }
}

export default {nodeType: nodeType, resolveFunction: resolveFunction};