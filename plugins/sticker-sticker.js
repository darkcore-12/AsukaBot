import { sticker } from '../lib/sticker.js';
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import { webp2png } from '../lib/webp2mp4.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false;
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime) && (q.msg || q).seconds > 15) {
        return m.reply('*¡El video no puede durar más de 15 segundos!...*', m);
      }

      let img = await q.download?.();
      if (!img) {
        return conn.reply(m.chat, '*Por favor, envía una imagen o video para hacer un sticker.*', m);
      }

      try {
        const packstickers = global.db.data.users[m.sender] || {};
        const texto1 = packstickers.text1 || global.packsticker || '';
        const texto2 = packstickers.text2 || global.packsticker2 || '';
        stiker = await sticker(img, false, texto1, texto2);
      } catch (e) {
        console.error('error', e);
      }

      if (!stiker) {
        let out;
        if (/webp/g.test(mime)) out = await webp2png(img);
        else if (/image/g.test(mime)) out = await uploadImage(img);
        else if (/video/g.test(mime)) out = await uploadFile(img);
        if (typeof out !== 'string') out = await uploadImage(img);
        stiker = await sticker(false, out, global.packsticker, global.packsticker2);
      }

    } else if (args[0]) {
      if (isUrl(args[0])) {
        stiker = await sticker(false, args[0], global.packsticker, global.packsticker2);
      } else {
        return m.reply('*El URL es incorrecto...*', m);
      }
    }
  } catch (e) {
    console.error('[ERROR GENERAL]', e);
    if (!stiker) stiker = e;
  } finally {
    if (stiker) {
      await conn.sendMessage(
        m.chat,
        { sticker: stiker },
        { quoted: m, contextInfo: { externalAdReply: { title: 'Sticker Bot', body: 'Generador de Stickers', thumbnailUrl: null, mediaType: 1, renderLargerThumbnail: true } } }
      );
    } else {
      return conn.reply(m.chat, 'Por favor, envía una imagen o video para hacer un sticker.*', m);
    }
  }
};

handler.help = ['sticker <imagen>', 'sticker <url>'];
handler.tags = ['sticker'];
handler.command = ['s', 'sticker', 'stiker'];
export default handler;

const isUrl = (text) => {
  return /^https?:\/\/.+\.(jpe?g|gif|png|webp)$/i.test(text);
};
