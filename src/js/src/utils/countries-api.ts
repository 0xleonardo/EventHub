import superagentPromise from 'superagent-promise';
import _superagent, {Response} from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'https://restcountries.com/v3.1';

const responseBody = (res: Response) => res.body;

const requests = {
    get: (url: string) =>
        superagent
            .get(`${API_ROOT}${url}`)
            .then(responseBody),
};

const Countries = {
    getAll: () =>
        requests.get('/all'),
};


const countriesAgent = {
    Countries
};

export default countriesAgent;
