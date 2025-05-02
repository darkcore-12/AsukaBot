import fetch from 'node-fetch'
var handler = async (m, { text,  usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `${emoji} 🌸ꗥ～𝐈𝐧𝐠𝐫𝐞𝐬𝐞 𝐮𝐧𝐚 𝐩𝐞𝐭𝐢𝐜𝐢ó𝐧 𝐩𝐚𝐫𝐚 𝐪𝐮𝐞 𝐆𝐞𝐦𝐢𝐧𝐢 𝐥𝐨 𝐫𝐞𝐬𝐩𝐨𝐧𝐝𝐚～ꗥ🌸`, m)
try {
await m.react(rwait)
conn.sendPresenceUpdate('composing', m.chat)
var apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${text}`)
var res = await apii.json()
await m.reply(res.result)
} catch {
await m.react('❌')
await conn.reply(m.chat, `${msm} 🌸ꗥ～𝐆𝐞𝐦𝐢𝐧𝐢 𝐧𝐨 𝐩𝐮𝐞𝐝𝐞 𝐫𝐞𝐬𝐩𝐨𝐧𝐝𝐞𝐫 𝐚 𝐞𝐬𝐚 𝐩𝐫𝐞𝐠𝐮𝐧𝐭𝐚～ꗥ🌸`, m)
}}
handler.command = ['gemini']
handler.help = ['gemini']
handler.tags = ['ai']
handler.group = true
handler.rowner = true

export default handler
