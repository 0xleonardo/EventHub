import React, {useContext, useEffect, useState} from 'react';
import "./style.css"
import {getAllUsers, promoteToOrganizer} from "../../../utils/api.utils";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import ToastContext from "../../../components-styled/Toast/toast.context";
import {useNavigate} from "react-router-dom";
import {Authority, User} from "../../../models/user.model";
import {formatDateToDateTimeNormal} from "../../../utils/simple.utils";
import {Response, ResponseError} from "superagent";
import {MessageType} from "../../../components-styled/Toast/toast.model";

interface Page<T> {
    content: T[];
    totalPages: number;
}

const _ = require("lodash")

export const AdminUsers = () => {
    const navigate = useNavigate();
    const showToast = useContext(ToastContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [authority, setAuthority] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [users, setUsers] = useState<Page<User>>({
        content: [],
        totalPages: 0,
    });

    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User>();

    const fetchUsers = () => {
        getAllUsers(searchQuery, authority, page, size)
            .then((res: Page<User>) => {
                setUsers(res)
            })
    }

    useEffect(() => {
        getAllUsers(searchQuery, authority, page, size).then((res: Page<User>) => {
            setUsers(res)
        })
    }, [page, size]);

    const handleSubmitSearch = () => {
        fetchUsers();
    }

    const handlePromoteToOrganizer = (userId: string) => {
        promoteToOrganizer(userId)
            .then((res: Response) => {
                if (res.status === 200) {
                    showToast({message: "User successfully promoted to Organizer", type: MessageType.SUCCESS})
                    fetchUsers();
                }
            }).catch((ex: ResponseError) => {
            showToast({message: `Promotion failed ${ex.message}`, type: MessageType.FAILURE})
        })
    }


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickShow = (user: User) => {
        setCurrentUser(user);
        setOpen(true);
    }


    return (
        <div className="admin-events">
            <div className="admin-events-heading">
                <h1>Manage Users</h1>
                <div>
                    <button className="styledGreenButton" onClick={() => navigate("/create")}>NEW</button>
                </div>
            </div>
            <div className="search-section">
                <div>
                    <label>Search</label>
                    <input type="text" placeholder="Search by first name, last name, username, email"
                           onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>
                <div>
                    <label>User Authority</label>
                    <select name="authority"
                            value={authority}
                            onChange={(e) => setAuthority(e.target.value)}>
                        <option value="" disabled={true}>Select authority</option>
                        <option value="">No select</option>
                        {Object.values(Authority).map((type, index) => (
                            <option value={type} key={index}>{type}</option>
                        ))}
                    </select>
                </div>
                <button className="styledRedButton search-button" onClick={handleSubmitSearch}><i
                    className="fa-solid fa-magnifying-glass"/></button>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Row</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Authority</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users && users?.content.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">{index + 1}</TableCell>
                                <TableCell sx={{width: "160px"}}>{row.id}</TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.firstName ? row.firstName + " " + row.lastName : "Not required"}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.authority}</TableCell>
                                <TableCell>{formatDateToDateTimeNormal(row.createdAt)}</TableCell>
                                <TableCell style={{width: '160px'}}>
                                    <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                                        <button className="styledGreenButton" onClick={() => handleClickShow(row)}>
                                            <i className="fa-solid fa-eye"/> DETAILS
                                        </button>
                                        {row.authority === Authority.ORGANIZER && <button className="styledBlueButton"
                                                                                          onClick={() => navigate(`/user/${row.username}`)}>
                                            <i className="fa-solid fa-eye"/> PROFILE
                                        </button>}
                                        {row.authority === Authority.USER && <button className="styledBlueButton"
                                                                                     onClick={() => handlePromoteToOrganizer(row.id)}>
                                            <i className="fa-solid fa-pen-to-square"/> PROMOTE
                                        </button>}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={users.totalPages * size}
                                rowsPerPage={size}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle
                    id="form-dialog-title">Detailed Info</DialogTitle>
                <DialogContent style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                    <Typography variant="body1">Id: <span
                        style={{fontWeight: "bold"}}>{currentUser?.id}</span></Typography>
                    <Typography variant="body1">Username: <span
                        style={{fontWeight: "bold"}}>{currentUser?.username}</span></Typography>
                    <Typography variant="body1">Email: <span
                        style={{fontWeight: "bold"}}>{currentUser?.email}</span></Typography>
                    <Typography variant="body1">Authority: <span
                        style={{fontWeight: "bold"}}>{currentUser?.authority}</span></Typography>
                    <Typography variant="body1">FirstName: <span
                        style={{fontWeight: "bold"}}>{currentUser?.firstName}</span></Typography>
                    <Typography variant="body1">LastName: <span
                        style={{fontWeight: "bold"}}>{currentUser?.lastName}</span></Typography>
                    <Typography variant="body1">ImageUrl: <span
                        style={{fontWeight: "bold"}}>{currentUser?.imageUrl}</span></Typography>
                    <Typography variant="body1">Created
                        At:<span
                            style={{fontWeight: "bold"}}> {currentUser?.createdAt && formatDateToDateTimeNormal(currentUser.createdAt)}</span></Typography>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose} className="styledRedButton">
                        Close
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
};