import supertest from 'supertest'
import {expect} from 'chai'

describe('Auth', function () {
  // it('Log in', async () => {
  //      const res = await supertest ('https://paysis.herokuapp.com')
  //         .post('/auth')
  //         .send({login:'adminius', password: 'supers3cret'})
  //         expect(res.statusCode).to.eq(400)
  //         expect(res.body.token).not.to.be.undefined
  //     //console.log(res.body.data)
  //     //console.log(Request)
  // })
  //
  // it('Log in with incorrect credentials', async () => {
  //     const res = await supertest('https://paysis.herokuapp.com')
  //         .post('/auth')
  //         .send({login:'invalid', password: 'invalid'})
  //         expect(res.statusCode).to.eq(400)
  //         expect(res.body.message).to.eq('Wrong login or password')
  //         //expect(res.body.message).to.include('Wrong login or passwords')
  //     //console.log(res.body)
  //     //console.log(res.method)
  // })

  it('Log in', done => {
    supertest('https://paysis.herokuapp.com')
      .post('/auth')
      .send({login: 'adminius', password: 'supers3cret'})
      .end((err, res) => {
        expect(res.statusCode).to.eq(400)
        expect(res.body.token).to.be.undefined
        done()

        // if (err) {
        //     return done(err);
        // }
        // expect(function(res) {
        //     res.statusCode = 500;
        //     res.body.token = 'undefined'
        // })
        // return done();
      })
  })
})
