let totalPages = 0, countId = 0, iterator = 0;

const checkResponseData = (response) => 
response.body.data.forEach(({ id, email, first_name: firstName, last_name: lastName, avatar }) => {
    expect(id).to.eq(++countId);
    expect(email).to.not.eq('');
    expect(firstName).to.not.eq('');
    expect(lastName).to.not.eq('');
    expect(avatar).to.not.eq('');
})
const checkAllPages = () => {
    if(iterator !== totalPages) {
        cy.request(`/api/users?page=${++iterator}`).should(res => {
            expect(res.status).to.eq(200)
                checkResponseData(res);
                checkAllPages();
        })
    }
}

before(() => {
    cy.request('/api/users').should(res => {
        expect(res.status).to.eq(200)
    }).then(res => {
        totalPages = res.body.total_pages;
    })
})
describe('GET', () => {
    it('Check id for all users', () => {
        checkAllPages();
    })
});
