
import {NodeEditor} from 'flume'
import config from '../flume/config.jsx'
import {styled} from "styled-components";

const EditorArea = styled.div`
    width: 70vw;
    height: 90vh;
    border: solid 3px white;
`;


export default function Editor(props){

    return (
        <>
            <EditorArea>
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