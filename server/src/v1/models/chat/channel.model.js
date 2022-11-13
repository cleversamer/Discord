const { Schema, model, Types } = require("mongoose");

const CLIENT_SCHEMA = ["_id", "name", "createdAt"];

const SUPPORTED_TYPES = ["text", "voice"];

const channelSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "voice"],
      default: "text",
    },
    pinnedMessages: [
      {
        type: Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const Channel = model("Channel", channelSchema);

module.exports = {
  Channel,
  CLIENT_SCHEMA,
  SUPPORTED_TYPES,
};
