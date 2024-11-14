import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App";
import {StoreProvider} from "./stores/store-provider";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <StoreProvider>
        <App/>
    </StoreProvider>
);
