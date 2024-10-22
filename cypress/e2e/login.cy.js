describe('Login Page Tests', () => {
  it('Should visit the login page and check elements', () => {
    cy.visit('/login.html');
    cy.get('h2').should('contain', 'Login');
    cy.get('form').within(() => {
      cy.get('input[name="username"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Login');
    });
  });

  it('Should display error if username or password is missing', () => {
    cy.visit('/login.html');
    cy.get('button[type="submit"]').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Please enter both username and password');
    });
  });

  it('Should successfully log in with correct credentials', () => {
    cy.visit('/login.html');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Logged in successfully');
    });
  });

  it('Should navigate to the sign-up page when clicking sign up link', () => {
    cy.visit('/login.html');
    cy.get('.signup-link a').click();
    cy.url().should('include', 'signup.html');
  });
});
