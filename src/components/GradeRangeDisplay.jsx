import {styled} from "styled-components";
import {getPercentage} from "../flume/gradeLogic.jsx";
import GradeData from "./GradeData.jsx";
import {useState} from "react";

const StyledDisplay = styled.div`
    background-color: #140932;
    width: 20vw;
    border-radius: 4vw;
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

export default function GradeRangeDisplay(props) {

    let flumeResult = props.results;

    if (Object.keys(flumeResult).length === 0 || flumeResult.finalGrade === undefined) {

        flumeResult = {finalGrade: {gradeRange: [[NaN, NaN], [NaN, NaN]]}}
    }


    const lower = (getPercentage(flumeResult.finalGrade.gradeRange[0]) * 100);
    const upper = (getPercentage(flumeResult.finalGrade.gradeRange[1]) * 100);

    const [targetGrade, setTargetGrade] = useState(70);

    function getNumberStyled(value){
        let color = "gray";

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

    let gradeAchievedChance = Math.min(Math.max(upper-targetGrade, 0)/(upper-lower)*100, 100);
    let gradeMissedChance = Math.min(Math.max(targetGrade-lower, 0)/(upper-lower)*100, 100);

    if (isNaN(gradeAchievedChance)){
        gradeAchievedChance = 0;
    }

    if (isNaN(gradeMissedChance)){
        gradeMissedChance = 0;
    }

    /*
    * List with XML that needs to be rendered, each in a new component to keep
    * the visualization organized
    * */

    const dataEntries = [
        {
            "title": "Required Grade",
            "content":
                <>
                    <input type="range" min="0" max="100" value={targetGrade} onInput={(e) => {
                        setTargetGrade(e.target.value)
                    }}/>
                    <p>{targetGrade}%</p>
                </>

        },
        {
            "title": "Grade Range",
            "content":
                <p>
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
                    <p>
                        Success <StyledColor color={"green"}>{gradeAchievedChance.toFixed(1)}%</StyledColor> range coverage
                    </p>
                    <p>
                        Failure <StyledColor color={"red"}>{gradeMissedChance.toFixed(1)}%</StyledColor > range coverage
                    </p>

                </>

        },
        {
            "title": "Obtained Scores",
            "content":
                <>
                    <p>
                        Obtained: <StyledColor color={"green"}>{lower.toFixed(1)}%</StyledColor>
                    </p>
                    <p>
                        Obtainable: <StyledColor color={"gray"}>{(upper - lower).toFixed(1)}%</StyledColor>
                    </p>
                    <p>
                        Lost: <StyledColor color={"red"}>{(100 - upper).toFixed(1)}%</StyledColor>
                    </p>
                </>

        }
    ];

    return (
        <StyledDisplay>
            {dataEntries.map((element) =>
                <GradeData title={element.title} key={element.title}>
                    {element.content}
                </GradeData>
            )}


        </StyledDisplay>

    );
}