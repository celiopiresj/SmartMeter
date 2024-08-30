"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
const errors_1 = require("../errors");
const server_1 = require("@google/generative-ai/server");
const generative_ai_1 = require("@google/generative-ai");
const geminiApiKey = process.env.GEMINI_API_KEY;
const fileManager = new server_1.GoogleAIFileManager(geminiApiKey);
const genAI = new generative_ai_1.GoogleGenerativeAI(geminiApiKey);
function getMimeType(format) {
    const mimeTypes = {
        png: "image/png",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        webp: "image/webp",
        heic: "image/heic",
        heif: "image/heif",
    };
    return mimeTypes[format.toLowerCase()] || null;
}
function uploadFile(imagePath, format) {
    return __awaiter(this, void 0, void 0, function* () {
        const mimeType = getMimeType(format);
        if (!mimeType) {
            throw new errors_1.IncorrectRequest(`Formato de imagem inválido: ${format}`, "INVALID_DATA");
        }
        const uploadResponse = yield fileManager.uploadFile(imagePath, {
            mimeType: mimeType,
        });
        const modelPro = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
        });
        const modelFlash = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });
        let result = null;
        try {
            result = yield modelPro.generateContent([
                {
                    fileData: {
                        mimeType: uploadResponse.file.mimeType,
                        fileUri: uploadResponse.file.uri,
                    },
                },
                { text: "perform an accurate reading of the water meter or gas meter and return only the integer numeric value, excluding any additional text." },
            ]);
        }
        catch (error) {
            result = yield modelFlash.generateContent([
                {
                    fileData: {
                        mimeType: uploadResponse.file.mimeType,
                        fileUri: uploadResponse.file.uri,
                    },
                },
                { text: "perform an accurate reading of the water meter or gas meter and return only the integer numeric value, excluding any additional text." },
            ]);
        }
        const response = {
            image_url: uploadResponse.file.uri,
            measure_value: String(result.response.text()).trim(),
        };
        return response;
    });
}
