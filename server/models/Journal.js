"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Journal = void 0;
var mongoose_1 = require("mongoose");
var journalSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
    mood: {
        type: String,
        enum: ['great', 'good', 'neutral', 'bad', 'terrible']
    },
    tags: [{ type: String }],
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.Journal = mongoose_1.default.model('Journal', journalSchema);
