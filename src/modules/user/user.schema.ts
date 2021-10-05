import { Document, Schema } from 'mongoose';
import { EUserVerificationStatus, IUser } from './user.type';

export type UserDocument = IUser & Document;

export const UserSchema = new Schema<IUser>(
  {
    id: String,
    gender: String,
    firstName: String,
    lastName: String,
    dob: Date,
    registered: Date,
    phone: String,
    email: String,
    password: {
      type: String,
      select: false,
    },
    nat: String,
    verificationStatus: {
      type: String,
      default: EUserVerificationStatus.UNVERIFIED,
    },
  },
  { id: false, versionKey: false },
);
