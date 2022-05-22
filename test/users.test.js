const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const { beforeEach, test, describe, expect } = require("@jest/globals")

describe('User error messages', () => {
    test('If a username is already taken, it will return an error message and the status code 400', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'newUsername',
            name: 'newName',
            password: 'newPassword',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('This username is already taken, the username must be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('If username or password is shorter than 3 characters, it will return an error message and the status code 400', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUserBadUsername = {
            username: 'us',
            name: 'newName',
            password: 'newPassword',
        }

        const resultUsername = await api
        .post('/api/users')
        .send(newUserBadUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(resultUsername.body.error).toContain('The username must be at least 3 characters long')

        const newUserBadPassword = {
            username: 'newUsername',
            name: 'newName',
            password: 'pa',
        }

        const resultPassword = await api
        .post('/api/users')
        .send(newUserBadPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(resultPassword.body.error).toContain('The password must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('If the username or the password is missing, it will return an error message and the status code 400', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUserWithoutUsername = {
            name: 'newName',
            password: 'newPassword',
        }

        const resultUsername = await api
        .post('/api/users')
        .send(newUserWithoutUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(resultUsername.body.error).toContain('An user must have an username.')

        const newUserWithoutPassword = {
            username: 'rooot',
            name: 'root user',
        }

        const resultPassword = await api
        .post('/api/users')
        .send(newUserWithoutPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(resultPassword.body.error).toContain('An user must have a password')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })
})