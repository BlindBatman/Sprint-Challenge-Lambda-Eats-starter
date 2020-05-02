describe("test our form inputs", function () {
  beforeEach(function () {
    cy.visit("http://localhost:3000/pizza");
  });
  it("first test", function () {
    cy.get('[data-cy="name"]').type("emily").should("have.value", "emily");
    cy.get('[type="checkbox"]').check().should("be.checked");
    cy.get('[data-cy="Submit"]').click();
  });
  it("second test", function () {
    cy.get('[data-cy="name"]').type("s");
    cy.get('[data-cy="Sausage"]').check().should("be.checked");
    cy.get('[data-cy="Submit"]').click();
  });
});
