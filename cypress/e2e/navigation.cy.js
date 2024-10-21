describe('Navigation Tests', () => {
  it('Should navigate to the home page and verify elements', () => {
    cy.visit('/');
    cy.get('#logo').should('contain', 'Giphy Search');
  });

  it('Should open GitHub link in a new tab', () => {
    cy.visit('/');
    cy.get('#github-link a').should('have.attr', 'href', 'https://github.com/lcrojano/Giphy_Explorer');
    cy.get('#github-link a').should('have.attr', 'target', '_blank');
  });

  it('Should navigate to the login page', () => {
    cy.visit('/');
    cy.get('a[href="login.html"]').click();
    cy.url().should('include', 'login.html');
  });

  it('Should show the scroll-to-top button on scroll down', () => {
    cy.visit('/');
    cy.scrollTo(0, 500);
    cy.get('#myBtn').should('be.visible');
  });
});
