import {mount} from "cypress/react18";
import {BrowserRouter as Router} from "react-router-dom";
import {EventBrowser} from "../../src/components/Pages/BrowseEvents/browse.component";

describe('EventBrowser', () => {
    it('renders successfully', () => {
        mount(
            <Router>
                <EventBrowser />
            </Router>
        );
        cy.get('.browse').should('exist');
    });

    it('contains the heading', () => {
        mount(
            <Router>
                <EventBrowser />
            </Router>
        );
        cy.get('.heading').contains('Browse Events');
    });

    it('contains the search section', () => {
        mount(
            <Router>
                <EventBrowser />
            </Router>
        );
        cy.get('.search-section').should('exist');
    });

    it('contains the event list', () => {
        mount(
            <Router>
                <EventBrowser />
            </Router>
        );
        cy.get('.event-list').should('exist');
    });
});