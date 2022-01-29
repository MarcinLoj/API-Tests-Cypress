let totalPages = 0, countId = 0, iterator = 0, totalUsers = 0;

const checkEmailValidation = (element) => {
    //let reg = ?. regex will be added soon
    return reg.test(element) ? 1 : 0
}

const getValidUser = Math.ceil(Math.random() * totalUsers);

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
        ({ total_pages: totalPages, total: totalUsers } = res.body);
    })
})
describe('GET', () => {
    it('Check data for all users on the specified page', () => {
        checkAllPages();
    })
    it('Check data for single user', () => {
        cy.request(`/api/users/${1}`
        ).should(res => {
            const { email, first_name: firstName, last_name: lastName, avatar } = res.body
            expect(email).to.not.eq('')
            expect(firstName).to.not.eq('');
            expect(lastName).to.not.eq('');
            expect(avatar).to.not.eq('');
            
        })
    })
});
