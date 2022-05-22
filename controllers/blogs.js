const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor}  = require('../utils/middleware')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1})
    res.status(200).json(blogs)
})
  
blogRouter.post('/', userExtractor, async (req, res) => {   
    const decodedToken = jwt.verify(req.token, config.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    const body = req.body
    const user = req.user

    if (body.title === undefined && body.url === undefined) {
        res.status(400).end()
    } else {

        if (body.likes === undefined) {
            body.likes = 0
        }
    
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        res.status(201).json(savedBlog)

    }
})

blogRouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if (blog) {
        res.status(200).json(blog)
    } else {
        res.status(404).end()
  }
})

blogRouter.delete('/:id', userExtractor, async (req, res) => {
    const decodedToken = jwt.verify(req.token, config.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = req.user
    
    const blog = await Blog.findById(req.params.id);

    if ( !blog ) {
        return res.status(401).json( {error: "This blog doesn't exist"})
    }
    
    if ( user._id.toString() !== blog.user.toString() ) {
        return res.status(403).json( {error: "You can't delete this blog, since you are not the creator." })
    }else {
        await Blog.findByIdAndRemove(req.params.id)
        res.status(204).end()
    }
})

blogRouter.put('/:id', async (req, res) => {
    const body = req.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new : true})
    res.status(200).json(updatedBlog)
})  

module.exports = blogRouter