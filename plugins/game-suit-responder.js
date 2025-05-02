const handler = async (m, { conn, text }) => {
  conn.suit = conn.suit || {};

  const room = Object.values(conn.suit).find(room =>
    room.id.startsWith('suit') &&
    room.status === 'wait' &&
    room.p2 === m.sender
  );

  if (!room) return;

  if (/^(aceptar|accept)$/i.test(text)) {
    room.status = 'play';
    clearTimeout(room.timeout);

    await conn.sendMessage(room.chat, {
      text: `✅ Juego aceptado!\n\n@${room.p.split('@')[0]} y @${room.p2.split('@')[0]}: escriban su jugada:\n*piedra*, *papel* o *tijera*.`,
      mentions: [room.p, room.p2]
    });

    room.choice = {};
    room.playTimeout = setTimeout(() => {
      if (!room.choice[room.p] || !room.choice[room.p2]) {
        conn.sendMessage(room.chat, { text: `⚠️ Tiempo agotado, juego cancelado.` });
        delete conn.suit[room.id];
      }
    }, 30000);
  }

  if (/^(rechazar|decline|cancelar)$/i.test(text)) {
    clearTimeout(room.timeout);
    conn.sendMessage(room.chat, {
      text: `❌ El reto fue rechazado por @${m.sender.split('@')[0]}.`,
      mentions: [m.sender]
    });
    delete conn.suit[room.id];
  }
};

handler.command = /^aceptar|rechazar$/i;

export default handler;
