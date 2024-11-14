import "./style.css"
import {useNavigate} from "react-router-dom";

const logo = require("../../assets/logo.png");

export const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className="footer">
            <div className="footer-container-one">
                <div className="logo">
                    <img src={logo} alt="Logo" onClick={() => navigate("/")}/>
                </div>
                <div className="footer-section">
                    <span>Useful links</span>
                    <div>
                        <a onClick={() => navigate("/browse")}>Events</a>
                        <a onClick={() => navigate("/about")}>About</a>
                        <a onClick={() => navigate("/terms")}>Terms & Conditions</a>
                        <a onClick={() => navigate("/privacy")}>Privacy Policy</a>
                    </div>
                </div>
                <div className="footer-section">
                    <span>Contact</span>
                    <div>
                        <a href="mailto:info@eventhub.com?subject='Inquiry'&body='Hi EventHub, I have question regarding...'"><i
                            className="fa-solid fa-envelope"/> info@eventhub.com</a>
                        <a href="tel:+385982432345"><i className="fa-solid fa-phone"/> +385 98 243 2345</a>
                        <a><i className="fa-solid fa-location-dot"/> Trg Marka Marulića 19, Zagreb</a>
                        <a><i className="fa-solid fa-message"/> Send us a message</a>
                    </div>
                </div>
                <div className="footer-section">
                    <span>Socials</span>
                    <div className="footer-socials">
                        <div>Find us on social platforms</div>
                        <div className="social-button">
                            <button>
                                <a href="#">
                                    <i className="fa-brands fa-facebook"/>
                                </a>
                            </button>
                            <button>
                                <a href="#">
                                    <i className="fa-brands fa-twitter"/>
                                </a>
                            </button>
                            <button>
                                <a href="#">
                                    <i className="fa-brands fa-instagram"/>
                                </a>
                            </button>
                            <button>
                                <a href="#">
                                    <i className="fa-brands fa-linkedin"/>
                                </a>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="footer-container-two">
                <span>© 2024 EventHub. Product by TVZ DreamTeam</span>
            </div>
        </div>
    );
}