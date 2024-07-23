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



function getStyledColor(color){
    return styled.span`
        color: ${color};
    `;
}

const StyledRed = getStyledColor("red");
const StyledGray = getStyledColor("gray");
const StyledGreen = getStyledColor("green");


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

        return styled.span`
        color: ${color};
        `;
    }

    const StyledLower = getNumberStyled(lower);
    const StyledUpper = getNumberStyled(upper);

    let gradeAchievedChance = Math.min(Math.max(upper-targetGrade, 0)/(upper-lower)*100, 100);
    let gradeMissedChance = Math.min(Math.max(targetGrade-lower, 0)/(upper-lower)*100, 100);

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
                <StyledLower>{lower.toFixed(1)}%</StyledLower> - <StyledUpper>{upper.toFixed(1)}%</StyledUpper>
                </p>

        },
        {
            "title": "Required Grade reachability",
            "content":
                <>
                    <p>
                        Success <StyledGreen>{gradeAchievedChance.toFixed(1)}%</StyledGreen> range coverage
                    </p>
                    <p>
                        Failure <StyledRed>{gradeMissedChance.toFixed(1)}%</StyledRed> range coverage
                    </p>

                </>

        },
        {
            "title": "Obtained Scores",
            "content":
                <>
                    <p>
                        Obtained: <StyledGreen>{lower.toFixed(1)}%</StyledGreen>
                    </p>
                    <p>
                        Obtainable: <StyledGray>{(upper - lower).toFixed(1)}%</StyledGray>
                    </p>
                    <p>
                        Lost: <StyledRed>{(100 - upper).toFixed(1)}%</StyledRed>
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