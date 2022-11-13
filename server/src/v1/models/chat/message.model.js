const { Schema, model, Types } = require("mongoose");

const CLIENT_SCHEMA = [
  "_id",
  "sender",
  "receiver",
  "date",
  "type",
  "text",
  "voiceURL",
  "file",
];

const SUPPORTED_TYPES = ["text", "voice", "file"];

const messageSchema = new Schema(
  {
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Types.ObjectId,
      required: true,
    },
    date: {
      type: String,
      default: new Date(),
    },
    type: {
      type: String,
      enum: SUPPORTED_TYPES,
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    voiceURL: {
      type: String,
      default: "",
      trim: true,
    },
    file: {
      displayName: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
  },
  {
    minimize: false,
  }
);

const Channel = model("Channel", messageSchema);

module.exports = {
  Channel,
  CLIENT_SCHEMA,
  SUPPORTED_TYPES,
};
