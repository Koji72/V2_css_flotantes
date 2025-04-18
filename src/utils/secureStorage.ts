import CryptoJS from 'crypto-js';

export class SecureStorage {
  private static instance: SecureStorage;
  private key: string;

  private constructor() {
    // En producción, debería usar import.meta.env.VITE_ENCRYPTION_KEY para Vite
    // O window.ENV_VARIABLES o una estrategia similar que funcione en el navegador
    this.key = 'default-key-change-in-production';
  }

  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  private encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.key).toString();
    } catch (error) {
      console.error('Error encrypting data:', error);
      return data;
    }
  }

  private decrypt(data: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return data;
    }
  }

  public get(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(key);
      return encrypted ? this.decrypt(encrypted) : null;
    } catch (error) {
      console.error('Error getting item from secure storage:', error);
      return null;
    }
  }

  public set(key: string, value: string): void {
    try {
      const encrypted = this.encrypt(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error setting item in secure storage:', error);
    }
  }

  public remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from secure storage:', error);
    }
  }

  public clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }
} 