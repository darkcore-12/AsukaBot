import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `📥 Por favor, ingresa un enlace de *Mediafire*.`, m);
  }
  
  await m.react('🕓');
  
  let url = args[0];
  if (!url.includes('mediafire.com')) {
    return conn.reply(m.chat, `❌ El enlace proporcionado no parece ser de MediaFire.`, m);
  }

  try {
    const apiUrl = `https://api.sylphy.xyz/download/mediafire?url=${encodeURIComponent(url)}&apikey=sylph`;
    const response = await axios.get(apiUrl);
    
    if (!response.data.status || !response.data.data) {
      throw new Error('No se pudo obtener la información del archivo.');
    }

    const { filename, size, download } = response.data.data;
    
    let text = '`乂  M E D I A F I R E - D O W N L O A D`\n\n';
    text += `📄 *Título* » ${filename}\n`;
    text += `🗂️ *Tamaño* » ${size}\n`;
    text += `🔗 *Enlace de descarga* » ${download}\n`;

    await conn.reply(m.chat, text, m);

    const fileBuffer = (await axios.get(download, { responseType: 'arraybuffer' })).data;
    await conn.sendMessage(
      m.chat,
      { document: fileBuffer, fileName: filename, mimetype: 'application/octet-stream' },
      { quoted: m }
    );
    
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('❌');
  }
};

handler.help = ['mediafire *<url>*'];
handler.tags = ['dl'];
handler.command = ['mediafire'];
handler.group = true;
handler.register = true;
handler.coin = 10;

export default handler;
