import data from '../../fixtures/data.json';

let totalPages = 0, countId = 0, iterator = 0, totalUsers = 0

const checkEmailValidation = (element) => {
    let reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return reg.test(element) ? 'Email is correct' : 'Email is wrong'
}

const getValidUser = () => Math.ceil(Math.random() * totalUsers)

const checkResponseData = (response) => 
response.body.data.forEach(({ id, email, first_name: firstName, last_name: lastName, avatar }) => {
    expect(id).to.eq(++countId);
    expect(checkEmailValidation(email)).to.not.eq('Email is wrong', 'Email check via REGEX')
    expect(firstName.trim()).to.not.be.empty;
    expect(lastName.trim()).to.not.be.empty;
    expect(avatar).to.eq(`${data.imgUrl}/${id}-image.jpg`)
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
    cy.request('/api/users?page=1').should(res => {
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
        cy.request(`/api/users/${getValidUser()}`).should(res => {
            const { id, email, first_name: firstName, last_name: lastName, avatar} = res.body.data;
            expect(checkEmailValidation(email)).to.not.eq('Email is wrong', 'Email check via REGEX')
            expect(firstName.trim()).to.not.be.empty;
            expect(lastName.trim()).to.not.be.empty;
            expect(avatar).to.eq(`${data.imgUrl}/${id}-image.jpg`)
        })
    })
    it('Check status when user is not found', () => {
        cy.request({
            url: `api/users/${totalUsers+1}`,
            failOnStatusCode: false
        }).should(res => expect(res.status).to.eq(404))
    })
});
