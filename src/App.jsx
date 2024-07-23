import Menu from "./components/Menu.jsx";
import {createGlobalStyle} from "styled-components";

/*
* Use of global styling
* */
const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        box-sizing: border-box;
    }

    body {
        background-color: #272f35;
    }

`;

function App() {
    /*
    * Create the menu
    * */
    return (
        <>
            <Menu/>
            <GlobalStyle/>
        </>
    );
}

export default App
