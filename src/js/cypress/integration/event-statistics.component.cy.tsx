import { BrowserRouter as Router } from 'react-router-dom';
import {mount} from "cypress/react18";
import {EventStatisticsComponent} from "../../src/components/Pages/EventStatistics/event-statistics.component";

describe('EventStatisticsComponent', () => {
    it('renders successfully', () => {
        mount(
            <Router>
                <EventStatisticsComponent />
            </Router>
        );
        cy.get('.event-statistics').should('exist');
    });

    it('contains the event statistics heading', () => {
        mount(
            <Router>
                <EventStatisticsComponent />
            </Router>
        );
        cy.get('.event-statistics-heading').contains('Event Statistics');
    });

    it('contains the event statistics content', () => {
        mount(
            <Router>
                <EventStatisticsComponent />
            </Router>
        );
        cy.get('.event-statistics-content').should('exist');
    });

    it('contains the event statistics info', () => {
        mount(
            <Router>
                <EventStatisticsComponent />
            </Router>
        );
        cy.get('.event-statistics-info').should('exist');
    });

    it('contains the event statistics', () => {
        mount(
            <Router>
                <EventStatisticsComponent />
            </Router>
        );
        cy.get('.event-statistics-statistics').should('exist');
    });
});