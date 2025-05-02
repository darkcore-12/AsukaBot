import { igdl } from 'ruhend-scraper';

const handler = async (m, { args, conn }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Por favor, ingresa un enlace de Instagram.`, m);
  }

  try {
    await m.react(rwait);
    const res = await igdl(args[0]);
    const data = res.data;

    for (let media of data) {
      await conn.sendFile(m.chat, media.url, 'instagram.mp4', ` ╭──────⚔──────╮  
  ${emoji} 𓂀 𝔸𝕤𝕦𝕜𝕒𝔹𝕠𝕥 𓂀  
╰──────⚔──────╯\n⟢ 𝑨𝒌𝒊 𝒕𝒊𝒆𝒏𝒆𝒔: *˙Ⱉ˙ฅ*\n⟢ 𝑫𝒊𝒔𝒇𝒓𝒖𝒕𝒂.`, m);
    await m.react(done);
    }
  } catch (e) {
    return conn.reply(m.chat, `${msm} Ocurrió un error.`, m);
    await m.react(error);
  }
};

handler.command = ['instagram', 'ig']
handler.tags = ['downloader']
handler.help = ['instagram <text>]
handler.group = true;
export default handler;
