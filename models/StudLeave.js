const mongoose = require("mongoose")


const StudLeaves_schema = mongoose.Schema(
    {
        "name": { type: String, required: true },
        "batch": { type: String, required: true },
        "rollno": { type: String, required: true },
        "Sdate": { type: String, required: true },
        "Edate": { type: String, required: true },
        "Tdate": { type: String, required: true },
        "reasonforleave": { type: String, required: true }
    }
)
let StudLeavesModel = mongoose.model("Stud_leaves", StudLeaves_schema)
module.exports = { StudLeavesModel }
