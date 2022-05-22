const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require("./test_helper")

const api = supertest(app)

describe('Blog checks:', () => {
  test('Blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  }, 100000)
  
  test('The identifier is called "id"', async () => {
    const response = await api
    .get('/api/blogs')
    .expect(200)

    expect(response.body[0].id).toBeDefined()
  }, 100000)

})

describe('Posting,deleting and updating requests:', () => {
  test('Adding a new valid blog', async() => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      "author": "newAuthor",
      "title": "newBlogArticle",
      "url": "www.authorblog.com",
      "likes": 45
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${authenticator}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length + 1)

    const authors = blogsAtEnd.map(blog => blog.author)
    expect(authors).toContain("newAuthor")
  }, 100000)

  test('Deleting a blog succeeds with status code 204', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const authors = blogsAtEnd.map(blog => blog.author)
    expect(authors).not.toContain(blogToDelete.body.author)

  }, 100000)

  test('Updating correctly a blog succeeds with status code 204', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate= blogsAtStart[0]
  
    const newBlog = {
        "author": "newAuthor",
        "title": "newBlogArticle",
        "url": "www.authorblog.com",
        "likes": 32
    }
  
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(204)
        .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]
  
    expect(updatedBlog).toEqual(newBlog)
  }, 100000)  

  test('The request to add a blog that does not contain a correct token fails', async() => {
    const users = await helper.usersInDb()

    const newBlog = {
        "author": "newAuthor",
        "title": "newBlogArticle",
        "url": "www.authorblog.com",
        "likes": 24,
        "userId": users[0].id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 100000)
})

describe('Missing field behaviour:', () => {
  test('If there is not the like-field, it will have a default value of 0 likes', async() => {
    const newBlog = {
      "author": "newAuthor",
      "title": "newBlogArticle",
      "url": "www.authorblog.com"
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBeDefined()
    expect(resp.body.likes).toEqual(0)
  }, 100000)

  test('If there is not the title-field or the and url-field, it will return "400 bad request"', async() => {
    const newBlog = {
      "author": "newAutor",
      "likes":34
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  }, 100000)
})

afterAll(() => {
  mongoose.connection.close()
})