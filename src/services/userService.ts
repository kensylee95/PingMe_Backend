import User, { UserModelType } from "@models/User"
//fetch user by id
export const getUserById = async (userId:string)=>{
    const user = await User.findById(userId).select("-password");
    return user;
}
//fetch user by username
export const getUserByUsername:(username:string)=>Promise<UserModelType> = async (username:string)=>{
    return await User.findOne({username}).select("-password -chats"); 
}

//add a chat ID to a user's chat list
export const addUserChat = async (userId: string, chatId:string)=>{
    return await User.findByIdAndUpdate(userId, {$push:{chats:chatId}});
}

//list all friends for a user
export const getUserFriends = async(userId:string)=>{
    return await User.findById(userId).populate("friends","username");
}

//search users by username
export const searchUsersByUsername = async (searchTerm: string)=>{
    return await User.find({
        username: {$regex:searchTerm, $options: "i"}
    })
}

