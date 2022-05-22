const Blog = require('../models/blog')
const User = require('../models/user')
const _ = require('lodash')

const initialBlogs = [
    {
        "author": "First author",
        "title": "First Blog ",
        "url": "www.firstblog.com",
        "likes": "50"
    },
    {
        "author": "Second author",
        "title": "Second Blog",
        "url": "www.secondblog.com",
        "likes": "100"
    }
]

const initialUsers = [
    {
        "username": "User1",
        "name": "Name User1"
    },
    {
        "username": "User2",
        "name": "Name User2"
    }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    let likes = 0
  
    for ( let i = 0; i < blogs.length; i++ ) {
        likes += blogs[i].likes
    };
  
    return likes
};
  
const favoriteBlog = (blogs) => {
    let majorLikes = 0
    let favSite = ""
  
    for ( let i = 0; i < blogs.length; i++ ) {
  
      if (blogs[i].likes > majorLikes) {
        majorLikes = blogs[i].likes
        favSite = blogs[i]
      };
  
    };

    return favSite
}
  

const mostBlogs = (blogs) => {
    const blogAuthors = _.groupBy(blogs, "author")
  const reorderedList = _.orderBy(blogAuthors, _.size)
    _.reverse(reorderedList)

  const topAuthor = {
    author: reorderedList[0][0].author,
    blogs: reorderedList[0].length
  }

  return topAuthor
}


const mostLikes = (blogs) => {

    const blogAuthors = _.groupBy(blogs, "author")
    const likeMapped = _.mapValues(blogAuthors , (like) => {
        const sumLike = _.sumBy(like, "likes")
      return sumLike
    })
   
    const orderedList = Object.keys(likeMapped).sort((first, second) => likeMapped[second] - likeMapped[first])
    const authorName = orderedList.slice(0,1)
  

    return {
      author: authorName[0],
      likes: likeMapped[authorName]
    }
}


module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDb, 
    usersInDb,
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}