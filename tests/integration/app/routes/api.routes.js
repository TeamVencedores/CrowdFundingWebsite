const superRequest = require('supertest');

describe('Api routes tests', () => {
    const connectionString = 'mongodb://localhost/crowdfunding-db-test';
    let app = null;


    beforeEach(() => {
        return Promise.resolve()
            .then(() => require('../../../../db').init(connectionString))
            .then((db) => require('../../../../data').init(db))
            .then((data) => require('../../../../app').init(data))
            .then((_app) => {
                app = _app;
            });
    });

    describe('GET routes', () => {
        // it('expect /projects/search to return 200', (done) => {
        //     const searchValue = 'a';

        //     superRequest(app)
        //         .get('/api/projects/search', )
        //         .expect(200)
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             }
        //             return done();
        //         });
        // });
    });

    describe('POST routes', () => {

    });
});
