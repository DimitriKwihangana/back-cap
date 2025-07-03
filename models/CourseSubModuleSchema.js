const mongoose = require("mongoose");




// Schema for legacy files (PDFs, etc.) if you still need them
const FileSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    pdfUrls: [{ type: String, required: true }],
    path: { type: String, required: true },
});

const SubModuleSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    lessons: [
        {
            title: { 
                type: String, 
                required: true 
            },
            description: { 
                type: String, 
                required: true 
            },
            videoUrl: { 
                type: String 
            },
            
            resources: [{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: "File"
            }]
        }
    ]
});

// Create and export the models

const File = mongoose.model("File", FileSchema);
const SubModule = mongoose.model("SubModule", SubModuleSchema);

module.exports = {  File, SubModule };