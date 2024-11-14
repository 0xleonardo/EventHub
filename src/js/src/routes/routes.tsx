import {Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import {UserProfileComponent} from "../components/Pages/UserProfile/user-profile.component";
import {observer} from "mobx-react";
import {PageNotFound} from "../components/NavBar/page-not-found/page-not-found";
import {HomeComponent} from "../components/Pages/Home/home.component";
import {EventPage} from "../components/Pages/EventPage/event-page.component";
import "./style.css"
import {Login} from "../components/LoginRegistration/Login/login.component";
import {ProfileRoute} from "./guards/profile.guard";
import {OrganizerProfileComponent} from "../components/Pages/OrganizerProfile/organizer-profile.component";
import {CreateEvent} from "../components/Pages/CreateEvent/create-event.component";
import {UpdateEvent} from "../components/Pages/UpdateEvent/update-event.component";
import {
    PublicOrganizerProfileComponent
} from "../components/Pages/PublicOrganizerProfile/public-organizer-profile.component";
import RegisterComponent from "../components/LoginRegistration/Register/register.component";
import {EventBrowser} from "../components/Pages/BrowseEvents/browse.component";
import {OrganizerRoute} from "./guards/organizer.guard";
import {SignedInForbidRoute} from "./guards/signed-in.forbid";
import {Forbidden} from "../components/NavBar/forbidden/forbidden";
import {AboutPage} from "../components/Pages/FooterPages/about-page";
import {TermsAndConditionsPage} from "../components/Pages/FooterPages/terms-conditions-page";
import {PrivacyPage} from "../components/Pages/FooterPages/privacy-page";
import {EventStatisticsComponent} from "../components/Pages/EventStatistics/event-statistics.component";

export const Loading = () => {
    return (
        <div className="spinner-container">
            <div className="loading-spinner">
            </div>
        </div>
    );
}

export const RoutesComponent = observer(() => {
    return (
        <Suspense fallback={<Loading/>}>
            <Routes>
                <Route path='/' element={<HomeComponent/>}/>
                <Route path='/login' element={<SignedInForbidRoute child={<Login/>}/>}/>
                <Route path='/register' element={<SignedInForbidRoute child={<RegisterComponent/>}/>}/>
                <Route path='/browse' element={<EventBrowser/>}/>
                <Route path='/event/:eventId' element={<EventPage/>}/>
                <Route path='/create' element={<OrganizerRoute child={<CreateEvent/>}/>}/>
                <Route path='/event/statistics/:eventId'
                       element={<OrganizerRoute child={<EventStatisticsComponent/>}/>}/>
                <Route path='/update/:eventId' element={<OrganizerRoute child={<UpdateEvent/>}/>}/>
                <Route path='/user/:username' element={<PublicOrganizerProfileComponent/>}/>
                <Route path='/profile'
                       element={<ProfileRoute profileOne={<UserProfileComponent/>}
                                              profileTwo={<OrganizerProfileComponent/>}/>}/>
                <Route path='/privacy' element={<PrivacyPage/>}/>
                <Route path='/terms' element={<TermsAndConditionsPage/>}/>
                <Route path='/about' element={<AboutPage/>}/>
                <Route path='/forbidden' element={<Forbidden/>}/>
                <Route path='/not-found' element={<PageNotFound/>}/>
                <Route path='/*' element={<PageNotFound/>}/>
            </Routes>
        </Suspense>
    );
})