import {observer} from "mobx-react";
import "./style.css"
import {useStore} from "../../../stores/store-provider";
import {useNavigate} from "react-router-dom";
import React, {useContext, useState} from "react";
import {ResponseError} from "superagent";
import ToastContext from "../../../components-styled/Toast/toast.context";
import {MessageType} from "../../../components-styled/Toast/toast.model";

interface FormErrors {
    username?: string;
    password?: string;
}

export const Login = observer(() => {
    const {authStore} = useStore();
    const navigate = useNavigate();
    const showToast = useContext(ToastContext);

    const [loginCredentials, setLoginCredentials] = useState({
        username: "",
        password: "",
    });

    const resetLoginForm = () => {
        setLoginCredentials({
            username: "",
            password: "",
        });
    }

    const [errors, setErrors] = useState<FormErrors>({});
    const [error, setError] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState("");

    const validate = () => {
        let validationErrors: FormErrors = {};

        if (!loginCredentials.username.trim()) validationErrors.username = "Username is required";
        if (!loginCredentials.password.trim()) validationErrors.password = "Password is required";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleLoginSubmit = (e: any) => {
        e.preventDefault();
        if (validate()) {
            authStore.login(loginCredentials.username, loginCredentials.password)
                .then(() => {
                    resetLoginForm();
                    showToast({
                        message: 'You are successfully signed in!',
                        type: MessageType.SUCCESS
                    })
                    navigate("/");
                })
                .catch((err: ResponseError) => {
                    setRegisterSuccess("");
                    setError("Bad credentials")
                    resetLoginForm();
                });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginCredentials({
            ...loginCredentials,
            [name]: value,
        });
    };

    return (
        <div className="login-page">
            <div className="login-page-wrapper">
                <div className="form-container sign-in-container">
                    <form action="#" onSubmit={handleLoginSubmit}>
                        <h1>Sign in</h1>
                        {!!error && <div className="sorry-message">{error}</div>}
                        <div className="register-input">
                            <input type="text" name="username" value={loginCredentials.username} onChange={handleChange}
                                   placeholder="Username" className={errors.username ? "error-input" : ""}/>
                            {errors.username && <div style={{color: 'red'}}>{errors.username}</div>}
                        </div>
                        <div className="register-input">
                            <input type="password" name="password" value={loginCredentials.password}
                                   onChange={handleChange} className={errors.password ? "error-input" : ""}
                                   placeholder="Password"/>
                            {errors.password && <div style={{color: 'red'}}>{errors.password}</div>}
                        </div>
                        {!!registerSuccess && <div className="registerSuccess">{registerSuccess}</div>}
                        <div className="buttons">
                            <button type="submit" className="form-btn">Sign In</button>
                            <div className="register-ask" onClick={() => navigate("/register")}>Don't have an account?
                                Register Now
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
})