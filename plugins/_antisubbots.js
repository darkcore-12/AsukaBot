import { areJidsSameUser } from '@whiskeysockets/baileys'

export async function before(m, { participants, conn }) {
    if (m.isGroup) {
        let chat = global.db.data.chats[m.chat];

        if (!chat.antiBot2) {
            return
        }

        let botJid = global.conn.user.jid // JID del bot principal

        if (botJid === conn.user.jid) {
            return
        } else {
            let isBotPresent = participants.some(p => areJidsSameUser(botJid, p.id))

            if (isBotPresent) {
                // Si otro bot está en el grupo, no responder
                //return m.reply('🤖 Ya hay otro bot en este grupo, no puedo responder.')
            }
        }
    }
}
