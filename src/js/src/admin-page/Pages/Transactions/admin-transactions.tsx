import React, {useContext, useEffect, useState} from 'react';
import "./style.css"
import {getAllTransactions} from "../../../utils/api.utils";
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
import {formatDateToDateTimeNormal} from "../../../utils/simple.utils";
import {AppEvent, TicketStatus} from "../../../models/models";

interface Page<T> {
    content: T[];
    totalPages: number;
}

enum PaymentStatus {
    PROCESSED = 'PROCESSED',
    WAITING = 'WAITING',
    DECLINED = 'DECLINED'
}

export interface TransactionTicket {
    id: string;
    activateId: string;
    category: string;
    price: number;
    status: TicketStatus;
}

interface AdminTransaction {
    id: string,
    paymentStatus: PaymentStatus,
    amountPaid: number,
    timestamp: Date,
    tickets: TransactionTicket[],
    event: AppEvent
}

const _ = require("lodash")

export const AdminTransactions = () => {
    const navigate = useNavigate();
    const showToast = useContext(ToastContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [transactions, setTransactions] = useState<Page<AdminTransaction>>({
        content: [],
        totalPages: 0,
    });

    const [open, setOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState<AdminTransaction>();

    const fetchUsers = () => {
        getAllTransactions(searchQuery, status, page, size)
            .then((res: Page<AdminTransaction>) => {
                console.log(res)
                setTransactions(res)
            })
    }

    useEffect(() => {
        getAllTransactions(searchQuery, status, page, size).then((res: Page<AdminTransaction>) => {
            console.log(res)
            setTransactions(res)
        })
    }, [page, size]);

    const handleSubmitSearch = () => {
        fetchUsers();
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

    const handleClickShow = (transaction: AdminTransaction) => {
        setCurrentTransaction(transaction);
        setOpen(true);
    }


    return (
        <div className="admin-events">
            <div className="admin-events-heading">
                <h1>Transactions</h1>
            </div>
            <div className="search-section">
                <div>
                    <label>Search</label>
                    <input type="text" placeholder="Search by id"
                           onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>
                <div>
                    <label>Transaction status</label>
                    <select name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}>
                        <option value="" disabled={true}>Select status</option>
                        <option value="">No select</option>
                        {Object.values(PaymentStatus).map((type, index) => (
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
                            <TableCell>Payment Status</TableCell>
                            <TableCell>Amount Paid</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Number of tickets</TableCell>
                            <TableCell>Event Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions && transactions?.content.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">{index + 1}</TableCell>
                                <TableCell sx={{width: "160px"}}>{row.id}</TableCell>
                                <TableCell>{row.paymentStatus}</TableCell>
                                <TableCell>{row.amountPaid} €</TableCell>
                                <TableCell>{formatDateToDateTimeNormal(row.timestamp)}</TableCell>
                                <TableCell>{row.tickets.length}</TableCell>
                                <TableCell>{row.event.name}</TableCell>
                                <TableCell style={{width: '160px'}}>
                                    <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                                        <button className="styledGreenButton" onClick={() => handleClickShow(row)}>
                                            <i className="fa-solid fa-eye"/> DETAILS
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={transactions.totalPages * size}
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
                    <Typography variant="body1">Created
                        At:<span
                            style={{fontWeight: "bold"}}> {currentTransaction?.timestamp && formatDateToDateTimeNormal(currentTransaction.timestamp)}</span></Typography>
                    <Typography variant="body1">Id: <span
                        style={{fontWeight: "bold"}}>{currentTransaction?.id}</span></Typography>
                    <Typography variant="body1">Payment Status: <span
                        style={{fontWeight: "bold"}}>{currentTransaction?.paymentStatus}</span></Typography>
                    <Typography variant="body1">Amount Paid: <span
                        style={{fontWeight: "bold"}}>{currentTransaction?.amountPaid} €</span></Typography>
                    <Typography variant="body1">
                        Event: <button className="styledBlueButton"
                                       onClick={() => navigate(`/event/${currentTransaction?.event.id}`)}>
                        {currentTransaction?.event.name}</button>
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentTransaction?.tickets.map((ticket, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row"
                                                   sx={{width: "160px"}}>{ticket.id}</TableCell>
                                        <TableCell>{ticket.category}</TableCell>
                                        <TableCell>{ticket.price} €</TableCell>
                                        <TableCell>{ticket.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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