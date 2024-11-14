import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {Authority, User} from '../models/user.model'
import agent from "./agent";

export class UserStore {

    @observable
    currentUser?: User;

    @observable
    loadingUser?: boolean;

    constructor() {
        makeObservable(this);
    }

    @action
    pullUser() {
        this.loadingUser = true;
        return agent.Auth.current()
            .then((res: any) => runInAction(() => {
                this.currentUser = res;
            }))
            .finally(action(() => {
                this.loadingUser = false;
            }))
    }

    @action
    forgetUser() {
        this.currentUser = undefined;
    }

    @computed
    get getUser() {
        return this.currentUser;
    }

    @computed
    get isUserLoading() {
        return this.loadingUser;
    }

    @computed
    get isUserLoggedIn() {
        return !!this.currentUser;
    }

    @computed
    get isUserOrganizer() {
        return this.currentUser?.authority === Authority.ORGANIZER;
    }

    @computed
    get isUserAdmin() {
        return this.currentUser?.authority === Authority.ADMIN;
    }
}

export default new UserStore();