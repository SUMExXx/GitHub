import React, { useEffect } from "react";
import { FluentProvider, webLightTheme} from "@fluentui/react-components";
import TitleBar from "./components/TitleBar";
import { github } from "./utils/github";
import MyWebView from "./components/MyWebView";

const App: React.FC = () => {

    return (
        <div className="flex w-full max-h-screen overflow-hidden">
            <FluentProvider theme={webLightTheme} className="w-full min-h-screen">
                <div className="flex flex-col w-full h-full">
                    <TitleBar/>
                    <div className="flex h-full w-full justify-center items-center">
                        
                        <MyWebView url={github.url}/>
                        
                    </div>
                </div>
            </FluentProvider>
        </div>
    );
};

export default App;