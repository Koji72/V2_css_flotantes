"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureStorage = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
class SecureStorage {
    constructor() {
        // En producción, debería usar import.meta.env.VITE_ENCRYPTION_KEY para Vite
        // O window.ENV_VARIABLES o una estrategia similar que funcione en el navegador
        this.key = 'default-key-change-in-production';
    }
    static getInstance() {
        if (!SecureStorage.instance) {
            SecureStorage.instance = new SecureStorage();
        }
        return SecureStorage.instance;
    }
    encrypt(data) {
        try {
            return crypto_js_1.default.AES.encrypt(data, this.key).toString();
        }
        catch (error) {
            console.error('Error encrypting data:', error);
            return data;
        }
    }
    decrypt(data) {
        try {
            const bytes = crypto_js_1.default.AES.decrypt(data, this.key);
            return bytes.toString(crypto_js_1.default.enc.Utf8);
        }
        catch (error) {
            console.error('Error decrypting data:', error);
            return data;
        }
    }
    get(key) {
        try {
            const encrypted = localStorage.getItem(key);
            return encrypted ? this.decrypt(encrypted) : null;
        }
        catch (error) {
            console.error('Error getting item from secure storage:', error);
            return null;
        }
    }
    set(key, value) {
        try {
            const encrypted = this.encrypt(value);
            localStorage.setItem(key, encrypted);
        }
        catch (error) {
            console.error('Error setting item in secure storage:', error);
        }
    }
    remove(key) {
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error('Error removing item from secure storage:', error);
        }
    }
    clear() {
        try {
            localStorage.clear();
        }
        catch (error) {
            console.error('Error clearing secure storage:', error);
        }
    }
}
exports.SecureStorage = SecureStorage;
