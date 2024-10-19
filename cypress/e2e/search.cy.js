describe('GIF Search Bar', () => {
  it('Should type a search term and display results', () => {
    cy.visit('/');
    cy.get('input[type="search"]').type('funny cats');
    cy.get('#search-btn').click();

    // Check if the GIF list exists and is not empty
    cy.get('#gifs-list', { timeout: 10000 }).should('exist').and('not.be.empty');

    // Check if any GIF images are present instead of a specific text
    cy.get('#gifs-list img').should('have.length.greaterThan', 0); // Ensure at least one GIF is present

    // Alternatively, you can check if it contains a class or another attribute
    // Example: Check if it contains any GIF-related class or image element
    // cy.get('#gifs-list').should('have.class', 'gif-class'); // Update as necessary
  });

  it('Should navigate to the favorites page when clicked', () => {
    cy.visit('/');
    cy.get('#fav-btn a').click();
    cy.url().should('include', 'favs.html');
  });
  
  it('Should toggle light/dark mode', () => {
    cy.visit('/');
    cy.get('#toggle').click();
    cy.get('body').should('have.class', 'dark-mode'); // Assuming body toggles a class
  });
});
