import {observer} from "mobx-react";
import {Link} from "react-router-dom";
import {IconButton, Tooltip} from "@mui/material";
import 'primeicons/primeicons.css';

import ".././style.css";

interface NavBarElementProps {
    route: string,
    icon: string,
    onHoverTitle: string;
    color: string;
    onClick?: () => void;
}

export const NavBarElement = observer((props: NavBarElementProps) => {

    return (
        <Link to={props.route}>
            <Tooltip title={props.onHoverTitle} onClick={props.onClick}>
                <IconButton>
                    <i className={props.icon}
                       style={{fontSize: '1.5rem', color: props.color, textShadow: "0px 1px 3px rgba(0, 0, 0, 0.5)"}}/>
                </IconButton>
            </Tooltip>
        </Link>
    )

})