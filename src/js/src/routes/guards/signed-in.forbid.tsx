import {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {observer} from "mobx-react";
import {useStore} from "../../stores/store-provider";

interface ProtectedRouteProps {
    child: ReactNode;
}

export const SignedInForbidRoute: React.FC<ProtectedRouteProps> = observer(({child}) => {
    const {userStore} = useStore();

    if (userStore.isUserLoggedIn) {
        return <Navigate to="/" replace/>
    }

    return <>{child}</>;
});
