import {User} from  "../models/userSchema.js";

export const users = async () => {
    const users = await User.find();
    return users;
}

export const userById = async (id) => {
    const user = await User.findById(id);
    return user;
}

// exports.createUser = async (payload) => {
//     const newUser = await User.create(payload);
//     return newUser;
// }

// exports.removeUser = async (id) => {
//     const user = await User.findByIdAndRemove(id);
//     return user;
// }