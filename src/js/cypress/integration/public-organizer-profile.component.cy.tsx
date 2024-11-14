import { BrowserRouter as Router } from 'react-router-dom';
import {mount} from "cypress/react18";
import {
    PublicOrganizerProfileComponent
} from "../../src/components/Pages/PublicOrganizerProfile/public-organizer-profile.component";

describe('PublicOrganizerProfileComponent', () => {
    it('renders successfully', () => {
        mount(
            <Router>
                <PublicOrganizerProfileComponent />
            </Router>
        );
        cy.get('.public-organizer-profile-page').should('exist');
    });

    it('contains the profile heading', () => {
        mount(
            <Router>
                <PublicOrganizerProfileComponent />
            </Router>
        );
        cy.get('.heading').contains('Profile');
    });

    it('contains the contact mail', () => {
        mount(
            <Router>
                <PublicOrganizerProfileComponent />
            </Router>
        );
        cy.get('.contact-mail').should('exist');
    });

    it('contains the about section', () => {
        mount(
            <Router>
                <PublicOrganizerProfileComponent />
            </Router>
        );
        cy.get('.about').should('exist');
    });
});