/*import fetch from 'node-fetch'

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

        const apiURL = `https://api.sylphy.xyz/download/ytmp3?url=${encodeURIComponent(ytUrl)}&apikey=sylph`
        const res2 = await fetch(apiURL)
        if (!res2.ok) throw `❌ Error al descargar el audio (código ${res2.status})`

        const json2 = await res2.json()
        if (!json2.status || !json2.res?.dl) throw `${emoji2} No se pudo obtener el enlace de descarga.`

        const audio = json2.res
        const info = `「✦」*Descargando desde YouTube*\n\n> 🎵 *Título:* ${audio.title}\n> 📁 *Formato:* ${audio.format}\n> 🗂️ *Tamaño:* ${audio.size}\n> 🔗 *URL:* ${ytUrl}`

        await conn.sendMessage(m.chat, {
            text: info,
            contextInfo: {
                forwardingScore: 999999,
                isForwarded: false,
                externalAdReply: {
                    showAdAttribution: true,
                    containsAutoReply: true,
                    renderLargerThumbnail: true,
                    title: audio.title,
                    body: dev,
                    mediaType: 1,
                    thumbnailUrl: `https://i.ytimg.com/vi/${getVideoID(ytUrl)}/hq720.jpg`,
                    mediaUrl: ytUrl,
                    sourceUrl: ytUrl
                }
            }
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            audio: { url: audio.dl },
            fileName: `${audio.title}.mp3`,
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: m })

    } catch (err) {
        console.error(err)
        m.reply(typeof err === 'string' ? err : err.message || '❌ Ocurrió un error inesperado.')
    }
}

handler.help = ['ytmp3', 'ytmusic']
handler.tags = ['downloader']
handler.command = ['play','ytmp3', 'ytmusic']
handler.register = true
handler.group = true

export default handler

// Función para extraer el ID del video de una URL de YouTube
function getVideoID(url) {
    let match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
    return match ? match[1] : 'default'
}*/


import fetch from "node-fetch";
import yts from "yt-search";
import ytdl from "ytdl-core";

const formatViews = (views) => views?.toLocaleString("es-ES") || "0";

const handler = async (m, { conn, text }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, "⚔️ *AsukaBot* | Ingresa el nombre de la canción que deseas buscar.", m);
    }

    const search = await yts(text);
    if (!search.all.length) {
      return conn.reply(m.chat, "⚠ No se encontraron resultados para tu búsqueda.", m);
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail))?.data;

    const infoMessage = `🫆 \`AsukaBot - Descargas\`\n\n` +
      `*✦ Título:* ${title}\n` +
      `*✰ Duración:* ${timestamp}\n` +
      `*✰ Vistas:* ${vistas}\n` +
      `*✰ Canal:* ${videoInfo.author.name || "Desconocido"}\n` +
      `*✰ Publicado:* ${ago}\n` +
      `*∞ Enlace:* ${url}`;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: "AsukaBot 👑",
          body: "Uno de los mejores Bots de WhatsApp",
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    const audioStream = ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio'
    });

    let chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      ptt: false
    }, { quoted: m });

  } catch (error) {
    console.error("Error general:", error);
    await conn.reply(m.chat, "Ocurrió un error al procesar tu solicitud.", m);
  }
};

handler.help = ['ytmp3 <nombre del video>'];
handler.command = ['ytmp3', 'ytaudio'];
handler.tags = ['descargas'];

export default handler;

