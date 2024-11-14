import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";
import {useStore} from "./stores/store-provider";

import "./appstyle.css";
import {observer} from "mobx-react";
import {ScrollToTop} from "./utils/simple.utils";
import ToastContext from "./components-styled/Toast/toast.context";
import Toast from "./components-styled/Toast/toast.component";
import {MessageType} from "./components-styled/Toast/toast.model";
import {EventhubApp} from "./routes/Layouts/eventhub-app";
import {AdminApp} from "./routes/Layouts/admin-app";
import {AdminGuard} from "./routes/guards/admin.guard";
import {Loading} from "./routes/routes";

export const App = observer(() => {
    const {commonStore, userStore} = useStore();

    useEffect(() => {
        if (commonStore.token) {
            userStore.pullUser()
                .finally(() => commonStore.setAppLoaded());
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore, userStore]);

    const [toast, setToast] = useState<{ message: string, type: MessageType } | null>(null);

    const showToast = (toast: { message: string, type: MessageType }) => {
        setToast(toast);
    };

    const hideToast = () => {
        setToast(null);
    };

    return (
        <BrowserRouter>
            <ToastContext.Provider value={showToast}>
                {toast && <Toast toast={toast} hideToast={hideToast}/>}
                <ScrollToTop/>
                {commonStore.appLoaded ? <Routes>
                    <Route path="/admin/*" element={<AdminGuard child={<AdminApp/>}/>}/>
                    <Route path="/*" element={<EventhubApp/>}/>
                </Routes> : <Loading/>}
            </ToastContext.Provider>
        </BrowserRouter>
    );
})
