import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  statusAccepted: {
    type: Boolean,
    default: null,
  },
});

const Connection = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

export default Connection;
