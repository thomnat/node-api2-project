// implement your posts router here
const express = require("express");

const Post = require("./posts-model");
const router = express.Router();

//POSTS ENDPOINTS

// | 1 | GET    | /api/posts              | Returns **an array of all the post objects** contained in the database
router.get("/", (req, res) => {
  Post.find()
    .then((found) => {
      res.json(found);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({
          message: "The posts information could not be retrieved",
          error: error.message,
          stack: error.stack,
        });
    });
}) |
  // | 2 | GET    | /api/posts/:id          | Returns **the post object with the specified id**                                                                               |
  router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (post) {
          res.json(post);
        } else {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ message: "The post information could not be retrieved" });
      });
  });

// | 3 | POST   | /api/posts              | Creates a post using the information sent inside the request body and returns **the newly created post object**                 |
router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" })
  } else {
    Post.insert({ title, contents })
      .then(({ id }) => {
        return Post.findById(id)
      })
      .then(post => {
        res.status(201).json(post)
      })
      .catch((error) => {
        res
          .status(500)
          .json({
            message: "There was an error while saving the post to the database",
            error: error.message,
            stack: error.stack,
          });
      });
  }
});

// | 4 | PUT    | /api/posts/:id          | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |
router.put("/:id", (req, res) => {
  const {title, contents} = req.body
  if (!title || !contents) {
    res.status(400).json({ message: "Please provide title and contents for the post"})
  } else {
    Post.findById(req.params.id)
      .then( stuff => {
        if (!stuff) {
          res.status(404).json({
            message: "The post with the specified ID does not exist",
          })
        } else {
          return Post.update(req.params.id, req.body)
        }
      })
      .then(data => {
        if (data) {
          return Post.findById(req.params.id)
        }
      })
      .then(post => {
        if (post) {
          res.json(post)
        }
      })
      .catch(err => {
        res.status(500).json({ 
          message: "The posts information could not be retrieved",
          err: err.message,
          stack: err.stack,
        })
      })
  }
});

// | 5 | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**                                                  |

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist" })
  } else {
    await Post.remove(req.params.id)
    res.json(post)
  } 
} catch(err) {
  res.status(500).json({
    message: "The post could not be removed",
    err: err.message,
    stack: err.stack,
  })
}
})

// | 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id

router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      })
    } else {
      const comments = await Post.findPostComments(req.params.id)
      res.json(comments)
    }
  } catch (err) {
    res.status(500).json({
      message: "The comments information could not be retrieved",
      err: err.message,
      stack: err.stack,
    })
  }
});

module.exports = router;
