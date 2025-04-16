import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class PasswordCryptService {

  private encryptionKey = environment.ENCRYPT_KEY;

  constructor() {
    // empty constructor

  }


  async encryptPassword(password: string): Promise<string> {

    const keyBytes = new TextEncoder().encode(this.encryptionKey);
    const key = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      "AES-GCM",
      false,
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      encoder.encode(password)
    );

    const encryptedArray = new Uint8Array(encrypted);
    const resultArray = new Uint8Array(iv.length + encryptedArray.length);
    resultArray.set(iv);
    resultArray.set(encryptedArray, iv.length);
    const encrypted_ = btoa(String.fromCharCode(...resultArray));
    return `PWD_HEX#:${this.getRandomSingleDigit()}:${new Date().getTime()},${encrypted_}`;

  }

  private getRandomSingleDigit(): number {
    return Math.floor(Math.random() * 10);
  }


}
