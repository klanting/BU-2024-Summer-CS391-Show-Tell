import {styled} from "styled-components";
import Editor from "./Editor.jsx";
import GradeRangeDisplay from "./GradeRangeDisplay.jsx";


const MenuArea = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
`;

export default function Menu (){
    return (
        <MenuArea>
            <Editor/>
            <GradeRangeDisplay/>
        </MenuArea>
    );
}