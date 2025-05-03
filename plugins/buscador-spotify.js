import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '⏤͟͟͞͞★ 𝑰𝒏𝒈𝒓𝒆𝒔𝒂 𝒖𝒏 𝑵𝒐𝒎𝒃𝒓𝒆 𝒅𝒆 𝒍𝒂 𝒄𝒂𝒏𝒄𝒊𝒐́𝒏 𝒅𝒆 𝑺𝒑𝒐𝒕𝒊𝒇𝒚', m);

    try {
        let apiUrl = `https://dark-core-api.vercel.app/api/search/spotify?key=api&text=${encodeURIComponent(text)}`;
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (!Array.isArray(json) || json.length === 0) {
            return conn.reply(m.chat, '⧼𖥳⧽ 𝑵𝒐 𝒔𝒆 𝒆𝒏𝒄𝒐𝒏𝒕𝒓𝒐́ 𝒆𝒍 𝑹𝒆𝒔𝒖𝒍𝒕𝒂𝒅𝒐𝒔.', m);
        }

        let results = json.slice(0, 6);
        let message = `🎵 𝑹𝒆𝒔𝒖𝒍𝒕𝒂𝒅𝒐𝒔 𝒅𝒆 𝑺𝒑𝒐𝒕𝒊𝒇𝒚 𝑷𝒂𝒓𝒂:* _"${text}"_\n\n`;

        for (let track of results) {
            message += `🎶 𝑻𝒊́𝒕𝒖𝒍𝒐: *${track.title}*\n🎤 𝑪𝒂𝒏𝒕𝒂𝒏𝒕𝒆: *${track.artist}*\n💿 𝑫𝒊𝒔𝒄𝒐: *${track.album}*\n📅 𝑭𝒆𝒄𝒉𝒂: *${track.release_date}*\n🔗𝑳𝒊𝒏𝒌: ${track.link}\n\n`;
        }

        await conn.reply(m.chat, message, m);
    } catch (error) {
        console.error(error);
    }
};

handler.help = ['spotifysearch <text>']
handler.tags = ['buscador']
handler.command = ['spotifysearch']
export default handler;
