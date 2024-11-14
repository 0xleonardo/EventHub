import {Route, Routes} from "react-router-dom";
import {observer} from "mobx-react";
import {AdminDashboard} from "../../admin-page/Pages/Dashboard/admin-dashboard.component";
import {AdminSidebar} from "../../admin-page/SideBar/admin-sidebar";
import "../../admin-page/SideBar/style.css"
import {PageNotFound} from "../../components/NavBar/page-not-found/page-not-found";
import {EventTypes} from "../../admin-page/Pages/EventTypes/event-types";
import {AdminEvents} from "../../admin-page/Pages/Events/admin-events";
import {AdminUsers} from "../../admin-page/Pages/Users/admin-users";
import {AdminTransactions} from "../../admin-page/Pages/Transactions/admin-transactions";

export const AdminApp = observer(() => (
    <div className="adminBody">
        <div className="admin-container">
            <AdminSidebar/>
            <div className="admin-content">
                <Routes>
                    <Route path="/dashboard" element={<AdminDashboard/>}/>
                    <Route path="/events" element={<AdminEvents/>}/>
                    <Route path="/event-types" element={<EventTypes/>}/>
                    <Route path="/users" element={<AdminUsers/>}/>
                    <Route path="/transactions" element={<AdminTransactions/>}/>
                    <Route path="/not-found" element={<PageNotFound/>}/>
                    <Route path="/*" element={<PageNotFound/>}/>
                </Routes>
            </div>
        </div>
    </div>
));