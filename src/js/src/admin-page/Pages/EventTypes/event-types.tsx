import React, {useContext, useEffect, useState} from 'react';
import "./style.css"
import {AppEventType} from "../../../models/models";
import {deleteEventType, getEventTypes, updateOrCreateEventType} from "../../../utils/api.utils";
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
    TextField
} from '@mui/material';
import ImageUploader from "../../../components-styled/ImageUploader/image-uploader.component";
import {ResponseError} from "superagent";
import ToastContext from "../../../components-styled/Toast/toast.context";
import {MessageType} from "../../../components-styled/Toast/toast.model";

interface Page<T> {
    content: T[];
    totalPages: number;
}

type Errors = {
    name?: string;
    image?: string;
};

export const EventTypes = () => {
    const showToast = useContext(ToastContext);
    const [eventTypes, setEventTypes] = useState<Page<AppEventType>>();
    const [open, setOpen] = React.useState(false);
    const [currentEventType, setCurrentEventType] = React.useState<AppEventType>({
        id: "",
        name: "",
        image: "",
    });
    const [page, setPage] = React.useState(0);
    const [size, setSize] = React.useState(5);

    const [errors, setErrors] = useState<Errors>({});

    const validate = () => {
        let validationErrors: Errors = {};

        if (!currentEventType?.name.trim()) validationErrors.name = "Name is required";
        if (!currentEventType?.image.trim()) validationErrors.image = "Image is required";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleClickOpen = (row?: AppEventType) => {
        if (row) {
            setCurrentEventType({...row});
        } else {
            setCurrentEventType({
                id: "",
                name: "",
                image: "",
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setErrors({})
        setOpen(false);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setCurrentEventType({
            ...currentEventType,
            [name]: value,
        });
    };

    const handleImageUpload = (url: string) => {
        if (currentEventType) {
            setCurrentEventType({
                ...currentEventType,
                image: url
            });
        }
    };

    useEffect(() => {
        getEventTypes(page, size).then((res: Page<AppEventType>) => {
            setEventTypes(res)
        })
    }, [page, size]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSave = () => {
        if (validate()) {
            updateOrCreateEventType(currentEventType)
                .then((res: Response) => {
                    if (res.status === 200) {
                        showToast({message: "Action successful", type: MessageType.SUCCESS})
                        getEventTypes(page, size).then((res: Page<AppEventType>) => {
                            setEventTypes(res)
                        })
                    }
                }).catch((ex: ResponseError) => {
                showToast({message: "Something went wrong", type: MessageType.FAILURE})
            })
            setOpen(false);
        }
    };

    const handleDelete = (eventTypeId: number) => {
        deleteEventType(eventTypeId)
            .then((res: Response) => {
                if (res.status === 200) {
                    showToast({message: `EventType ${eventTypeId} deleted`, type: MessageType.SUCCESS})
                    getEventTypes(page, size).then((res: Page<AppEventType>) => {
                        setEventTypes(res)
                    })
                }
            }).catch((ex: ResponseError) => {
            showToast({message: `Something went wrong: ${ex.message}`, type: MessageType.FAILURE})
        })
    }

    return (
        <div className="admin-event-types">
            <div className="admin-event-types-heading">
                <h1>Manage Event Types</h1>
                <div>
                    <button className="styledGreenButton" onClick={() => handleClickOpen()}>NEW</button>
                </div>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {eventTypes && eventTypes?.content.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell><img src={row.image} alt={row.name} style={{width: '120px'}}/></TableCell>
                                <TableCell style={{width: '160px'}}>
                                    <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                                        <button className="styledBlueButton" onClick={() => handleClickOpen(row)}>
                                            <i className="fa-solid fa-pen-to-square"/> EDIT
                                        </button>
                                        <button className="styledRedButton"
                                                onClick={() => handleDelete(parseInt(row.id))}>
                                            <i className="fa-solid fa-trash"/> DELETE
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
                                count={eventTypes && eventTypes.totalPages * size || size}
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
                    id="form-dialog-title">{currentEventType ? "Edit Event Type" : "New Event Type"}</DialogTitle>
                <DialogContent style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                    <TextField
                        error={!!errors.name}
                        helperText={errors.name ? "Name is required" : ""}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        name="name"
                        type="text"
                        fullWidth
                        defaultValue={currentEventType ? currentEventType.name : ''}
                        onChange={handleNameChange}
                    />
                    <ImageUploader
                        image={currentEventType ? currentEventType.image : ''}
                        onUpload={handleImageUpload}
                    />
                    {errors.image && <div style={styles.error}>{errors.image}</div>}
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose} className="styledRedButton">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="styledGreenButton">
                        Save
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const styles = {
    input: {
        padding: "5px",
        margin: "5px 0",
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "4px",
    },
    error: {
        color: "red",
        fontSize: "12px",
    },
};