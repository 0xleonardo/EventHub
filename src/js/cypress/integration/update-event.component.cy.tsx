import { BrowserRouter as Router } from 'react-router-dom';
import {mount} from "cypress/react18";
import {UpdateEvent} from "../../src/components/Pages/UpdateEvent/update-event.component";

describe('UpdateEvent', () => {
    it('renders successfully', () => {
        mount(
            <Router>
                <UpdateEvent />
            </Router>
        );
        cy.get('.create-event').should('exist');
    });

    it('contains the info section', () => {
        mount(
            <Router>
                <UpdateEvent />
            </Router>
        );
        cy.get('.info-section').should('exist');
    });

    it('contains the create event container', () => {
        mount(
            <Router>
                <UpdateEvent />
            </Router>
        );
        cy.get('.create-event-container').should('exist');
    });

    it('contains the heading', () => {
        mount(
            <Router>
                <UpdateEvent />
            </Router>
        );
        cy.get('.heading').contains('Create Event');
    });
});