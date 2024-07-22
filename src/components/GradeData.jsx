import {styled} from "styled-components";

const StyledDataComponent = styled.div`
    border: solid 3px white;
    border-radius: 2vw;
    padding: 1vw;
`;


export default function GradeData(props){
    return (
        <StyledDataComponent>
            <h4>{props.title}</h4>
            {props.children}
        </StyledDataComponent>
    );
}