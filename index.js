import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    jidDecode,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    DisconnectReason,
    useMultiFileAuthState,
    getAggregateVotesInPollMessage
} from '@whiskeysockets/baileys';
import { Handler, Callupdate, GroupUpdate } from './src/event/index.js';
import { Boom } from '@hapi/boom';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import NodeCache from 'node-cache';
import path from 'path';
import chalk from 'chalk';
import { writeFile } from 'fs/promises';
import moment from 'moment-timezone';
import axios from 'axios';
import fetch from 'node-fetch';
import * as os from 'os';
import config from './config.cjs';
import pkg from './lib/autoreact.cjs';
import { File } from 'megajs'; // Import megajs here

const { emojis, doReact } = pkg;

const sessionName = "session";
const app = express();
const orange = chalk.bold.hex("#FF500");
const lime = chalk.bold.hex("#32CD32");
let useQR;
let isSessionPutted;
let initialConnection = true;
const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
});

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}
// Session Updated Ameen With Love💕 
async function downloadSessionData() {
    if (!config.SESSION_ID) {
        console.error('Please put your session to SESSION_ID env !!');
        process.exit(1)
    }
    var Ameen = config.SESSION_ID
    var Miya = Ameen.replace('NeZuKo~', '')
    var Meera = File.fromURL(`https://mega.nz/file/${Miya}`)
    Meera.download((err, data) => {
        if (err) throw err
        fs.writeFile(credsPath, data, () => {
        console.log("Session Saved[🌟]")
     })})}
if (!fs.existsSync(credsPath)) {
    await downloadSessionData()
}
// Session Updated Ameen With Love💕 

async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`🤖 Nezuko-MD using WA v${version.join('.')}, isLatest: ${isLatest}`);
        
        const Matrix = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: true,
            browser: ["NEZUKO-MD", "safari", "3.3"],
            auth: state,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg.message || undefined;
                }
                return { conversation: "Queen-Nezuko Nonstop Testing" };
            }
        });

        Matrix.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                    start();
                }
            } else if (connection === 'open') {
                if (initialConnection) {
                    console.log(chalk.green("Plugins Loaded...!"));
                    Matrix.sendMessage(Matrix.user.id, { text: `𝐍𝐄𝐙𝐔𝐊𝐎 𝐒𝐓𝐀𝐑𝐓𝐄𝐃` });
                    initialConnection = false;
                } else {
                    console.log(chalk.blue("♻️ Connection reestablished after restart."));
                }
            }
        });

        Matrix.ev.on('creds.update', saveCreds);

        Matrix.ev.on("messages.upsert", async chatUpdate => await Handler(chatUpdate, Matrix, logger));
        Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
        Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

        if (config.MODE === "public") {
            Matrix.public = true;
        } else if (config.MODE === "private") {
            Matrix.public = false;
        }

        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek.key.fromMe && config.AUTO_REACT) {
                    console.log(mek);
                    if (mek.message) {
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await doReact(randomEmoji, mek, Matrix);
                    }
                }
            } catch (err) {
                console.error('Error during auto reaction:', err);
            }
        });
    } catch (error) {
        console.error('Critical Error:', error);
        process.exit(1);
    }
}

start();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    
