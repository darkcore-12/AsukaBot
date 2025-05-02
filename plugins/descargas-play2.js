import fetch from "node-fetch";
import yts from "yt-search";

let handler = async (m, { conn, text, command }) => {
  if (!text) return conn.reply(m.chat, `🌸ꗥ～ꗥ🌸 𝐈𝐧𝐠𝐫𝐞𝐬𝐚 𝐞𝐥 𝐧𝐨𝐦𝐛𝐫𝐞 𝐝𝐞 𝐥𝐚 𝐯𝐢𝐝𝐞𝐨 𝐪𝐮𝐞 𝐝𝐞𝐬𝐞𝐚𝐬 𝐛𝐮𝐬𝐜𝐚𝐫. 🌸ꗥ～ꗥ🌸`, m);

  try {
    await m.react('🕓');

    const search = await yts(text);
    if (!search.all.length) {
      return m.reply("⚠ No se encontraron resultados para tu búsqueda.");
    }

    const videoInfo = search.all[0];
    const { title, url, thumbnail, timestamp, views, ago, author } = videoInfo;
    const thumb = (await conn.getFile(thumbnail))?.data;
    const vistas = views?.toLocaleString('es-ES') || '0';

    const info = `🎵 *Título:* ${title}\n` +
                 `⏳ *Duración:* ${timestamp}\n` +
                 `📈 *Vistas:* ${vistas}\n` +
                 `📺 *Canal:* ${author?.name || 'Desconocido'}\n` +
                 `🗓️ *Publicado:* ${ago}\n` +
                 `🔗 *Enlace:* ${url}`;

    await conn.sendMessage(m.chat, {
      text: info,
      contextInfo: {
        externalAdReply: {
          title: "Descargando Video 📥",
          body: "AsukaBot | WhatsApp Bot",
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    if (["play2", "ytv", "ytmp4"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;

      for (let source of sources) {
        try {
          const res = await fetch(source);
          const json = await res.json();

          const downloadUrl = json?.data?.dl 
                           || json?.result?.download?.url 
                           || json?.downloads?.url 
                           || json?.data?.download?.url;

          if (downloadUrl) {
            success = true;

            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              mimetype: "video/mp4",
              fileName: `${title}.mp4`,
              caption: "⚔ Aquí tienes tu video descargado por *AsukaBot* ⚔",
              thumbnail: thumb
            }, { quoted: m });

            await m.react('✅');
            break;
          }
        } catch (e) {
          console.error(`⚠ Error con la fuente ${source}:`, e.message);
        }
      }

      if (!success) {
        await conn.reply(m.chat, "⛔ No se pudo descargar el video, intenta de nuevo más tarde.", m);
        await m.react('❌');
      }

    } else {
      return m.reply("⚠ Comando no reconocido para descarga de video.");
    }

  } catch (error) {
    console.error("❌ Error general:", error);
    await conn.reply(m.chat, "Ocurrió un error al procesar tu solicitud.", m);
  }
};

handler.command = ['play2', 'ytv', 'ytmp4'];
handler.help = ['play2 <nombre>', 'ytv <nombre>', 'ytmp4 <nombre>'];
handler.tags = ['downloader'];

export default handler;
