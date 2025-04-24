import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) return conn.reply(m.chat, `${emoji} Por favor proporciona el nombre de una canción o artista.\n\nEjemplo:\n${usedPrefix + command} Amor Completo - Mon Laferte`, m)

    try {
        m.react("🧃")

        let songInfo = await spotifyxv(text)
        if (!songInfo.length) throw `${emoji2} No se encontró la canción.`

        let song = songInfo[0]
        const apiURL = `https://api.sylphy.xyz/download/spotify?url=${encodeURIComponent(song.url)}&apikey=sylph`
        const res = await fetch(apiURL)

        if (!res.ok) throw `❌ Error al obtener datos de la API (código ${res.status})`

        const data = await res.json().catch((e) => {
            console.error('❌ Error al analizar la respuesta JSON:', e)
            throw "❌ Error al analizar la respuesta JSON."
        })

        const result = data?.result?.data
        if (!result?.download) throw "❌ No se pudo obtener el enlace de descarga."

        const info = `「✦」*Descargando: ${result.title}*\n\n> 👤 *Artista:* ${result.artis}\n> 💽 *Álbum:* ${song.album}\n> 🕒 *Duración:* ${timestamp(result.durasi)}\n> 🔗 *Enlace:* ${song.url}`

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
                    thumbnailUrl: result.image,
                    mediaUrl: result.download,
                    sourceUrl: result.download
                }
            }
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            audio: { url: result.download },
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

async function spotifyxv(query) {
    let token = await tokens()
    let response = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/search?q=' + query + '&type=track',
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    const tracks = response.data.tracks.items
    const results = tracks.map((track) => ({
        name: track.name,
        artista: track.artists.map((artist) => artist.name),
        album: track.album.name,
        duracion: timestamp(track.duration_ms),
        url: track.external_urls.spotify,
        imagen: track.album.images.length ? track.album.images[0].url : ''
    }))
    return results
}

async function tokens() {
    const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from('acc6302297e040aeb6e4ac1fbdfd62c3:0e8439a1280a43aba9a5bc0a16f3f009').toString('base64')
        },
        data: 'grant_type=client_credentials'
    })
    return response.data.access_token
}

function timestamp(time) {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

async function getBuffer(url, options) {
    try {
        options = options || {}
        const res = await axios({
            method: 'get',
            url,
            headers: {
                DNT: 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (err) {
        return err
    }
}

async function getTinyURL(text) {
    try {
        let response = await axios.get(`https://tinyurl.com/api-create.php?url=${text}`)
        return response.data
    } catch (error) {
        return text
    }
}
