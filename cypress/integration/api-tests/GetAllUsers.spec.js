

describe('GET', () => {
    it('getAllUsers', () => {
        cy.request('/api/users').should(res => {
        const { page, per_page, total, total_pages, data } = res.body
        const checkIds = () => data.forEach(({ id }, index) => {
            expect(id).to.eq(++index);
        })
        checkIds();
        expect(res.status).to.eq(200)
        expect(data.length).to.eq(data[data.length - 1].id)
        expect(page).to.eq(1)
        expect(per_page).to.eq(6)
        expect(total).to.eq(12)
        expect(total_pages).to.eq(2)
        })
    })
})
