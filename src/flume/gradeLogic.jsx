export function getPercentage(gradeValue){
    return gradeValue[0]/gradeValue[1];
}

export function getGrades(inputObject){

    const connKeys = Object.keys(inputObject);

    let gradeList = [];

    for (let i=0; i<connKeys.length; i++){

        const connKey = connKeys[i];

        const re = /grade*/g;

        if (connKey.match(re) === null){
            continue;
        }

        const match = connKey.match(re).length > 0;
        if (!match || inputObject[connKey] === undefined){
            continue;
        }

        const index = Number(connKey.slice(5));

        gradeList.push([index, inputObject[connKey]]);
    }

    return gradeList;
}

export function getNanGrade(){
    return {gradeRange: [[NaN, NaN], [NaN, NaN]]}
}