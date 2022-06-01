const UserDefinedTag = require("../models/userDefinedTag");
const Tag = require("../models/tag");
const Problem = require("../models/problem");
const User = require("../models/user");

module.exports.addUserDefinedTag = async (req, res) => {
    const user = res.locals.user;
    const problemId = req.params.problemId;
    const { newTag } = req.body;

    if (newTag === "") {
        res.status(200).send("null tags not accepted");
    } else {

        try {
            let foundGlobalTag = await Tag.findOne({ tag: newTag });

            let updateUserTags = null;

            if (!foundGlobalTag) {
                updateUserTags = await User.findByIdAndUpdate(
                    user._id,
                    {
                        $addToSet: {
                            tags: newTag,
                        },
                    }
                );
            }

            let problemAllTags = await Problem.findById(problemId, { _id: 0, tags: 1 }); // only want tags

            let updateProblem = null;

            // if user is already found
            updateProblem = await Problem.findOneAndUpdate(
                {
                    _id: problemId,
                    "userDefinedTags.user_id": { $eq: user._id }
                }, {
                $addToSet: {
                    "userDefinedTags.$.tags": newTag,
                },
            }
            );

            //if user not found
            if (updateProblem === null) {
                updateProblem = await Problem.findByIdAndUpdate(problemId,
                    {
                        $push: {
                            userDefinedTags: {
                                user_id: user._id,
                                tags: [newTag, ...problemAllTags.tags],
                            },
                        },
                    },
                    { _id: 0, userDefinedTags: 1 }
                );
            }

            // updateProblem = await Problem.findOne(
            //     { _id: problemId, "userDefinedTags.user_id": { $eq: user._id } },
            //     { _id: 0, userDefinedTags: 1 }
            // );
            res.redirect("/userDefinedTags/" + problemId);
            // res.status(200).send({ updateUserTags, updateProblem });
        }
        catch (err) {
            res.status(400).send({ err: "Error adding tag." });
        }
    }
}

module.exports.getAllTags = async (req, res) => {
    const user = res.locals.user;
    // const offet = res.params.offet;
    try {
        // const authorTags = await Tag.find({ type: 'author' }, { _id: 0, tag: 1, }).limit(7).skip((offset - 1)*10);
        const authorTags = await Tag.find({ type: 'author' }, { _id: 0, tag: 1, }).limit(7).skip(10);
        const actualTags = await Tag.find({ type: 'actual_tag' }, { _id: 0, tag: 1 }).limit(7).skip(10);

        let userDefinedTags;
        if (user === undefined) {
            userDefinedTags = null;
        } else {
            const data = await User.findById({ _id: user._id }, { _id: 0, tags: 1 });
            if (data) {
                userDefinedTags = data.tags;
            }
        }
        // res.send({authorTags: authorTags, actualTags: actualTags});
        res.render("home.ejs", { authorTags, actualTags, userDefinedTags })
    } catch (err) {
        res.status(500).send({ err: "Server error" });
        console.log(err)
    }
};

module.exports.getUserDefinedTags = async (req, res) => {
    const randomTagcolor = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
    const user = res.locals.user;
    // console.log(user);
    const problemId = req.params.problemId;
    try {
        const problem = await Problem.findById(problemId);
        let tags = problem.tags;
        let userDefinedTags = problem.userDefinedTags;
        // "userDefinedTags.user_id": { $eq: user._id }});

        const userFound = userDefinedTags.find(obj =>
            JSON.stringify(obj.user_id) === JSON.stringify(user._id)
        );

        let userTags;

        if (userFound === undefined) {
            userTags = null;
        } else {
            userTags = userFound.tags;
            userTags = userTags.filter(item => !tags.includes(item));
        }

        res.render("aproblem.ejs", { problem, tags, userTags, randomTagcolor })
        // res.send({problem: problem, tags: tags, userdefinedtags: userDefinedTags});
    } catch (err) {
        res.status(500).send({ err: "Server error" });
        console.log(err)
    }
};

module.exports.searchTags = async (req, res) => {
    const value = req.query.value;
    const data = await Tag.find({
        tag: { $regex: value, $options: "$i" }
    }, { _id: 0, tag: 1 }).limit(5);

    res.send(data);
};