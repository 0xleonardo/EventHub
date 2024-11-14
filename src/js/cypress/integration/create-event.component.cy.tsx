import { BrowserRouter as Router } from 'react-router-dom';
import {mount} from "cypress/react18";
import {CreateEvent} from "../../src/components/Pages/CreateEvent/create-event.component";

describe('CreateEvent', () => {
    it('renders successfully', () => {
        mount(
            <Router>
                <CreateEvent />
            </Router>
        );
        cy.get('.create-event').should('exist');
    });

    it('contains the heading', () => {
        mount(
            <Router>
                <CreateEvent />
            </Router>
        );
        cy.get('.heading').contains('Create Event');
    });

    it('contains the info section', () => {
        mount(
            <Router>
                <CreateEvent />
            </Router>
        );
        cy.get('.info-section').should('exist');
    });

    it('contains the create event container', () => {
        mount(
            <Router>
                <CreateEvent />
            </Router>
        );
        cy.get('.create-event-container').should('exist');
    });
});