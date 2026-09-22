export const TEST_TOKEN = 'JWT_TOKEN';

export function visitAuthenticated(path: string): void {
  cy.visit(path, {
    onBeforeLoad(window) {
      window.sessionStorage.setItem('token', TEST_TOKEN);
    }
  });
}
