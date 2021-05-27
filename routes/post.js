const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const Post = require("../models/post");
const { upload } = require("../filehelper");

//@access Private
//@ route /api/post
//@desc upload video and post them in Post model
router.post("/", auth, upload.array("files"), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    let fileArrays = [];
    req.files.forEach((element) => {
      const file = {
        fileName: element.originalname,
        filePath: element.path,
        fileType: element.mimetype,
      };
      fileArrays.push(file);
    });
    const newPost = new Post({
      text: req.body.post,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
      files: fileArrays,
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@access Private
//@desc get all posts
//@route /api/post
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@access Private
//@desc get a post for a particular user id
//@route /api/post/:id

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@access Private
//@desc delete a post for a particular user id
//@route /api/post/:id

router.delete('/:id',async(req,res)=>{
  try{
    await Post.findByIdAndDelete(req.params.id)
    res.json({msg:"Deleted Succesfully"})
  }catch(err){
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
})

//@route /api/post/like/:id
//@desc put likes array
//@access Private

router.put("/like/:id",auth,async(req,res)=>{
  try{
    const post =await Post.findById(req.params.id)
    //check if post is already liked 
    if(post.likes.filter(like => like.user.toString()===req.user.id).length>0){
      return res.status(400).json({msg:"User is already liked"})
    }
      post.likes.unshift({user:req.user.id})
    await post.save()
    res.json(post.likes)

   
  }catch(err){
    console.error(err.message)
    res.status(500).json({msg:"Server Error"})
  }
})

//@route /api/post/dislike/:id
//@desc dislike a post 
//@access Private 

router.put("/dislike/:id",auth,async(req,res)=>{
  try{
    const post=await Post.findById(req.params.id)
    //check if the user has been liked the post
    if(post.likes.filter(like => like.user.toString()==req.user.id).length===0){
      return res.status(400).json({msg:"Post has not been yet liked"})
    }
    const removeIndex=post.likes.map(like => like.user.toString()).indexOf(req.user.id)
    post.likes.splice(removeIndex,1)
    await post.save()
    res.json(post.likes)

  }catch(err){
    console.error(err)
    res.status(500).json({msg:"Server Error"})
  }
})

//@route /api/post/comemnt/:id 
//@desc post a comment in a particular post 
//@access Private
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post=await Post.findById(req.params.id)
    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    }
    post.comments.unshift(newComment)
    await post.save()
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@route /api/post/comment/:id 
//@desc delete a comment in a particular post 
//@access Private

router.delete("/comment/:id/:comment_id",auth,async(req,res)=>{
  try{
    const post=await Post.findById(req.params.id)
    const comment=post.comments.find(comment => comment.id===req.params.comment_id)
    if (!comment){
      return res.status(404).json({msg:"comment does not exist"})
    }
    if(comment.user.toString()!==req.user.id){
      return res.status(400).json({msg:"an authorized"})
    }
    const removeIndex=post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
    post.comments.splice(removeIndex,1)
    await post.save()
    res.json(post.comments)

  }catch(err){
    console.error(err.message)
    res.status(500).json({msg:"Server Error"})
  }
})

//@access Private 
//@desc write a reports in  a particular post
//@/api/post/reports
router.post("/reports/:id",async(req,res)=>{
  try{
    const post= await Post.findById(req.params.id)
    const user = await User.findById(req.user.id).select("-password");
    if(post.reports.filter(report => report.user.toString()===req.user.id).length>0){
      return res.status(400).json({msg:"User is already Report"})
    }
    const newReport = {
      text:req.body,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    }
    post.reports.unshift(newReport)
    await post.save()
    res.json(post.reports)
  }catch(err){
    console.error(err.messsage)
    res.status(500).json({msg:"Server Error"})
  }
})



module.exports = router;
