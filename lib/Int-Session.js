/*import { fileURLToPath } from 'url'
import path from 'path'
const { writeFileSync } = require('fs')
const { BufferJSON } = require('@whiskeysockets/baileys')
const { File } = require('megajs')

async function myrSave(txt) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}
  const Ameen = txt.replace('NeZuKo~', '')
try {
  let file = File.fromURL(`https://mega.nz/file/${Ameen}`)
      const fileData = await new Promise((resolve, reject) => {
        file.download((err, data) => {
          if (err) return reject(err)
          resolve(data)
 }) })
const Meera = fileData.toString()
      const KeikoSCreds = path.join(__dirname, '..', 'session', 'creds.json')
      writeFileSync(KeikoSCreds, Meera)
      console.log('⚡ Saved To:', KeikoSCreds)

  const credsPath = path.join(__dirname, '..', 'session', 'creds.json')
    writeFileSync(credsPath, decodedData.toString())
  } catch (jsonError) {
    console.error('Error saving:', jsonError)
}
}
export default myrSave*/
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs'; 
import { File } from 'megajs';

async function myrSave(txt) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const sessionDir = path.join(__dirname, 'session');
  const credsPath = path.join(sessionDir, 'creds.json');

  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  const Ameen = txt.replace('NeZuKo~', '');

  try {
    let file = File.fromURL(`https://mega.nz/file/${Ameen}`);
    const fileData = await new Promise((resolve, reject) => {
      file.download((err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    const Meera = fileData.toString();
    const KeikoSCreds = path.join(__dirname, '..', 'session', 'creds.json');
    fs.writeFileSync(KeikoSCreds, Meera);
    console.log('⚡ Saved To:', KeikoSCreds);
  } catch (jsonError) {
    console.error('Error saving:', jsonError);
  }
}

export default myrSave;

