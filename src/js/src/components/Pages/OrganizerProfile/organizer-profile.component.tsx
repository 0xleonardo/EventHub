import {useStore} from "../../../stores/store-provider";
import {observer} from "mobx-react";
import "./style.css";
import React, {useContext, useEffect, useState} from "react";
import {User} from "../../../models/user.model";
import {FormInput} from "../../LoginRegistration/form-input/form-input.component";
import {getOrganizerEvents, publishEvent, updateUser} from "../../../utils/api.utils";
import {AppEvent, AppEventStatus, UserUpdateRequest} from "../../../models/models";
import {EventCard} from "../../Event/Event-card/event-card.component";
import Modal from "../EventPage/TicketModal/modal.component";
import ToastContext from "../../../components-styled/Toast/toast.context";
import {Response, ResponseError} from "superagent";
import {MessageType} from "../../../components-styled/Toast/toast.model";
import {useNavigate} from "react-router-dom";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ImageUploader from "../../../components-styled/ImageUploader/image-uploader.component";

interface Page<T> {
    content: T[];
    totalPages: number;
}

export const OrganizerProfileComponent = observer(() => {
    const {userStore, authStore} = useStore();
    const navigate = useNavigate();
    const showToast = useContext(ToastContext);

    const [user, setUser] = useState<User>();
    const [chosenEvent, setChosenEvent] = useState<AppEvent>();
    const [showModal, setShowModal] = useState(false);

    const [userEvents, setUserEvents] = useState<Page<AppEvent> | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(0);
    const [size] = useState(3);

    const [userCredentials, setUserCredentials] = useState<UserUpdateRequest>({
        firstName: "",
        lastName: "",
        about: "",
        imageUrl: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleImageUpload = (url: string) => {
        setUserCredentials((prev) => ({...prev, imageUrl: url}));
    };

    const fetchTransactions = () => {
        getOrganizerEvents(searchQuery, status, page, size)
            .then((res: Page<AppEvent>) => {
                setUserEvents(res)
            })
    }

    useEffect(() => {
        fetchTransactions();
    }, [page, size]);

    useEffect(() => {
        if (userStore.getUser) {
            const pulledUser = userStore.getUser;
            setUser(pulledUser)
            setUserCredentials({
                firstName: "",
                lastName: "",
                about: pulledUser!.about!,
                imageUrl: pulledUser!.imageUrl!,
                email: pulledUser!.email!,
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
        }
    }, [userStore.getUser])

    const inputs = [
        {
            id: 1,
            name: "email",
            type: "email",
            placeholder: "Enter your email address",
            errorMessage: "It should be a valid email address!",
            label: "Email",
            value: userCredentials.email,
            required: true,
        },
        {
            id: 2,
            name: "oldPassword",
            type: "password",
            placeholder: "Enter your old password",
            label: "Old Password",
            value: userCredentials.oldPassword,
            required: false,
        },
        {
            id: 3,
            name: "newPassword",
            type: "password",
            placeholder: "Enter your new password",
            errorMessage:
                "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
            label: "New Password",
            pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&]{8,20}$`,
            value: userCredentials.newPassword,
            required: !!userCredentials.oldPassword,
        },
        {
            id: 4,
            name: "confirmPassword",
            type: "password",
            placeholder: "Enter your new password again",
            errorMessage: "Passwords don't match!",
            label: "Confirm Password",
            pattern: `^${userCredentials.newPassword}$`,
            value: userCredentials.confirmPassword,
            required: !!userCredentials.oldPassword,
        },
    ];

    const onInputChange = (e: any) => {
        setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
    };

    const onEventClick = (event: AppEvent) => {
        setChosenEvent(event)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const handleAboutChange = (event: any, editor: any) => {
        const data = editor.getData();
        setUserCredentials((prev) => ({...prev, about: data}));
    };

    const handlePublishEvent = () => {
        if (chosenEvent) {
            publishEvent(chosenEvent.id)
                .then((res: Response) => {
                    if (res.status === 200) {
                        showToast({message: "Event published successfully", type: MessageType.SUCCESS})
                    }
                }).catch((ex: ResponseError) => {
                showToast({message: "Event couldn't be published", type: MessageType.FAILURE})
            })
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        updateUser(userCredentials)
            .then((res: Response) => {
                if (res.status === 200) {
                    if (!!userCredentials.newPassword) {
                        authStore.logout();
                        navigate("/login")
                        showToast({
                            message: "You successfully updated your profile info! Because you changed your password you need to Sing In again",
                            type: MessageType.SUCCESS
                        })
                    } else {
                        userStore.pullUser()
                        showToast({message: "You successfully updated your profile info!", type: MessageType.SUCCESS})
                    }
                }
            }).catch((err: ResponseError) => {
            showToast({message: err.message, type: MessageType.FAILURE})
            userStore.pullUser();
        })
    };

    return (
        <div className="user-profile-page">
            <Modal show={showModal} onClose={closeModal}>
                <div className="tickets-in-modal">
                    <button className="styledGreenButton" onClick={() => navigate(`/event/${chosenEvent?.id}`)}>
                        VIEW EVENT
                    </button>
                    <button className="styledGreenButton"
                            onClick={() => navigate(`/event/statistics/${chosenEvent?.id}`)}>
                        VIEW STATS
                    </button>
                    {chosenEvent?.status === AppEventStatus.TEMPLATE &&
                        <button className="styledBlueButton" onClick={handlePublishEvent}>
                            PUBLISH
                        </button>}
                    {chosenEvent?.status !== AppEventStatus.ENDED &&
                        <button className="styledBlueButton" onClick={() => navigate(`/update/${chosenEvent?.id}`)}>
                            EDIT YOUR EVENT
                        </button>}
                    <button className="styledRedButton" onClick={closeModal}>CLOSE</button>
                </div>
            </Modal>
            <div className="section-one">
                <div className="heading">
                    My Profile
                </div>
            </div>
            <div className="section-two">
                <div className="user-info">
                    <div className="user_profile_page_info">
                        <form action="#" onSubmit={handleSubmit}>
                            <div>
                                <label>Public Profile Cover Image</label>
                                <ImageUploader image={userCredentials.imageUrl} onUpload={handleImageUpload}/>
                            </div>
                            {inputs.map((input, index) => (
                                <div key={index}>
                                    <div>{input.label}</div>
                                    <FormInput
                                        key={input.id}
                                        {...input}
                                        onChange={onInputChange}
                                    />
                                </div>
                            ))}
                            <div>
                                <div>About</div>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={userCredentials.about}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div>
                                <button type="submit" className="styledBlueButton"><i
                                    className="fa-solid fa-sd-card"/> Save
                                    profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="section-three" id="my-events">
                <div className="heading">
                    My Events
                </div>
                {userEvents && userEvents?.content.length > 0 && (
                    <div className="section-three-search">
                        <div>
                            <label>Search</label>
                            <input type="text" placeholder="Search by name, state or city"
                                   onChange={(e) => setSearchQuery(e.target.value)}/>
                        </div>
                        <div>
                            <label>Event Status</label>
                            <select name="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}>
                                <option value="" disabled={true}>Select status</option>
                                <option value="">No select</option>
                                {Object.values(AppEventStatus).map((type, index) => (
                                    <option value={type} key={index}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <button className="styledRedButton" onClick={() => fetchTransactions()}>Search</button>
                        </div>
                    </div>
                )}
                {userEvents && userEvents?.content.length > 0 ?
                    <div className="events-section">
                        <div className="events">
                            {userEvents.content.map((event: AppEvent, index) => (
                                <EventCard key={index} event={event} onClick={() => onEventClick(event)}
                                           isTemplate={event.status === AppEventStatus.TEMPLATE}/>
                            ))}
                        </div>
                        <div className="event-buttons">
                            <button className="styledRedButton" onClick={() => setPage(page - 1)}
                                    disabled={page === 0}>Previous
                            </button>
                            <button className="styledBlueButton" onClick={() => setPage(page + 1)}
                                    disabled={page === userEvents.totalPages - 1}>Next
                            </button>
                        </div>
                    </div>
                    :
                    <div className="no-events sorry-message">
                        Currently you have no events!
                        <button className="styledBlueButton" onClick={() => navigate("/create")}>Create one
                            now!</button>
                    </div>
                }
            </div>
        </div>
    )
})