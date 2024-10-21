describe('Favorites Page Tests', () => {
  beforeEach(() => {
      // Assuming you have a way to navigate to the favorites page
      cy.visit('favs.html');
  });

  it('Should check if the GIFs list exists', () => {
      cy.get('#gifs-list').should('exist'); // Expect the GIFs list to exist
  });

  it('Should navigate to the login page when "Log In" button is clicked', () => {
      cy.get('button.secondary-btn').contains('Log In').click({ force: true }); // Force the click
      cy.url().should('include', 'login.html'); // Check if the URL is correct
  });

  it('Should toggle light/dark mode', () => {
      cy.get('#toggle').click(); // Assuming this toggles the light/dark mode
      // You may add assertions here to check the theme has changed
  });

  it('Should display a message when no favorites are present', () => {
      // You can check for a message or specific element that indicates no favorites
      cy.get('#gifs-list').should('exist'); // Ensure the GIFs list exists
      cy.get('#gifs-list').should('be.empty'); // Check that it's empty, which is expected
      // Add any additional assertions for your "no favorites" message if applicable
  });
});
