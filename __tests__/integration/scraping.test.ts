import request from 'supertest'
import app from './../../src/app'

interface postsInterface {
  id: number,
  content: string,
  ref: string,
  source: string
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toValidatePosts(): R;
    }
  }
}

expect.extend({
  toValidatePosts(received: Array<postsInterface>) {
    received.forEach(post => {
      expect(post).toHaveProperty('id')
      expect(post).toHaveProperty('content')
      expect(post).toHaveProperty('ref')
      expect(post).toHaveProperty('source')
    })

    return {
      message: () => 'all posts have all properties',
      pass: true
    }
  }
})

describe('Scraping information access', () => {
  describe('CRUD routes', () => {
    test('get information to posts', async () => {
      const postsRequest = await request(app)
        .get('/posts')

      console.log(postsRequest.body);
      expect(postsRequest.body.data).toValidatePosts()
    }, 15000)
  })
})