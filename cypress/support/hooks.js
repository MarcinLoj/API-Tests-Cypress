let countId = 1, iterator = 0, userYear = 2000, totalUsersPages = 0,
totalUsers = 0, totalResourcePages = 0, totalResourceUsers = 0


export const getData = () => {
    return {
    actualPage: iterator,
    id: countId,
    userYear: userYear,
    totalUsersPages: totalUsersPages,
    totalUsers: totalUsers,
    totalResourcePages: totalResourcePages,
    totalResourceUsers: totalResourceUsers
    }
}

export const idAutoIncrement = () => countId++;

export const nextPage = () => ++iterator;

export const actualUserYear = () => userYear++;

before(() => {
    cy.request('/api/users').should(res => {
        expect(res.status).to.eq(200)
    }).then(res => {
        ({ total_pages: totalUsersPages, total: totalUsers } = res.body);
    })
    cy.request('/api/unknown').should(res => {
        expect(res.status).to.eq(200)
    }).then(res => {
        ({ total_pages: totalResourcePages, total: totalResourceUsers } = res.body);
    })
})
beforeEach(() => {
    iterator = 0, countId = 1, userYear = 2000;
})