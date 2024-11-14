import React from 'react';
import {UserTicket} from "../../../../models/models";
import {downloadPdf} from "../../../../utils/api.utils";

interface Props {
    ticket: UserTicket;
    buttonText: string;
}

export const DownloadFileButton = (props: Props) => {
    const {ticket} = props;

    const downloadFile = async () => {
        downloadPdf(ticket.id)
            .then((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${ticket.id}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error: Error) => {
                console.error(error);
            });
    };

    return (
        <button onClick={downloadFile} className="styledBlueButton">{props.buttonText}</button>
    );
}
