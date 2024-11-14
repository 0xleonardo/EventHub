import userStore, {UserStore} from "./user.store";
import authStore, {AuthStore} from "./auth.store";
import commonStore, {CommonStore} from "./common.store";

export type RootStore = {
    userStore: UserStore;
    commonStore: CommonStore;
    authStore: AuthStore;
}

const rootStore: RootStore = {
    authStore,
    commonStore,
    userStore,
};

export default rootStore;