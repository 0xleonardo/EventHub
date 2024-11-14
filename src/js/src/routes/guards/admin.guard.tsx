import {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {observer} from "mobx-react";
import {useStore} from "../../stores/store-provider";

interface ProtectedRouteProps {
    child: ReactNode;
}

export const AdminGuard: React.FC<ProtectedRouteProps> = observer(({child}) => {
    const {userStore} = useStore();

    if (!userStore.isUserAdmin) {
        return <Navigate to="/not-found" replace/>
    }

    return <>{child}</>;
});
