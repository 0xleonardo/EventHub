import React, {useContext, useState} from 'react';
import "./style.css"
import {registerUser} from "../../../utils/api.utils";
import ToastContext from "../../../components-styled/Toast/toast.context";
import {MessageType} from "../../../components-styled/Toast/toast.model";
import {ResponseError} from "superagent";
import {useNavigate} from "react-router-dom";

export interface RegisterRequest {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface FormErrors {
    username?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

function RegisterForm() {
    const showToast = useContext(ToastContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterRequest>({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        firstName: '',
        lastName: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let validationErrors: FormErrors = {};

        if (!formData.username.trim()) validationErrors.username = "Username is required";
        if (!formData.password.trim()) validationErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) validationErrors.confirmPassword = "Passwords must match";
        if (!formData.email.trim()) validationErrors.email = "Email is required";
        if (!formData.firstName.trim()) validationErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) validationErrors.lastName = "Last name is required";

        if (!validationErrors.email) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailPattern.test(formData.email)) {
                validationErrors.email = "Email is not valid";
            }
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            registerUser(formData)
                .then((res: Response) => {
                    if (res.status === 200) {
                        showToast({
                            message: "You have been registered successfully. Redirecting you to Login page...",
                            type: MessageType.SUCCESS
                        })
                        setTimeout(() => {
                            navigate('/login');
                        }, 3000);
                    }

                }).catch((err: ResponseError) => {
                showToast({message: err.message, type: MessageType.FAILURE})
            })
        }
    };

    return (
        <div className="register-page">
            <div className="register-page-wrapper">
                <div className="form-container sign-in-container">
                    <form onSubmit={handleSubmit}>
                        <h1>Register</h1>
                        <div className="register-input">
                            <input type="text" name="username" value={formData.username} onChange={handleChange}
                                   placeholder="Username" className={errors.username ? "error-input" : ""}/>
                            {errors.username && <div style={{color: 'red'}}>{errors.username}</div>}
                        </div>
                        <div className="register-input">
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                                   placeholder="First Name" className={errors.firstName ? "error-input" : ""}/>
                            {errors.firstName && <div style={{color: 'red'}}>{errors.firstName}</div>}
                        </div>
                        <div className="register-input">
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                   placeholder="Last Name" className={errors.lastName ? "error-input" : ""}/>
                            {errors.lastName && <div style={{color: 'red'}}>{errors.lastName}</div>}
                        </div>
                        <div className="register-input">
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                   placeholder="Email" className={errors.email ? "error-input" : ""}/>
                            {errors.email && <div style={{color: 'red'}}>{errors.email}</div>}
                        </div>
                        <div className="register-input">
                            <input type="password" name="password" value={formData.password} onChange={handleChange}
                                   placeholder="Password" className={errors.password ? "error-input" : ""}/>
                            {errors.password && <div style={{color: 'red'}}>{errors.password}</div>}
                        </div>
                        <div className="register-input">
                            <input type="password" name="confirmPassword" value={formData.confirmPassword}
                                   onChange={handleChange} placeholder="Confirm Password"
                                   className={errors.confirmPassword ? "error-input" : ""}/>
                            {errors.confirmPassword && <div style={{color: 'red'}}>{errors.confirmPassword}</div>}
                        </div>
                        <div className="buttons">
                            <button type="submit" className="form-btn">Register</button>
                            <div className="register-ask" onClick={() => navigate("/login")}>
                                Already our user? Login in now
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
