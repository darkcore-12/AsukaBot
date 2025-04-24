import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `${emoji2} Por favor proporciona un enlace de YouTube o un texto para buscar.\n\nEjemplo:\n${usedPrefix + command} https://youtube.com/watch?v=Hx920thF8X4\n${usedPrefix + command} Amor Completo - Mon Laferte`, m)

    try {
        m.react("🧃")

        let ytUrl = text.trim()
        if (!ytUrl.includes('youtube.com') && !ytUrl.includes('youtu.be')) {
            const searchURL = `https://api.sylphy.xyz/search/yt?q=${encodeURIComponent(text)}&apikey=sylph`
            const res = await fetch(searchURL)
            if (!res.ok) throw `❌ Error al buscar en YouTube (código ${res.status})`

            const json = await res.json()
            if (!json.status || !json.res?.length) throw `${emoji2} No se encontró ningún video con ese nombre.`

            ytUrl = json.res[0].url
        }

        const apiURL = `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(ytUrl)}&apikey=sylph`
        const res2 = await fetch(apiURL)
        if (!res2.ok) throw `❌ Error al descargar el video (código ${res2.status})`

        const json2 = await res2.json()
        if (!json2.status || !json2.res?.download) throw `${emoji2} No se pudo obtener el enlace de descarga.`

        const video = json2.res
        const info = `「✦」*Descargando desde YouTube*\n\n> 🎥 *Título:* ${video.title}\n> 📁 *Formato:* ${video.format}\n> 🗂️ *Calidad:* ${video.quality}\n> 🕒 *Duración:* ${video.duration}\n> 🔗 *URL:* ${ytUrl}`

        await conn.sendMessage(m.chat, {
            text: info,
            contextInfo: {
                forwardingScore: 999999,
                isForwarded: false,
                externalAdReply: {
                    showAdAttribution: true,
                    containsAutoReply: true,
                    renderLargerThumbnail: true,
                    title: video.title,
                    body: dev,
                    mediaType: 1,
                    thumbnailUrl: video.thumbnail,
                    mediaUrl: ytUrl,
                    sourceUrl: ytUrl
                }
            }
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            video: { url: video.download },
            fileName: `${video.title}.mp4`,
            mimetype: 'video/mp4'
        }, { quoted: m })

    } catch (err) {
        console.error(err)
        m.reply(typeof err === 'string' ? err : err.message || '❌ Ocurrió un error inesperado.')
    }
}

handler.help = ['ytmp4', 'ytvideo']
handler.tags = ['downloader']
handler.command = ['play2', 'ytmp4', 'ytvideo']
handler.register = true
handler.group = true

export default handler

// Función para extraer el ID del video de una URL de YouTube
function getVideoID(url) {
    let match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
    return match ? match[1] : 'default'
}
