/*import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `${emoji} 🌸ꗥ～𝐏𝐨𝐫 𝐟𝐚𝐯𝐨𝐫 𝐩𝐫𝐨𝐩𝐨𝐫𝐜𝐢𝐨𝐧𝐚 𝐞𝐥 𝐧𝐨𝐦𝐛𝐫𝐞 𝐝𝐞 𝐮𝐧𝐚 𝐜𝐚𝐧𝐜𝐢ó𝐧 𝐨 𝐚𝐫𝐭𝐢𝐬𝐭𝐚～ꗥ🌸`, m)

    try {
        m.react("🧃")

        let songInfo = await spotifyxv(text)
        if (!songInfo.length) throw `${emoji2} No se encontró la canción.`

        let song = songInfo[0]

        const apiURL = `https://api.sylphy.xyz/download/spotify?url=${encodeURIComponent(song.url)}&apikey=sylph`
        const res = await fetch(apiURL)
        if (!res.ok) throw `❌ Error al conectar con la API Sylphy (código ${res.status})`

        const json = await res.json()
        if (!json.status || !json.data?.dl_url) throw `${emoji2} No se pudo obtener la canción.`

        const result = json.data
        const info = `「✦」*Descargando: ${result.title}*\n\n> 👤 *Artista:* ${result.artist}\n> 💽 *Álbum:* ${result.album}\n> 🕒 *Duración:* ${result.duration}\n> 🔗 *Enlace:* ${result.url}`

        await conn.sendMessage(m.chat, {
            text: info,
            contextInfo: {
                forwardingScore: 999999,
                isForwarded: false,
                externalAdReply: {
                    showAdAttribution: true,
                    containsAutoReply: true,
                    renderLargerThumbnail: true,
                    title: packname,
                    body: dev,
                    mediaType: 1,
                    thumbnailUrl: result.img,
                    mediaUrl: result.dl_url,
                    sourceUrl: result.url
                }
            }
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            audio: { url: result.dl_url },
            fileName: `${result.title}.mp3`,
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: m })

    } catch (err) {
        console.error(err)
        m.reply(typeof err === 'string' ? err : err.message || '❌ Ocurrió un error inesperado.')
    }
}

handler.help = ['spotify', 'music']
handler.tags = ['downloader']
handler.command = ['spotify', 'splay']
handler.group = true
handler.register = true

export default handler

// Función para buscar la canción en Spotify
async function spotifyxv(query) {
    let token = await tokens()
    let response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    const tracks = response.data.tracks.items
    return tracks.map(track => ({
        name: track.name,
        artista: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        duracion: timestamp(track.duration_ms),
        url: track.external_urls.spotify,
        imagen: track.album.images[0]?.url || ''
    }))
}

// Token de Spotify
async function tokens() {
    const response = await axios.post('https://accounts.spotify.com/api/token',
        'grant_type=client_credentials', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from('acc6302297e040aeb6e4ac1fbdfd62c3:0e8439a1280a43aba9a5bc0a16f3f009').toString('base64')
            }
        })
    return response.data.access_token
}

// Convertir tiempo en ms a formato mm:ss
function timestamp(time) {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
*/
