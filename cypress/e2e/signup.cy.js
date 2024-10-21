describe('Sign Up Page Tests', () => {
  beforeEach(() => {
      cy.visit('signup.html'); // Change this path if your file is located differently
  });

  it('Should fill out the signup form and submit successfully', () => {
      cy.get('#username').type('testuser'); // Type a username
      cy.get('#email').type('testuser@example.com'); // Type an email
      cy.get('#password').type('password123'); // Type a password
      cy.get('button[type="submit"]').click(); // Click the sign-up button

      // Verify that the alert is shown with the expected message
      cy.on('window:alert', (txt) => {
          expect(txt).to.contains('Signed up successfully!'); // Check for success message
      });
  });

  it('Should show an alert when fields are left empty', () => {
      cy.get('button[type="submit"]').click(); // Click the sign-up button without filling out the form

      // Verify that the alert is shown with the expected message
      cy.on('window:alert', (txt) => {
          expect(txt).to.contains('Please fill in all fields.'); // Check for alert message
      });
  });

  it('Should navigate to the login page when clicking the login link', () => {
      cy.get('.login-text a').click(); // Click the login link
      cy.url().should('include', 'login.html'); // Check if the URL is correct
  });
});
