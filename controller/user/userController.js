const USER = require("../../model/userModel");
const POST =require("../../model/postModel");
const error = require("../../utils/error");

exports.editProfile = async (req, res) => {
  try {
    const arrayOfEditKeys = ["bio","gender","birthday","photo",];
    const objectUpdate = {};
    for (const key of arrayOfEditKeys) {
        if (req.body[key] != null) {
            objectUpdate[key] = req.body[key];
        }
    }
    const update = await USER.findOneAndUpdate({ _id: req.user._id }, objectUpdate  , { new: true });
    if(update){
        return res.status(error.status.OK).send({
            message: "Profile Update Successfully.",
            status: error.status.OK,
          });
    }
} catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};


exports.getMyProfile = async (req, res) => {
  try {
    const get = await USER.findOne({ _id: req.user._id });
    if(get){
        return res.status(error.status.OK).send({
            message: "Profile get Successfully.",
            status: error.status.OK,
            Data:get
          });
    }
} catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

// exports.updateAccountType = async (req, res) => {
//   try {
//     const get = await USER.findOne({ _id: req.user._id });
//     if(get){
//        if(get.accountType==='public'){
//       const update=await USER.updateOne({ _id: req.user._id },{accountType:'private'})
//       if(update){
//         return res.status(error.status.OK).send({
//             message:  "Your Profile Is Private",
//             status: error.status.OK,
//             Data:get
//           });
//         }
//     }
//     else{
//       const update=await USER.updateOne({ _id: req.user._id },{accountType:'public'})
//       if(update){
//       return res.status(error.status.OK).send({
//           message: "Your Profile Is Public",
//           status: error.status.OK,
//           Data:get
//         });
//       }
//     }
//   }
// } catch (e) {
//     return res.status(error.status.InternalServerError).json({
//       message: e.message,
//       status: error.status.InternalServerError,
//     });
//   }
// };



exports.addPost = async (req, res) => {
  try {
    const { content, media_url} = req.body;
    const find = await USER.findOne({ _id: req.user._id });
    if (find) {
      const refData = {
        user_id:find._id,
        content: content,
        media_url: media_url,
      }
    const create = await POST.create(refData);
    if (create) {
      return res.status(error.status.OK).send({
        message: "Post Add Successfully",
        status: error.status.OK,
        data: create, 
      });
    }
    return res.status(error.status.BadRequest).send({
      message: "Unable To Add Post",
      status: error.status.BadRequest,
    });
  }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.editPost = async (req, res) => {
  try {
    const arrayOfEditKeys = ["media_url","content"];
    const objectUpdate = {};
    for (const key of arrayOfEditKeys) {
        if (req.body[key] != null) {
            objectUpdate[key] = req.body[key];
        }
    }
    const find =await USER.findOne({ _id: req.user._id })
    if(find){
    const update = await POST.findOneAndUpdate({ _id: req.params.postID }, objectUpdate, { new: true });
    if(update){
        return res.status(error.status.OK).send({
            message: "Post Update Successfully.",
            status: error.status.OK,
            data:update
          });
    }
  }
    return res.status(error.status.BadRequest).send({
      message: "Unable To edit Post",
      status: error.status.BadRequest,
    });
} catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};


exports.viewMyPost = async (req, res) => {
  try {
    const get = await POST.findOne({ _id: req.params.postID });
    if(get){
        return res.status(error.status.OK).send({
            message: "Profile get Successfully.",
            status: error.status.OK,
            Data:get
          });
    }
} catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.deleteMyPost = async (req, res) => {
  try {
    const find = await POST.findOne({ _id: req.params.postID });
    if(find){
      const deletePost = await POST.deleteOne({ _id: req.params.postID });
      if(deletePost){
        return res.status(error.status.OK).send({
            message: "Post Delete Successfully.",
            status: error.status.OK,
          });
        }
        return res.status(error.status.BadRequest).send({
          message: "unable To Delete Post",
          status: error.status.BadRequest,
        });
    }
} catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.addFollowing = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const currentUser = await USER.findById(req.user._id);
    const userToFollow = await USER.findById(userIdToFollow);

    if (!userToFollow) {
      return res.status(error.status.NotFound).json({
        message: "User to follow not found",
        status: error.status.NotFound,
      });
    }
    if(currentUser._id ==userIdToFollow) {
      return res.status(error.status.BadRequest).json({
        message: "Cannot follow yourself",
        status: error.status.BadRequest,
      });
    }
    if (currentUser.followings.includes(userIdToFollow)) {
      return res.status(error.status.BadRequest).json({
        message: "You are already following this user",
        status: error.status.BadRequest,
      });
    }
    currentUser.followings.push(userIdToFollow);
    await currentUser.save();
    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    return res.status(error.status.OK).json({
      message: "Now following user",
      status: error.status.OK,
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }   
};
    





















// Inside your user schema, add a field to store followers
// const userSchema = new mongoose.Schema(
//   {
//     // Existing fields...
//     followers: {
//       type: [mongoose.Schema.Types.ObjectId],
//       ref: 'user',
//       default: [],
//     },
//     // Other fields...
//   },
//   { timestamps: true }
// );

// // Add Following API
// exports.addFollowing = async (req, res) => {
//   try {
//     const { userIdToFollow } = req.body;
//     const currentUser = await USER.findById(req.user._id);
//     const userToFollow = await USER.findById(userIdToFollow);

//     if (!userToFollow) {
//       return res.status(error.status.NotFound).json({
//         message: "User to follow not found",
//         status: error.status.NotFound,
//       });
//     }

//     if (currentUser._id.equals(userToFollow._id)) {
//       return res.status(error.status.BadRequest).json({
//         message: "Cannot follow yourself",
//         status: error.status.BadRequest,
//       });
//     }

//     // Check if the user is already following
//     if (currentUser.followings.includes(userIdToFollow)) {
//       return res.status(error.status.BadRequest).json({
//         message: "You are already following this user",
//         status: error.status.BadRequest,
//       });
//     }

//     // Add the user to follow to the current user's followings
//     currentUser.followings.push(userIdToFollow);
//     await currentUser.save();

//     // Add the current user to the user to follow's followers
//     userToFollow.followers.push(currentUser._id);
//     await userToFollow.save();

//     return res.status(error.status.OK).json({
//       message: "Now following user",
//       status: error.status.OK,
//     });
//   } catch (e) {
//     return res.status(error.status.InternalServerError).json({
//       message: e.message,
//       status: error.status.InternalServerError,
//     });
//   }
// };

// // Get Followers API
// exports.getFollowers = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const user = await USER.findById(userId).populate('followers', 'username');

//     if (!user) {
//       return res.status(error.status.NotFound).json({
//         message: "User not found",
//         status: error.status.NotFound,
//       });
//     }

//     return res.status(error.status.OK).json({
//       message: "Followers retrieved successfully",
//       status: error.status.OK,
//       followers: user.followers,
//     });
//   } catch (e) {
//     return res.status(error.status.InternalServerError).json({
//       message: e.message,
//       status: error.status.InternalServerError,
//     });
//   }
// };
