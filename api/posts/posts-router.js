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

router.post('/', (req, res) => {
    Post.insert(req.body)
    .then(posty => {
        res.status(201).json(posty)
    })
    .catch(err => {
        console.error(err)
        res.status(500).json({ message: "There was an error while saving the post to the database" })
    })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;

    if (!title || !contents) {
        return res.status(400).json({ message: "Please provide title and contents for the post" })
    }
    Post.update(id, { title, contents })
    .then(updatedPost => {
        if (!updatedPost) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            res.status(200).json(updatedPost)
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "The post information could not be modified" })
    })
})

router.delete('/:id', (req, res) => {
    Post.remove(req.params.id)
    .then(deletedPost => {
        if (!deletedPost) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } 
        else {
            res.status(200).send()
        }
    })
    .catch(err => {
        console.error(err)
        res.status(500).json({ message: "The post could not be removed" })
    })
})



module.exports = router