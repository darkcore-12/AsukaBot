import axios from "axios";
import fetch from "node-fetch";

async function getSpotifyDownloadLink(trackUrl) {
  try {
    const homepageResponse = await axios.get("https://spowload.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      },
    });

    const cookies = homepageResponse.headers["set-cookie"]
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    const match = cookies.match(/XSRF-TOKEN=([^;]+)/);
    if (!match) throw new Error("❌ No se pudo extraer el CSRF Token.");

    const csrfToken = decodeURIComponent(match[1]);

    const apiUrl = "https://spowload.com/convert";
    const requestData = { urls: trackUrl };

    const response = await axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
        Origin: "https://spowload.com",
        Referer: "https://spowload.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "X-XSRF-TOKEN": csrfToken,
        Cookie: cookies,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "⚠️ Error en la solicitud:",
      error.response?.status,
      error.response?.data || error.message
    );
    return null;
  }
}

async function getSpotifyTrackInfo(trackUrl) {
  try {
    let apiURL = `https://open.spotify.com/oembed?url=${trackUrl}`;
    let response = await axios.get(apiURL);
    return response.data;
  } catch (error) {
    return null;
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      "[ ᰔᩚ ] Ingresa una URL de *Spotify* para descargar la canción.",
      m
    );
  }

  if (!text.startsWith("http") || !text.includes("spotify.com")) {
    return conn.reply(
      m.chat,
      "🌸ꗥ～𝐏𝐨𝐫 𝐟𝐚𝐯𝐨𝐫 𝐩𝐫𝐨𝐩𝐨𝐫𝐜𝐢𝐨𝐧𝐚 𝐞𝐥 𝐧𝐨𝐦𝐛𝐫𝐞 𝐝𝐞 𝐮𝐧𝐚 𝐜𝐚𝐧𝐜𝐢ó𝐧 𝐨 𝐚𝐫𝐭𝐢𝐬𝐭𝐚～ꗥ🌸",
      m
    );
  }

  await m.react("🕓");

  try {
    let trackInfo = await getSpotifyTrackInfo(text);
    let json = await getSpotifyDownloadLink(text);

    if (json && json.url && trackInfo) {
      let downloadLink = json.url;
      let title = trackInfo.title || "Audio descargado";
      let thumbnail = trackInfo.thumbnail_url || "";

      await conn.sendMessage(
        m.chat,
        {
          audio: { url: downloadLink },
          mimetype: "audio/mp4",
          ptt: true,
          contextInfo: {
            externalAdReply: {
              title: title,
              body: "Audio Descargado de Sofia-Ai",
              mediaType: 1,
              mediaUrl: text,
              thumbnailUrl: thumbnail,
              sourceUrl: text,
              containsAutoReply: true,
              renderLargerThumbnail: true,
              showAdAttribution: false,
            },
          },
        },
        { quoted: m }
      );

      await m.react("✅");
    } else {
      await m.reply("❌ No se pudo obtener el audio.");
    }
  } catch (error) {
    console.error(error);
    await m.react("⚠️");
  }
};

handler.help = ['spotify', 'splay']
handler.tags = ['downloader']
handler.command = ['spotify', 'splay']
handler.group = true
export default handler;

