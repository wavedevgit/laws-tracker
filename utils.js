import fs from 'fs/promises';
export async function readFile(path) {
    try {
        return JSON.parse(await fs.readFile(path, 'utf-8'));
    } catch {
        return {};
    }
}

import wwebjs from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
const { RemoteAuth, Client } = wwebjs;
let sendUpdates = () => null;
let onReady = () => null;
const whenReady = (action) => {
    onReady = action;
};

mongoose
    .connect(
        process.env.POSTER_TOKEN ||
            'Token',
    )
    .then(() => {
        const store = new MongoStore({ mongoose: mongoose });
        const client = new Client({
            authStrategy: new RemoteAuth({
                store: store,
                backupSyncIntervalMs: 60 * 1_000,
            }),
        });
        client.on('ready', async () => {
            console.log('ready');
            onReady();
            const gc = await client.getChatById('120363370027628182@g.us');
            sendUpdates = async (updates) => {
                switch (updates.category) {
                    case 'jarida': {
                        await gc.sendMessage(`> 📢 "*${updates.type}*" est Modifié*`);
                        for (let item of updates.diff.added) {
                            await gc.sendMessage(
                                `- *Nouveau* numéro *ajouté* \`*${item.num}*\` avec date ${new Date(
                                    item.date,
                                ).toDateString()}`,
                            );
                        }
                        for (let item of updates.diff.removed) {
                            await gc.sendMessage(
                                `- Numéro *supprimé* \`*${item.num}*\` avec date ${new Date(item.date).toDateString()}`,
                            );
                        }
                        let downloadMsg = 'Sélectionnez le numéro à télécharger en PDF:\n';
                        for (let item of updates.diff.added) {
                            downloadMsg += `*${item.num}* ${item.url}\n`;
                        }
                        updates.diff.added.length ? await gc.sendMessage(downloadMsg) : '';
                        return;
                    }
                    case 'barlaman-feed': {
                        await gc.sendMessage(
                            `> 📢 Les articles de Barlaman ont été modifiés\n> *Type:* \`${updates.type}\``,
                        );
                        for (let item of updates.diff.added) {
                            await gc.sendMessage(
                                `- *Nouvel* article "${item.description}" (Créé le *${new Date(
                                    item.created,
                                ).toDateString()}* Par *${item.author}*)`,
                            );
                        }
                        for (let item of updates.diff.removed) {
                            await gc.sendMessage(
                                `- Article *supprimé* "${item.description}" (Créé le *${new Date(
                                    item.created,
                                ).toDateString()}* Par *${item.author}*) `,
                            );
                        }
                        await gc.sendMessage(`*Liens*:\n${updates.diff.added.map((i) => i.link).join('\n')}`);
                        return;
                    }
                }
            };
        });
        client.on('qr', (qr) => {
            console.log('login in whatsapp!!!');
            process.exit(1);
        });
        client.on('remote_session_saved', () => {
            console.log('token saved, you can quit now');
        });

        client.initialize();
    });
export { sendUpdates, whenReady };
