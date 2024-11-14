import {format} from 'date-fns';
import {useLocation} from "react-router-dom";
import {useEffect} from "react";

const moment = require('moment');

const _ = require('lodash');

export function importAll(r: any) {
    return r.keys().map(r);
}

export const moneyCurrency = "€";

export const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return format(date, 'do MMM yyyy');
};

export const formatDateTime = (dateString: Date) => {
    const date = new Date(dateString);
    return format(date, 'do MMM yyyy HH:mm');
};

export const formatDateToDateTime = (dateStr: string) => {
    return moment(dateStr).format('YYYY-MM-DDTHH:mm:ss')
}

export const formatDateToDateTimeNormal = (dateStr: Date) => {
    return moment(dateStr).format('DD.MM.yyyy HH:mm:ss')
}

export const isDateBeforeNow = (dateStr: Date) => {
    const now = moment();
    const eventEndTime = moment(dateStr);
    return eventEndTime < now;
}

export const sortStringAlphabetically = (a: string, b: string) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
}

export const hasUndefinedFields = (obj: Record<string, any>): boolean => {
    return Object.values(obj).some(value => value === undefined);
}

export const checkIfFieldEmpty = <T>(fields: T[]) => {
    return _.includes(Object.values(fields).map((value) => {
        if (value === 0) {
            return false;
        }
        return _.isEmpty(value);
    }), true)
}

export const ScrollToTop = () => {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}