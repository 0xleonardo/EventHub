import {HomeComponent} from "../../src/components/Pages/Home/home.component";
import {mount} from "cypress/react18";
import {BrowserRouter as Router} from "react-router-dom";

describe('HomeComponent', () => {
    it('renders successfully', () => {
        mount(
            <Router>
                <HomeComponent />
            </Router>
        );
        cy.get('.home-wrapper').should('exist');
    });

    it('contains the EventHub name', () => {
        mount(
            <Router>
                <HomeComponent />
            </Router>
        );
        cy.get('.name').contains('EventHub');
    });

    it('contains the welcome message', () => {
        mount(
            <Router>
                <HomeComponent />
            </Router>
        );
        cy.get('.message').contains('Welcome to the future of event organization: simple, secure, spectacular. Join us and let\'s create extraordinary experiences together!');
    });
});