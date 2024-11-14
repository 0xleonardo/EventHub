import {action, computed, makeObservable, observable, reaction} from 'mobx';

export class CommonStore {

    @observable
    token = window.localStorage.getItem('jwt');

    @observable
    appLoaded = false;

    @observable
    tags: string[] = [];

    @observable
    isLoadingTags = false;

    constructor() {
        makeObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        );
    }

    @action
    setToken(token: string | null) {
        this.token = token;
    }

    @action
    setAppLoaded() {
        this.appLoaded = true;
    }

    @computed
    get isAppLoaded() {
        return this.appLoaded;
    }
}

export default new CommonStore();