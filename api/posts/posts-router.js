// implement your posts router here
const express = require('express')
const Post = require('./posts-model')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const postsById = await Post.findById(id);
        if (!postsById) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        else {
            res.status(200).json(postsById)
        }
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "The post information could not be retrieved" })
    }
});

router.post('/', async (req, res) => {
    const { title, contents } = req.body

    if (!title || !contents) {
        return res.status(400).json(
            { message: "Please provide title and contents for the post" })
    }

    try {
        const { id } = await Post.insert({ title, contents })
        const post = await Post.findById(id)
        res.status(201).json(post)
    } catch (err) {
        console.error(err)
        res.status(500).json(
            { message: "There was an error while saving the post to the database" }
        )
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;

    if (!title || !contents) {
        return res.status(400).json({ message: "Please provide title and contents for the post" })
    }
    try {
        const updatedPost = await Post.update(id, { title, contents })
        if (!updatedPost) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const updatedPostData = await Post.findById(id)
            res.status(200).json(updatedPostData)
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "The post information could not be modified" })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findById(req.params.id)
        if (!deletedPost) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } 
        else {
            await Post.remove(req.params.id)
            res.status(200).json(deletedPost)
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "The post could not be removed" })
    }
})

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params

    try {
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        else {
            const comments = await Post.findPostComments(id)
            res.status(200).json(comments)
        }
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})

module.exports = router