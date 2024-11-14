import {useStore} from "../../../stores/store-provider";
import {observer} from "mobx-react";
import "./style.css";
import {useContext, useEffect, useState} from "react";
import {User} from "../../../models/user.model";
import {FormInput} from "../../LoginRegistration/form-input/form-input.component";
import {getUserEvents, getUserEventTickets, updateUser} from "../../../utils/api.utils";
import {AppEvent, TicketStatus, UserTicket, UserUpdateRequest} from "../../../models/models";
import {EventCard} from "../../Event/Event-card/event-card.component";
import Modal from "../EventPage/TicketModal/modal.component";
import ToastContext from "../../../components-styled/Toast/toast.context";
import {Response, ResponseError} from "superagent";
import {MessageType} from "../../../components-styled/Toast/toast.model";
import {useNavigate} from "react-router-dom";
import {DownloadFileButton} from "./download-ticket/download-pdf";

interface Page<T> {
    content: T[];
    totalPages: number;
}

export const UserProfileComponent = observer(() => {
    const {userStore, authStore} = useStore();
    const navigate = useNavigate();
    const showToast = useContext(ToastContext);

    const [user, setUser] = useState<User>();
    const [showModal, setShowModal] = useState(false);

    const [userTickets, setUserTickets] = useState<UserTicket[]>()
    const [userEvents, setUserEvents] = useState<Page<AppEvent> | null>(null);
    const [page, setPage] = useState(0);
    const [size] = useState(6);

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

    const fetchTransactions = () => {
        getUserEvents(page, size)
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
                firstName: pulledUser!.firstName!,
                lastName: pulledUser!.lastName!,
                about: "",
                imageUrl: "",
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
            name: "firstName",
            type: "text",
            placeholder: "Enter your first name",
            errorMessage:
                "Name should be 2-32 characters and shouldn't include any special character!",
            label: "First Name",
            pattern: "^[A-Za-z0-9]{2,32}$",
            value: userCredentials.firstName,
            required: true,
        },
        {
            id: 2,
            name: "lastName",
            type: "text",
            placeholder: "Enter your last name",
            errorMessage:
                "Last Name should be 2-64 characters and shouldn't include any special character!",
            label: "Last Name",
            pattern: "^[A-Za-z0-9]{2,64}$",
            value: userCredentials.lastName,
            required: true,
        },
        {
            id: 3,
            name: "email",
            type: "email",
            placeholder: "Enter your email address",
            errorMessage: "It should be a valid email address!",
            label: "Email",
            value: userCredentials.email,
            required: true,
        },
        {
            id: 4,
            name: "oldPassword",
            type: "password",
            placeholder: "Enter your old password",
            label: "Old Password",
            value: userCredentials.oldPassword,
            required: false,
        },
        {
            id: 5,
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
            id: 6,
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

    const onEventClick = (eventId: string) => {
        getUserEventTickets(eventId)
            .then((res: UserTicket[]) => {
                setUserTickets(res)
                setShowModal(true)
            })
    }

    const closeModal = () => {
        setShowModal(false)
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
                    {userTickets?.map((ticket, index) => (
                        <div className="user-tickets-list" key={index}>
                            <div className="user-ticket-row">
                                <div className="ticket-row-info">
                                    <div>ID <span style={{fontSize: "12px"}}>{ticket.id}</span></div>
                                    <div>Type <span>{ticket.category}</span></div>
                                    <div>Price <span>{ticket.price} €</span></div>
                                    <div>Status <span>{ticket.status === TicketStatus.USED ? ticket.status : "ACTIVE"}</span>
                                    </div>
                                    <DownloadFileButton ticket={ticket} buttonText="PDF"/>
                                </div>
                            </div>
                        </div>
                    ))}
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
                                <button type="submit" className="styledBlueButton"><i
                                    className="fa-solid fa-sd-card"/> Save
                                    profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="section-three">
                <div>
                    <div className="heading">
                        My Events
                    </div>
                    <div className="subheading">
                        Click on event to see your tickets
                    </div>
                </div>
                {userEvents && userEvents?.content.length > 0 ?
                    <div className="events-section">
                        <div className="events">
                            {userEvents.content.map((event: AppEvent, index) => (
                                <EventCard key={index} event={event} onClick={() => onEventClick(event.id)}/>
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
                        Currently you are not attending any events!
                        <button className="styledBlueButton" onClick={() => navigate("/browse")}>Browse Events
                            Now!</button>
                    </div>
                }
            </div>
        </div>
    )
})