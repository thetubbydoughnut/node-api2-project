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



module.exports = router