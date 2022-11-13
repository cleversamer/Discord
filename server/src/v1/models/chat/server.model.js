const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcrypt");

const CLIENT_SCHEMA = [
  "_id",
  "photoURL",
  "status",
  "name",
  "author",
  "channels",
  "members",
  "createdAt",
];

const serverSchema = new Schema(
  {
    photoURL: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["private", "public"],
      default: "public",
      required: true,
      trim: true,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      default: "",
      trim: true,
    },
    channels: [
      {
        type: Types.ObjectId,
        ref: "Channel",
      },
    ],
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    minimize: false,
    timestamps: true,
  }
);

serverSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

serverSchema.methods.updatePassword = async function (newPassword) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);
  this.password = hashed;
};

const Server = model("Server", serverSchema);

module.exports = {
  Server,
  CLIENT_SCHEMA,
};
