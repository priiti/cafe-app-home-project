const request = require('supertest');

describe('Loading server..', () => {
    let server;

    beforeEach(() => {
        server = require('./../index');
    });

    afterEach(() => {
        server.close();
    });

    it('responds to route /', done => {
        request(server)
            .get('/')
            .expect(200)
            .expect(/Avaleht/, done);
    });

    it('responds to route /cafes', done => {
        request(server)
            .get('/cafes')
            .expect(200)
            .expect(/Kohvikud/, done);  
    });

    it('404 to non- existing route', done => {
        request(server)
            .get('/random/route')
            .expect(404, done);
    });
});