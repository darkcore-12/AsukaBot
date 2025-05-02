import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    const notStickerMessage = '🖼️ 𝐷𝑒𝑏𝑒𝑠 𝑐𝑖𝑡𝑎𝑟 𝑢𝑛 𝑠𝑡𝑖𝑐𝑘𝑒𝑟 𝑝𝑎𝑟𝑎 𝑐𝑜𝑛𝑣𝑒𝑟𝑡𝑖𝑟 𝑎 𝑖𝑚𝑎𝑔𝑒𝑛'
    const q = m.quoted || m
    const mime = q.mimetype || q.mediaType || ''
    
    if (!/webp/.test(mime)) return m.reply(notStickerMessage)

    try {
        const media = await q.download()
        const out = await webp2png(media)
        if (!out || !Buffer.isBuffer(out)) return m.reply('❌ Error al convertir el sticker a imagen.')

        await conn.sendFile(m.chat, out, 'output.png', '', m)
    } catch (err) {
        console.error(err)
    }
}

handler.help = ['toimg (responde a un sticker)']
handler.tags = ['sticker']
handler.command = ['toimg', 'img', 'jpg']

export default handler
