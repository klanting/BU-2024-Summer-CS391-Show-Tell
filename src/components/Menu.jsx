import {styled} from "styled-components";
import Editor from "./Editor.jsx";
import GradeRangeDisplay from "./GradeRangeDisplay.jsx";
import {useState} from "react";
import {RootEngine, useRootEngine} from "flume";
import config from "../flume/config.jsx";
import {resolveNodes, resolvePorts} from "../flume/resolveScripts.jsx";


const MenuArea = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin-top: 1vh;
`;

export default function Menu (){
    /*
    * Displays a menu for the grade Calculator
    * */

    /*
    * RootEngine computation is sued to compute the resulting value of the visual code
    * useRootEngine is the node that does the actual computations
    * */
    const [nodes, setNodes] = useState({})
    const engine = new RootEngine(config, resolvePorts, resolveNodes);
    const results = useRootEngine(nodes, engine);

    return (
        <MenuArea>
            <Editor nodes={nodes} setNodes={setNodes}/>
            <GradeRangeDisplay results={results}/>
        </MenuArea>
    );
}