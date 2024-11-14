import {ReactNode, useEffect} from 'react';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {observer} from "mobx-react";
import {useStore} from "../../stores/store-provider";
import {getEventById} from "../../utils/api.utils";
import {AppEvent} from "../../models/models";

interface ProtectedRouteProps {
    child: ReactNode;
}

export const OrganizerRoute: React.FC<ProtectedRouteProps> = observer(({child}) => {
    const {userStore} = useStore();
    const {eventId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (eventId != undefined) {
            getEventById(eventId)
                .then((res: Response) => {
                    if (res.body) {
                        const event = res.body as unknown as AppEvent;
                        if (!userStore.isUserAdmin && event.organizer.id != userStore.getUser?.id) {
                            navigate("/forbidden")
                        }
                    }
                })
        }
    }, [eventId])

    if (!userStore.isUserOrganizer && !userStore.isUserAdmin) {
        return <Navigate replace to="/not-found"/>
    }

    return <>{child}</>
});
