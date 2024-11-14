import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {ResponseError} from "superagent";
import commonStore from "./common.store";
import userStore from "./user.store";
import agent from "./agent";

export class AuthStore {

    @observable
    inProgress = false;

    @observable
    errors = undefined;


    constructor() {
        makeObservable(this);
    }

    @computed
    get getErrors() {
        return this.errors;
    }


    @action
    login(username: string, password: string) {
        this.inProgress = true;
        this.errors = undefined;
        return agent.Auth.login(username, password)
            .then(res => runInAction(() => {
                commonStore.setToken(res.token)
            }))
            .then(() => runInAction(() => userStore.pullUser()))
            .catch(action((err: ResponseError) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .finally(action(() => {
                this.inProgress = false;
            }));
    }

    @action
    logout() {
        commonStore.setToken(null);
        userStore.forgetUser();
        return Promise.resolve();
    }
}

export default new AuthStore();