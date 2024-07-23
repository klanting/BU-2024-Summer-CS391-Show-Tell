export function getPercentage(gradeValue){
    /*
    * Calculate the grade as a percentage between 0-1 ex. 6/10 => 0.6
    * */
    return gradeValue[0]/gradeValue[1];
}

export function getGrades(inputObject){
    /*
    * Some nodes have a dynamic amount of components (weighted sum accepts infinite amount of
    * grades to be added). So it is important to discover which input ports actually contain a grade, because
    * to support this dynamic behaviour, it is needed to always provide at least 1 empty port to the user, so he/she can
    * connect the next grade to the node.
    * */

    /*
    * Get all the input keys
    * */
    const connKeys = Object.keys(inputObject);

    let gradeList = [];

    /*
    * For each key it checks whether it matches the regex.
    * The regex just requires a port to have the prefix 'grade'
    * */

    const re = /grade*/g;

    for (let i=0; i<connKeys.length; i++){

        const connKey = connKeys[i];

        /*
        * If no regex match -> go to the next one
        * */
        if (connKey.match(re) === null){
            continue;
        }

        /*
        * If the value is undefined (meaning no grade is connected), we skip it
        * */
        if (inputObject[connKey] === undefined){
            continue;
        }

        /*Get the corresponding index to the grade*/
        const index = Number(connKey.slice(5));

        gradeList.push([index, inputObject[connKey]]);
    }

    return gradeList;
}

export function getNanGrade(){
    /*
    * Get a default NaN grade
    * */
    return {gradeRange: [[NaN, NaN], [NaN, NaN]]}
}

export function getMinGrade(gradeTup1, gradeTup2){
    /*
    * Having 2 grades, retrieve the minimum grade (scaled to the total of the first grade (gradeTup1))
    * */
    const pct1 = getPercentage(gradeTup1);
    const pct2 = getPercentage(gradeTup2);

    const minPct = Math.min(pct1, pct2);

    return [minPct*gradeTup1[1], gradeTup1[1]]
}