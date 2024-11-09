import mongoose, { Document, Schema } from "mongoose";
export interface UserModelType extends Document{
  username:string;
  password:string;
  online:boolean;
  chats:string[];
}
const UserSchema: Schema = new Schema<UserModelType>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    online:{ type: Boolean, required: false },
    chats: [{type:Schema.ObjectId, ref:'Chat'}],
  },
  {
    toJSON: {
      virtuals: true,
      transform: convertObjectIdToString,
    },
    toObject: { virtuals: true, transform: convertObjectIdToString },
  }
);
function convertObjectIdToString(doc: any, ret: any) {
  if (ret._id) {
    ret._id = ret._id.toString();
    delete ret.__v;
  }
  return ret;
}

export default mongoose.model<UserModelType>("User", UserSchema);
