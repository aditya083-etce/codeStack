const Problem = require("../models/problem");
const Tag = require("../models/tag");

module.exports.getAllProblems = async (req, res) => {
    const user = res.locals.user;
    
    // let { author, concept, userDefined } = req.body;

    // if (typeof (author) === "string") {
    //     author = [author];
    // }
    // if (typeof (concept) === "string") {
    //     concept = [concept];
    // }
    // if (typeof (userDefined) === "string") {
    //     userDefined = [userDefined]
    // }

    // if (typeof (author) === "undefined") {
    //     author = []
    // }
    // if (typeof (concept) === "undefined") {
    //     concept = []
    // }
    // if (typeof (userDefined) === "undefined") {
    //     userDefined = []
    // }

    // let tags = [...author, ...concept, ...userDefined]

    let tags = Object.keys(req.body);
    tags.shift();
    
    console.log(tags);

    if (user === undefined) {
        try {
            const problems = await Problem.find({ tags: { $all: tags } }, { userDefinedTags: 0 });
            res.render("allproblem", {data: problems});
        } catch (err) {
            res.status(400).send({ err: "Error fetching problems" });
        }
    } else {
        try {
            const problems = await Problem.find({
                $or: [
                    { tags: { $all: tags } },
                    {
                        $and: [
                            { "userDefinedTags.tags": { $all: tags } },
                            { "userDefinedTags.user_id": { $eq: user._id } },
                        ],
                    },
                ],
            });
            
            res.render("allproblem", {data: problems});
        } catch (err) {
            res.status(500).send({ err: "Error fetching problems" });
        }
    }
};

module.exports.getaddProblem = async (req, res) => {
    res.render("addProblem.ejs")
};

module.exports.addProblem = async (req, res) => {
    let author = res.locals.username;
    let title = res.body.title;
    let content = res.body.content;

    const tags = req.body.tags.split(" ");
    
    const data = await Problem.create({
        author: author,
        problemName: title,
        body: content,
        tags: tags
    });

    const foundTag = await Problem.find({
        tag: author,
        type: "author"
    });

    if(!foundTag.length){
        const newTag = await Tag.create({tag: author, type: "author"})
    }
    res.send(data);
};