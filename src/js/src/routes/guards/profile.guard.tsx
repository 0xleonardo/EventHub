import {ReactNode, useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {observer} from "mobx-react";
import {useStore} from "../../stores/store-provider";
import {MessageType} from "../../components-styled/Toast/toast.model";
import ToastContext from "../../components-styled/Toast/toast.context";

interface ProtectedRouteProps {
    profileOne: ReactNode;
    profileTwo: ReactNode;
}

export const ProfileRoute: React.FC<ProtectedRouteProps> = observer(({profileOne, profileTwo}) => {
    const {userStore} = useStore();
    const showToast = useContext(ToastContext);

    if (userStore.isUserOrganizer) {
        return <>{profileTwo}</>
    }

    if (userStore.isUserLoggedIn) {
        return <>{profileOne}</>;
    }

    showToast({message: "You have to be Signed In to see this page!", type: MessageType.INFO})
    return <Navigate replace to="/login"/>
});
