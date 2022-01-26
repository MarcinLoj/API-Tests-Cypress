describe('First api tests', () => {
    it('my first api test', () => {
        cy.request({
            method: 'GET',
            url: 'https://reqres.in/api/users?page=2'
        }).as('getUser');
        cy.get('@getUser').should(res => {
            expect(res.status).to.eq(200);
            
        })
    })
})