const listHelper = require('./test_helper')

const listWithNoBlogs = []

const listWithOneBlog = [
  {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Title1',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.title1.com/',
      likes: 5,
      __v: 0
    }  
  ]  
    
const listWithManyBlogs = [
  {
      _id: "5a422a851b54a676234d17f7",
      title: "Title3",
      author: "Michael Chan",
      url: "https://www.title3.com/",
      likes: 7,
      __v: 0
  },
  {
      _id: "5a422aa71b54a676234d17f8",
      title: "Title2",
      author: "Edsger W. Dijkstra",
      url: "http://www.title2.com/",
      likes: 5,
      __v: 0
  },
  {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Title1",
      author: "Edsger W. Dijkstra",
      url: "http://www.title1.com/",
      likes: 12,
      __v: 0
  },
  {
      _id: "5a422b891b54a676234d17fa",
      title: "Title5",
      author: "Robert C. Martin",
      url: "http://www.title5.com/",
      likes: 10,
      __v: 0
  },
  {
      _id: "5a422ba71b54a676234d17fb",
      title: "Title6",
      author: "Robert C. Martin",
      url: "http://www.title6.com/",
      likes: 0,
      __v: 0
  },
  {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
  }
]

describe('Dummy test', () => {
  test('Dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('Total likes', () => {    
  test('When list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('When list hasn not any blogs, equals zero', () => {
    const result = listHelper.totalLikes(listWithNoBlogs)
    expect(result).toBe(0)
  })

  test('When list has a lot of blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })
})

describe('Favorite blog', () => {
  test('When list has a lot of blogs, it returns the most liked one', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)

    const answer = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Title1",
      author: "Edsger W. Dijkstra",
      url: "http://www.title1.com/",
      likes: 12,
      __v: 0
     }

      expect(result).toEqual(answer)
  })
})

describe('Most blogs', () => {
  test('Returns the author who has the largest amount of blogs', () => {

    const result = listHelper.mostBlogs(listWithManyBlogs)

    
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3
  })
  })
})
  
describe('Most likes', () => {
  test('Returns the author with the blog with the largest amount of likes', () => {
    const result = listHelper.mostLikes(listWithManyBlogs)

    const answer = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    
    expect(result).toEqual(answer)
  })
})
  
