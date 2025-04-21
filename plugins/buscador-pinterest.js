import pkg from '@whiskeysockets/baileys';
import axios from 'axios';
import cheerio from 'cheerio';

const { generateWAMessageContent, generateWAMessageFromContent, proto } = pkg;

let handler = async (m, { conn, text, args }) => {
  if (!text) return m.reply(`🌱 Ingresa un texto. Ejemplo: .pinterest Sylphiette`);

  try {
    if (text.includes("https://")) {
      await m.react("⌛");
      let i = await dl(args[0]);
      if (!i?.download) throw "❌ No se pudo obtener el archivo";

      const isVideo = i.download.includes(".mp4");
      await conn.sendMessage(
        m.chat,
        {
          [isVideo ? "video" : "image"]: { url: i.download },
          caption: i.title,
        },
        { quoted: m }
      );
      await m.react("☑️");
    } else {
      await m.react("🕒");
      const results = await pins(text);
      if (!results.length) return conn.reply(m.chat, `⚠️ No se encontraron resultados para "${text}".`, m);

      async function generateImageMessage(imageUrl) {
        const { imageMessage } = await generateWAMessageContent(
          { image: { url: imageUrl } },
          { upload: conn.waUploadToServer }
        );
        return imageMessage;
      }

      let cards = [];
      for (let i = 0; i < results.length && i < 5; i++) {
        let item = results[i];
        const imageMessage = await generateImageMessage(item.image_large_url);

        cards.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: `Imagen ${i + 1}`,
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: `🔎 Pinterest`,
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: "",
            hasMediaAttachment: true,
            imageMessage,
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "📍 Ver en Pinterest",
                  url: item.pin || 'https://www.pinterest.com/',
                }),
              },
            ],
          }),
        });
      }

      const message = generateWAMessageFromContent(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `🤍 Resultados para: ${text}`,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: `🔎 Pinterest - Búsqueda`,
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  hasMediaAttachment: false,
                }),
                carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                  cards,
                }),
              }),
            },
          },
        },
        { quoted: m }
      );

      await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
      await m.react("✅");
    }
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '❌ Error al obtener imágenes de Pinterest:\n\n' + e, m);
    await m.react("✖️");
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['dl'];
export default handler;

// Función para descarga directa (imagen/video desde un enlace)
async function dl(url) {
  try {
    let res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    let $ = cheerio.load(res.data);
    let tag = $('script[data-test-id="video-snippet"]');

    if (tag.length) {
      let result = JSON.parse(tag.text());
      return {
        title: result.name,
        download: result.contentUrl
      };
    } else {
      let json = JSON.parse($("script[data-relay-response='true']").eq(0).text());
      let result = json.response.data["v3GetPinQuery"].data;
      return {
        title: result.title,
        download: result.imageLargeUrl
      };
    }
  } catch {
    return { msg: "Error, inténtalo de nuevo más tarde" };
  }
}

// Función para buscar imágenes por texto
const pins = async (query) => {
  const link = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(query)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22query%22%3A%22${encodeURIComponent(query)}%22%7D%7D`;

  const headers = {
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'priority': 'u=1, i',
    'referer': 'https://id.pinterest.com/',
    'screen-dpr': '1',
    'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133")',
    'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Google Chrome";v="133.0.6943.142", "Chromium";v="133.0.6943.142")',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-platform': '"Windows"',
    'sec-ch-ua-platform-version': '"10.0.0"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'x-app-version': 'c056fb7',
    'x-pinterest-appstate': 'active',
    'x-pinterest-pws-handler': 'www/index.js',
    'x-pinterest-source-url': '/',
    'x-requested-with': 'XMLHttpRequest'
  };

  try {
    const res = await axios.get(link, { headers });
    if (res.data?.resource_response?.data?.results) {
      return res.data.resource_response.data.results.map(item => {
        if (item.images) {
          return {
            image_large_url: item.images.orig?.url || null,
            pin: `https://www.pinterest.com/pin/${item.id}`
          };
        }
        return null;
      }).filter(img => img !== null);
    }
    return [];
  } catch (error) {
    console.error('Error al hacer la búsqueda:', error);
    return [];
  }
};
