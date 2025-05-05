import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path'; 
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner }) => {
  const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);  
  const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command);  
  const isCommand3 = /^(bots|sockets|socket)$/i.test(command);   

  async function reportError(e) {
    await m.reply(`Kirito-Bot: ocurrió un error.`);
    console.log(e);
  }

  switch (true) {       
    case isCommand1:
      try {
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
        let uniqid = `${who.split`@`[0]}`;
        const dir = `./${jadi}/${uniqid}`;

        if (!fs.existsSync(dir)) {
          await _envio.sendMessage(m.chat, { text: `AsukaBot: no hay sesión activa.\nUsa: ${usedPrefix + command}\nSi tienes ID:\n${usedPrefix + command} (ID)` }, { quoted: m });
          return;
        }

        if (global.conn.user.jid !== conn.user.jid) {
          await _envio.sendMessage(m.chat, { text: `Este comando solo funciona en el bot principal.\nLink: https://wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix + command}` }, { quoted: m }); 
        } else {
          await _envio.sendMessage(m.chat, { text: `AsukaBot: sub-bot desconectado.` }, { quoted: m });
        }

        await fs.rm(dir, { recursive: true, force: true });
        await _envio.sendMessage(m.chat, { text: `Sesión eliminada.` }, { quoted: m });

      } catch (e) {
        reportError(e);
      }  
      break;

    case isCommand2:
      if (global.conn.user.jid == conn.user.jid) {
        await _envio.sendMessage(m.chat, { text: `Solo los sub-bots pueden usar este comando.` }, { quoted: m });
      } else {
        await _envio.sendMessage(m.chat, { text: `AsukaBot desactivado.` }, { quoted: m });
        conn.ws.close();
      }  
      break;

    case isCommand3:
      const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws && conn.ws.readyState !== ws.CLOSED)])];

      function convertirMsADiasHorasMinutosSegundos(ms) {
        let segundos = Math.floor(ms / 1000);
        let minutos = Math.floor(segundos / 60);
        let horas = Math.floor(minutos / 60);
        let dias = Math.floor(horas / 24);
        segundos %= 60;
        minutos %= 60;
        horas %= 24;
        let resultado = "";
        if (dias !== 0) resultado += dias + "d ";
        if (horas !== 0) resultado += horas + "h ";
        if (minutos !== 0) resultado += minutos + "m ";
        if (segundos !== 0) resultado += segundos + "s";
        return resultado.trim();
      }

      const message = users.map((v, i) => 
        `> ║ Sub-Bot #${i + 1}\n` +
        `> ║ Nombre : ${v.user.name || 'Sub-Bot'}\n` +
        `> ║ Enlace : wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado\n` +
        `> ║ Online : ${v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}`
      ).join('\n\n');

      const responseMessage = `*AsukaBot*\n*Sub-Bots activos*: ${users.length}\n\n${message || 'No hay sub-bots conectados.'}`.trim();

      await _envio.sendMessage(m.chat, { text: responseMessage, mentions: _envio.parseMention(responseMessage) });
      break;   
  }
};

handler.tags = ['serbot'];
handler.help = ['sockets', 'deletesesion', 'pausarai'];
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket'];

export default handler;
