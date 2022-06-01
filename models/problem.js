const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    problemName: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    tags:{
        type: Array,
        required: true,
    },
    userDefinedTags: [
        {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "user"
            },
            tags: {
                type: Array,
                required: true,
            }
        }
    ]
});

module.exports = mongoose.model('problem', ProblemSchema);