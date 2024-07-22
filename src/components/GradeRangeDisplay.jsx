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
        console.log("wd")
        flumeResult = {finalGrade: {gradeRange: [[NaN, NaN], [NaN, NaN]]}}
    }
    console.log("v", flumeResult)

    const lower = (getPercentage(flumeResult.finalGrade.gradeRange[0]) * 100).toFixed(1);
    const upper = (getPercentage(flumeResult.finalGrade.gradeRange[1]) * 100).toFixed(1);

    const [targetGrade, setTargetGrade] = useState(70);

    function getNumberStyled(value){
        console.log("tv", targetGrade, value)
        let color = "gray";

        if (!isNaN(value)){
            if (value > targetGrade){
                color = "green";
            }
            if (value < targetGrade){
                color = "red";
            }
        }

        console.log("tv", color)
        return styled.span`
        color: ${color};
        `;
    }

    const StyledLower = getNumberStyled(lower);
    const StyledUpper = getNumberStyled(upper);




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
                <StyledLower>{lower}%</StyledLower> - <StyledUpper>{upper}%</StyledUpper>
                </p>

        },
        {
            "title": "Obtained Scores",
            "content":
                <>
                    <p>
                        Obtained: <StyledGreen>{lower}%</StyledGreen>
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