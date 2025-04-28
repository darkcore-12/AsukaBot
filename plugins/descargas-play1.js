import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format)) {
      throw new Error("⚠ Formato no soportado, elige uno permitido.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    };

    try {
      const response = await axios.request(config);
      if (response.data?.success) {
        const { id, title, info } = response.data;
        const downloadUrl = await ddownr.cekProgress(id);
        return { id, title, image: info.image, downloadUrl };
      } else {
        throw new Error("⛔ No se pudo obtener los detalles del video.");
      }
    } catch (error) {
      console.error("❌ Error en download:", error);
      throw error;
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    };

    try {
      while (true) {
        const response = await axios.request(config);
        if (response.data?.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error("❌ Error en cekProgress:", error);
      throw error;
    }
  }
};

// Handler SOLO PARA PLAY
const handler = async (m, { conn, text }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, "🎵 *AsukaBot* | Ingresa el nombre de la canción que deseas buscar.", m);
    }

    const search = await yts(text);
    if (!search.all.length) {
      return m.reply("⚠ No se encontraron resultados para tu búsqueda.");
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, url } = videoInfo;
    const thumb = (await conn.getFile(thumbnail))?.data;

    const infoMessage = `🫶 \`AsukaBot - Audio\`\n\n*🎵 Título:* ${title}\n*🔗 Enlace:* ${url}`;

    const externalAd = {
      contextInfo: {
        externalAdReply: {
          title: "AsukaBot 👑",
          body: "Descargando tu música...",
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    };

    await conn.reply(m.chat, infoMessage, m, externalAd);

    const result = await ddownr.download(url, "mp3");

    await conn.sendMessage(m.chat, {
      audio: { url: result.downloadUrl },
      mimetype: "audio/mpeg",
      fileName: `${result.title}.mp3`,
      ptt: false
    }, { quoted: m });

  } catch (error) {
    console.error("❌ Error en handler play:", error);
    return m.reply(`⛔ Ocurrió un error: ${error.message}`);
  }
};

handler.command = ['ytmp3','ytaudio', 'play';
handler.tags = ['downloader'];
handler.help = ['play <nombre de la canción>', 'ytmp3 <nombre de la canción>','];
export default handler;
