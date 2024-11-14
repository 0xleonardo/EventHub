import {Link} from "react-router-dom";
import "./style.css"
import {useState} from "react";

const logo = require("../../assets/logo.png");

export const AdminSidebar = () => {
    const [expandedSection, setExpandedSection] = useState<string | undefined>();

    const handleExpand = (section: string) => {
        if (expandedSection === section) {
            setExpandedSection(undefined);
        } else {
            setExpandedSection(section);
        }
    }

    return (
        <div className="admin-sidebar">
            <div className="logo-container">
                <Link to="/">
                    <img src={logo} alt="logo" className="logo"/>
                </Link>
            </div>
            <ul>
                <li>
                    <Link to="/admin/dashboard">
                        <i className="fa fa-home"/><span>Dashboard</span>
                    </Link>
                </li>
                <li className={`dropdown-section ${expandedSection === 'Events' ? 'active' : ''}`}>
                    <div>
                        <button onClick={() => handleExpand('Events')}>
                            <i className="fa-solid fa-calendar"/><span>Events</span>
                        </button>
                        {expandedSection === 'Events' && (
                            <ul>
                                <li>
                                    <Link to="/admin/events">
                                        <i className="fa-solid fa-calendar-plus"/><span>Manage Events</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/event-types">
                                        <i className="fa-solid fa-calendar-days"/><span>Manage Event Types</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </li>
                <li>
                    <Link to="/admin/users">
                        <i className="fa-solid fa-users"/><span>Users</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/transactions">
                        <i className="fa-solid fa-file-invoice-dollar"/><span>Transactions</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}