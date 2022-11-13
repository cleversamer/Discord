const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const CLIENT_SCHEMA = [
  "_id",
  "photoURL",
  "status",
  "name",
  "channels",
  "members",
  "createdAt",
];

const SUPPORTED_ROLES = ["user", "admin"];

const serverSchema = new Schema(
  {
    photoURL: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["private", "public"],
      default: "public",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      default: "",
    },
    channels: {
      type: Array,
      default: [],
    },
    members: {
      type: Array,
      default: [],
    },
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
  SUPPORTED_ROLES,
};
