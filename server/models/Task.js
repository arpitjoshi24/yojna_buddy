"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var mongoose_1 = require("mongoose");
var taskSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    projectId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Project' },
    category: {
        type: String,
        enum: ['project', 'school', 'personal', 'other'],
        required: true
    },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.Task = mongoose_1.default.model('Task', taskSchema);
