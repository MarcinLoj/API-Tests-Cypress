import * as helper from '../../support/helper'

describe('GET', () => {
    it('Check data for all users on the specified page', () => {
        helper.verifyDataOnAllPages({source: 'users'});
    })
    it('Check data for all resource users on the specified page', () => {
        helper.verifyDataOnAllPages({source: 'unknown'})
    })
    it('Check data for single user', () => {
        helper.verifyDataForSingleUser({source: 'users'});
    })
    it('Check status when user is not found', () => {
        helper.verifyStatusWhenUserNotFound({source: 'unknown'});
    })
    it('Check data for single resource user', () => {
        helper.verifyDataForSingleUser({source: 'unknown'})
    })
    it('Check status when resource user is not found', () => {
        helper.verifyStatusWhenUserNotFound({source: 'unknown'})
    })
    it('Check data for all users while response is delayed', () => {
        helper.verifyDataOnAllPages( {source: 'users', delay: 15 })
    })
    it('Check data for all resource users while response is delayed', () => {
        helper.verifyDataOnAllPages( {source: 'unknown', delay: 15 })
    })
});