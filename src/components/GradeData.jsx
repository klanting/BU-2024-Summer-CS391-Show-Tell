import {styled} from "styled-components";

const StyledDataComponent = styled.div`
    border: solid 3px white;
    border-radius: 2vw;
    padding: 1vw;
`;


export default function GradeData(props){
    /*
    * Component to display one part of grade information
    * */
    return (
        <StyledDataComponent>
            {/*Display the entry title*/}
            <h4>{props.title}</h4>
            {/*Display the provided content*/}
            {props.children}
        </StyledDataComponent>
    );
}