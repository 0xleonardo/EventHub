import {observer} from "mobx-react";
import {useStore} from "../../stores/store-provider";

import "./style.css";
import {NavBarElement} from "./navbar-element-component/navbar-element.component";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const logo = require("../../assets/logo.png");

export const NavBar = observer(() => {
    const {userStore, authStore} = useStore();
    const navigate = useNavigate();

    const {isUserAdmin, isUserOrganizer, isUserLoggedIn} = userStore;
    const [navbar, setNavbar] = useState<boolean>(false);

    const changeBackground = () => {
        if (window.scrollY >= 80) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', changeBackground);
        return () => window.removeEventListener('scroll', changeBackground);
    }, []);

    const logout = () => {
        authStore.logout();
    }

    return (
        <div className={navbar ? 'navistyle active' : 'navistyle'}>
            <nav className="wrapper">
                <div className="logo">
                    <img src={logo} alt="Logo" onClick={() => navigate("/")}/>
                </div>
                <div className="navi">
                    <Link to="/browse">
                        <button className="styledRedButton small-size-button">BROWSE EVENTS</button>
                    </Link>
                    {isUserOrganizer && <Link to="/create">
                        <button className="styledBlueButton small-size-button">CREATE EVENT</button>
                    </Link>}
                    {!isUserAdmin && <NavBarElement
                        route={isUserLoggedIn ? "/profile" : "/login"} icon="fa-regular fa-user" color="white"
                        onHoverTitle={isUserLoggedIn ? userStore.getUser!.username : "Login"}/>}
                    {isUserAdmin && <NavBarElement
                        route="/admin/dashboard" icon="fa-solid fa-database" color="white" onHoverTitle="Admin Panel"/>}
                    {isUserLoggedIn && <NavBarElement
                        route="/" icon="fa-solid fa-door-open" color="white" onHoverTitle="Logout" onClick={logout}/>}
                </div>
            </nav>
        </div>
    );
})
