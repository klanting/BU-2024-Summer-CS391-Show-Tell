import {styled} from "styled-components";
import {getPercentage} from "../flume/gradeLogic.jsx";
import GradeData from "./GradeData.jsx";
import {useState} from "react";

const StyledDisplay = styled.div`
    background-color: #140932;
    width: 20vw;
    border-radius: 2vw;
    padding: 0.5vw;

    color: white;
    font-size: calc(2px + 1.8vw);
    text-align: center;

    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: space-evenly;
    border: solid 3px white;
`;

const StyledGradeRangeSpan= styled.span`
        color: ${(prop) => prop.color};
        `;


const StyledColor = styled.span`
    color: ${(prop) => prop.color}
`;

const StyledInput = styled.input`
    width: 80%;
`;

export default function GradeRangeDisplay(props) {

    let flumeResult = props.results;

    if (Object.keys(flumeResult).length === 0 || flumeResult.finalGrade === undefined) {

        flumeResult = {finalGrade: {gradeRange: [[NaN, NaN], [NaN, NaN]]}}
    }


    /*
    * Retrieve the lower and upper grade as a percentage between 0 and 100
    * */
    const lower = (getPercentage(flumeResult.finalGrade.gradeRange[0]) * 100);
    const upper = (getPercentage(flumeResult.finalGrade.gradeRange[1]) * 100);

    const [targetGrade, setTargetGrade] = useState(70);

    function getNumberStyled(value){
        /*
        * Give the color back based on its relation to the targetValue (required value)
        * color is gray when the value matches the target value
        * color is red when the value is smaller than the target value
        * color is green when the value is larger than the target value
        * */
        let color = "gray";

        /*
        * When our value is not a number, we will make the color gray
        * */
        if (!isNaN(value)){

            if (value > targetGrade){

                color = "green";
            }
            if (value < targetGrade){
                color = "red";
            }
        }

        return color;
    }

    /*
    * Calculations for 'Required Grade reachability'
    * The gradeAchievedChance is the chance that the grade would be higher than the required grade in
    * a situation that all the unknown grades get a random score between 0-total (uniformly distributed).
    * Same is for gradeMissedChance, but the chance to be lower than the required grade
    * */
    let gradeAchievedChance = Math.min(Math.max(upper-targetGrade, 0)/(upper-lower)*100, 100);
    let gradeMissedChance = Math.min(Math.max(targetGrade-lower, 0)/(upper-lower)*100, 100);

    /*
    * When the range difference is 0%, we can get NaN in case we have 0/0,
    * those cases, we want to just give it 0%
    * */
    if (isNaN(gradeAchievedChance)){
        gradeAchievedChance = 0;
    }

    if (isNaN(gradeMissedChance)){
        gradeMissedChance = 0;
    }

    /*
    * List with XML that needs to be rendered, each in a new component to keep
    * the visualization organized
    *
    * This list has 4 components
    * - Required Grade: allowing the user to change the grade (percentage) that the user needs
    * to pass/ accomplish their own goal
    * - Grade Range: gives the range of grades (percentage) the user can still accomplish based on
    * the scores of the not yet known grades
    * - Required Grade reachability: gives the percentage of the range that is larger and lower than the required range
    * - Obtained Scores: gives info about how much of the grade is already obtained, obtainable, not obtainable anymore
    * */

    const dataEntries = [
        {
            "title": "Required Grade",
            "content":
                <>
                    {/*Render input slider so the user can change the required value*/}
                    <StyledInput type="range" min="0" max="100" value={targetGrade} onInput={(e) => {
                        setTargetGrade(e.target.value)
                    }}/>
                    <p>{targetGrade}%</p>
                </>

        },
        {
            "title": "Grade Range",
            "content":
                <p>
                    {/*
                    * Visualize the grade range (color depends on the relation of the value
                    in comparison to the target value)
                    */}
                    <StyledGradeRangeSpan color={getNumberStyled(lower)}>
                        {lower.toFixed(1)}%
                    </StyledGradeRangeSpan> - <StyledGradeRangeSpan color={getNumberStyled(upper)}>
                        {upper.toFixed(1)}%
                    </StyledGradeRangeSpan>
                </p>

        },
        {
            "title": "Required Grade reachability",
            "content":
                <>
                    {/*Display how much of the range region would cause a pass*/}
                    <p>
                        Success <StyledColor color={"green"}>{gradeAchievedChance.toFixed(1)}%</StyledColor> range coverage
                    </p>

                    {/*Display how much of the range region would cause a fail*/}
                    <p>
                        Failure <StyledColor color={"red"}>{gradeMissedChance.toFixed(1)}%</StyledColor > range coverage
                    </p>

                </>

        },
        {
            "title": "Obtained Scores",
            "content":
                <>
                    {/*Display the percentage of the final grade the user has already obtained*/}
                    <p>
                        Obtained: <StyledColor color={"green"}>{lower.toFixed(1)}%</StyledColor>
                    </p>

                    {/*Display the percentage of the final grade the user can still obtain*/}
                    <p>
                        Obtainable: <StyledColor color={"gray"}>{(upper - lower).toFixed(1)}%</StyledColor>
                    </p>

                    {/*Display the percentage of the final grade the user can not obtain anymore*/}
                    <p>
                        Lost: <StyledColor color={"red"}>{(100 - upper).toFixed(1)}%</StyledColor>
                    </p>
                </>

        }
    ];

    return (
        <StyledDisplay>
            {/*Map all the data from the dataEntries into a GradeData component*/}
            {dataEntries.map((element) =>
                <GradeData title={element.title} key={element.title}>
                    {element.content}
                </GradeData>
            )}


        </StyledDisplay>

    );
}