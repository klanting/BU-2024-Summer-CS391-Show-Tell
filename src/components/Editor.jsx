
import {NodeEditor} from 'flume'
import config from '../flume/config.jsx'
import {styled} from "styled-components";

const EditorArea = styled.div`
    width: 70vw;
    height: 90vh;
    border: solid 3px white;
`;


export default function Editor(props){
    /*
    * This component makes sure the flume Editor is properly displayed
    * The NodeEditor (flume component) will take the entire parent as space, so
    * the EditorArea styled-component makes sure that this editor its style is constraint
    * within the provided size
    * */
    return (
        <>
            <EditorArea>
                {/*
                * NodeEditor visualizes the flume Editor
                * portTypes and nodeTypes are needed to make the editor aware about which types
                * of ports and nodes the program has available
                * defaultNodes is the list of default spawned nodes.
                * This Contains a 'resultNode', this node is a rootNode meaning that it cannot be
                * created by the user (and so be required to be a default node)
                */}
                <NodeEditor
                    portTypes={config.portTypes}
                    nodeTypes={config.nodeTypes}

                    defaultNodes={[
                        {
                            type: "resultNode",
                            x: 190,
                            y: -150
                        }
                    ]}
                    nodes={props.nodes}
                    onChange={props.setNodes}
                />
            </EditorArea>

        </>
    )
}