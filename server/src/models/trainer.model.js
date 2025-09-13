import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    type_Of_Trainer: {
      type: String,
      enum: ["technical", "softskill", "aptitude", "labassistant"],
    },
    assigned_Batches: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Batch",
        },
      ],
      default: [],
    },
    specialization: String,
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

trainerSchema.virtual('assessmentTaken',{
  ref : 'Assessment',
  localField : '_id',
  foreignField : 'createdBy'
});

trainerSchema.virtual('assignedBatches',{
  ref : 'Batch',
  localField : '_id',
  foreignField : ''
})

trainerSchema.set('toJSON',{virtuals : true});
trainerSchema.set('toObject',{virtuals : true});

export default mongoose.model("Trainer", trainerSchema);
