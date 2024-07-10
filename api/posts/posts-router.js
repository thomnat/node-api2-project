// implement your posts router here
const express = require('express');

const Post = require('./posts-model');
const router = express.Router();

//POSTS ENDPOINTS

// | 1 | GET    | /api/posts              | Returns **an array of all the post objects** contained in the database  
router.get('/', (req, res) => {
  Post.find()
    .then(found => {
      res.json(found);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The posts information could not be retrieved",
        error: error.message,
        stack: error.stack,
       });
    })
})

                                                        |
// | 2 | GET    | /api/posts/:id          | Returns **the post object with the specified id**                                                                               |
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'The post with the specified ID does not exist'})
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The post information could not be retrieved"})
    });
});


// | 3 | POST   | /api/posts              | Creates a post using the information sent inside the request body and returns **the newly created post object**                 |
router.post('/', (req, res) => {
  Post.add(req.body)
    .then(post => {
      if (!req.body.title || req.body.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
      } else {
        res.status(201).json(post);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "There was an error while saving the post to the database" })
    });
});



// | 4 | PUT    | /api/posts/:id          | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |
router.put("/:id", (req, res) => {
  const changes = req.body;
  Post.update(req.params.id, changes)
    .then(post => {
      if (!req.params.id) {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      } else {
        if (!req.body.title || !req.body.contents) {
          res.status(400).json({ message: "Please provide title and contents for the post" })
        }
        res.status(200).json(post);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The post information could not be modified" });
    });
  });


// | 5 | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**                                                  |

router.delete("/:id", (req, res) => {
  Post.remove(req.params.id)
    .then(post => {
      if (!req.params.id) {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The post with the specified ID does not exist" });
    });
});




// | 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id       

router.get("/:id/comments", (req, res) => {
  Post.findById(req.params.id)
    .then(comments => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({ message: 'The post with the specified ID does not exist'})
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The comments information could not be retrieved"})
    });
});


module.exports = router;