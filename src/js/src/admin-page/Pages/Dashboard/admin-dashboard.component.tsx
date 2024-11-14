import {observer} from "mobx-react";
import React, {useContext, useEffect, useState} from "react";
import "./style.css"
import {getAdminDashboardStatistics} from "../../../utils/api.utils";
import {ResponseError} from "superagent";
import ToastContext from "../../../components-styled/Toast/toast.context";
import {MessageType} from "../../../components-styled/Toast/toast.model";
import {useNavigate} from "react-router-dom";

interface BasicStatistics {
    totalActiveEvents: number;
    totalTemplateEvents: number;
    totalEndedEvents: number;
    totalUsers: number;
    totalOrganizers: number;
    totalTransactionsIn24Hours: number;
}

export const AdminDashboard = observer(() => {
    const navigate = useNavigate();
    const showToast = useContext(ToastContext);
    const [basicStatistics, setBasicStatistics] = useState<BasicStatistics>();

    useEffect(() => {
        getAdminDashboardStatistics()
            .then((res: BasicStatistics) => {
                setBasicStatistics(res)
            }).catch((ex: ResponseError) => {
            showToast({message: "Couldn't fetch statistics", type: MessageType.FAILURE})
        })
    }, [])

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-heading">
                <h1>Admin Dashboard</h1>
            </div>
            <div className="admin-dashboard-statistics">
                <div className="admin-dashboard-statistics-section">
                    <div className="icon"><i className="fa-solid fa-calendar-check"/></div>
                    <div className="info">Total Active Events: <span>{basicStatistics?.totalActiveEvents}</span></div>
                    <div>
                        <button className="styledBlueButton" onClick={() => navigate("/admin/events")}>View All
                        </button>
                    </div>
                </div>
                <div className="admin-dashboard-statistics-section">
                    <div className="icon"><i className="fa-solid fa-calendar-minus"/></div>
                    <div className="info">Total Template Events: <span>{basicStatistics?.totalTemplateEvents}</span>
                    </div>
                    <div>
                        <button className="styledBlueButton" onClick={() => navigate("/admin/events")}>View All
                        </button>
                    </div>
                </div>
                <div className="admin-dashboard-statistics-section">
                    <div className="icon"><i className="fa-solid fa-calendar-xmark"/></div>
                    <div className="info">Total Ended Events: <span>{basicStatistics?.totalEndedEvents}</span></div>
                    <div>
                        <button className="styledBlueButton" onClick={() => navigate("/admin/events")}>View All
                        </button>
                    </div>
                </div>
                <div className="admin-dashboard-statistics-section">
                    <div className="icon"><i className="fa-solid fa-user-group"/></div>
                    <div className="info">Total Users: <span>{basicStatistics?.totalUsers}</span></div>
                    <div>
                        <button className="styledBlueButton" onClick={() => navigate("/admin/users")}>View All
                        </button>
                    </div>
                </div>
                <div className="admin-dashboard-statistics-section">
                    <div className="icon"><i className="fa-solid fa-user-astronaut"/></div>
                    <div className="info">Total Organizers: <span>{basicStatistics?.totalOrganizers}</span></div>
                    <div>
                        <button className="styledBlueButton" onClick={() => navigate("/admin/organizers")}>View All
                        </button>
                    </div>
                </div>
                <div className="admin-dashboard-statistics-section">
                    <div className="icon"><i className="fa-solid fa-file-invoice-dollar"/></div>
                    <div className="info">Transactions in last
                        24h: <span>{basicStatistics?.totalTransactionsIn24Hours}</span></div>
                    <div>
                        <button className="styledBlueButton" onClick={() => navigate("/admin/transactions")}>View All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
})