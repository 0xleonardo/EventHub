import {observer} from "mobx-react";
import {NavBar} from "../../components/NavBar/navbar.component";
import {Footer} from "../../components/Footer/footer.component";
import {RoutesComponent} from "../routes";

export const EventhubApp = observer(() => {

    return (
        <div className="shopBody">
            <NavBar/>
            <RoutesComponent/>
            <Footer/>
        </div>
    );
});
