const { ObjectId } = require('mongoose').Types;
const { User, Thought} = require('../models');


module.exports = {

    getThoughts(req, res) {
        Thought.find()
          .then(async (thought) => {
            const thoughtObj = {
              thought
            };
            return res.json(thoughtObj);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });
      },
      // Get a single user
      getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
          .select('-__v')
          .then(async (thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with that ID' })
              : res.json({
                  thought
                })
          )
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });
      },
    
      // create a new user
      createThought(req, res) {
        Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'thought created, but found no user with that ID'
            })
          : res.json({user})
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
      },
    
      updateThought(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body},
          {runValidators: true, new: true }
          )
          .then((thought) => 
            !thought
              ? res.status(404).json({ message: "no thought found" })
              : res.json(thought)
            )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          })
      },
    
      // Delete a student and remove them from the course
      deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No such thought exists' })
              : User.findOneAndUpdate(
                  { users: req.params.userId },
                  { $pull: { user: req.params.thoughtId } },
                  { new: true }
                )
          )
          .then(() => res.json({ message: 'deleted!' }))
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
      createReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
        )
          .then((reaction) =>
            !reaction
              ? res.status(404).json({ message: 'No thought found with that ID :(' })
              : res.json(reaction)
          )
          .catch((err) => res.status(500).json(err));
      },
      // Remove assignment from a student
      deleteReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res
                  .status(404)
                  .json({ message: 'No thought found with that ID :(' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },
};
