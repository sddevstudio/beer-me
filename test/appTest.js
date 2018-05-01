const request = require('request');
const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const mw = require('../middleware/middleware');

const base = "http://localhost:3003";

describe('Unit Test - (verify middleware functions)' , () => {
    describe('validateUser' , () => {
        it('returns "true" when passed "stephen@sddev.ca"', () => {
            return assert.equal(mw.validateUser('stephen@sddev.ca'), true);
        });
        it('returns "false" when passed "stephen@sddevca"', () => {
            return assert.equal(mw.validateUser('stephen@sddevca'), false);
        });
        it('returns "false" when passed "stephen.sddev.ca"', () => {
            return assert.equal(mw.validateUser('stephen.sddev.ca'), false);
        });
        it('returns "false" when passed "stephen@@sddev.ca"', () => {
            return assert.equal(mw.validateUser('stephen@@sddev.ca'), false);
        });
    }); 
});

describe('Integration Test - (verify x-user header)', () => {
    describe('* Make sure service is running before running this test',null);
    describe('GET /beer?name=', () => {
        it('should return an error for invalid user', (done) => {
            const options = {
                url:`${base}/beer?name=`,
                method: 'get'
            }
            request.get(options, (err, res, body) => {
                res.statusCode.should.eql(200);
                body = JSON.parse(body);
                body.error.should.eql('Invalid user');
                done();
            });
        });
        
        it('should return an error for missing beer name', (done) => {
            const options = {
                url:`${base}/beer?name=`,
                method: 'get',
                headers:{
                    'x-user':'test@test.ca'
                }
            }
            request.get(options, (err, res, body) => {
                res.statusCode.should.eql(200);
                body = JSON.parse(body);
                body.error.should.eql('missing beer name');
                done();
            });
        });
    });
});