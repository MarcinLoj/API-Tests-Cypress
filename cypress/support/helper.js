import * as staticData from '../fixtures/data.json'
import { getData, idAutoIncrement, nextPage, actualUserYear } from './hooks';

export const checkEmailValidation = (element) => {
    let reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return reg.test(element) ? 'Email is correct' : 'Email is wrong'
}

export const changeResponseTimeoutIfGtDefault = responseDelay => {
    if (responseDelay > 30) {
        return (responseDelay * 100)
    }
    else return 30*1000
}

export const getValidUser = userCount => Math.ceil(Math.random() * userCount)

export const checkResponseData = (response,option) => {
if (option.source === 'users') {
    response.body.data.forEach(({ id, email, first_name: firstName, last_name: lastName, avatar }) => {
        expect(avatar).to.eq(`${staticData.imgUrl}/${getData().id}-image.jpg`)
        expect(id).to.eq(idAutoIncrement());
        expect(checkEmailValidation(email)).to.not.eq('Email is wrong', 'Email check via REGEX')
        expect(firstName.trim()).to.not.be.empty;
        expect(lastName.trim()).to.not.be.empty;
        })
    }
if (option.source === 'unknown') {
    response.body.data.forEach(({ id, name, year, color, pantone_value: pantoneValue }) => {
        expect(id).to.eq(idAutoIncrement());
        expect(name.trim()).to.not.be.empty;
        expect(year).to.eq(actualUserYear());
        expect(color.trim()).to.not.be.empty;
        expect(pantoneValue.trim()).to.not.be.empty;
        })
    }
}


export const verifyDataOnAllPages = (option = { source: '', delay: 0 }) => {
    if(getData().actualPage !== getData().totalUsersPages|| getData().actualPage !== getData().totalResourcePages) {
        let desiredUrl = `/api/${option.source}?page=${nextPage()}`;
        if(option.delay > 0) {
            desiredUrl += `&delay=${option.delay}`
        }
        cy.request({
            url: desiredUrl,
            timeout: changeResponseTimeoutIfGtDefault(option.delay)
        }).should(res => {
            expect(res.status).to.eq(200)
            checkResponseData(res,option)
            verifyDataOnAllPages(option)
        })
    }
}

export const verifyDataForSingleUser = (option = {source: ''}) => {
    let currentUserId = 0;
    if(option.source === 'users') {
    currentUserId = getValidUser(getData().totalUsers);
    cy.request(`/api/${option.source}/${currentUserId}`).should(res => {
        const { id, email, first_name: firstName, last_name: lastName, avatar} = res.body.data;
        expect(id).to.eq(currentUserId);
        expect(avatar).to.eq(`${staticData.imgUrl}/${currentUserId}-image.jpg`)
        expect(checkEmailValidation(email)).to.not.eq('Email is wrong', 'Email check via REGEX')
        expect(firstName.trim()).to.not.be.empty;
        expect(lastName.trim()).to.not.be.empty;
    })
}
    if(option.source === 'unknown') {
    currentUserId = getValidUser(getData().totalResourceUsers)
    cy.request(`/api/unknown/${currentUserId}`).should(res => {
        const { id, name, year, color, pantone_value: pantoneValue } = res.body.data;
        expect(id).to.eq(currentUserId)
        expect(name.trim()).to.not.be.empty;
        expect(year).to.eq(getData().userYear + currentUserId - 1);
        expect(color.trim()).to.not.be.empty;
        expect(pantoneValue.trim()).to.not.be.empty;
    })
}
}

export const verifyStatusWhenUserNotFound = (option = {source: ''}) => {
    cy.request({
        url: `api/${option.source}/${getData().totalUsers+1}`,
        failOnStatusCode: false
    }).should(res => expect(res.status).to.eq(404))
}