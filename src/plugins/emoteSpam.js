import { gameManager } from "../utils/injector.js";
import { settings } from "../loader.js";
import { validate, crash } from "../utils/security.js";
import { ref_addEventListener } from "../utils/hook.js";
const emoteTypes = ["emote_joyface", "emote_question", "emote_sadface", "emote_headshotface"];

const ref_setTimeout = validate(setTimeout, true)

function sendEmote() {
  try {
    if (settings.emoteSpam.enabled && gameManager.game) {
      if (!gameManager.game.activePlayer) return;
      const emote = {
        pos: {x: 0, y: 0},
        type: emoteTypes[Math.floor(Math.random() * emoteTypes.length)],
        isPing: false,
        serialize(a) {
            a.writeVec(this.pos, 0, 0, 1024, 1024, 16),
            a.writeGameType(this.type),
            a.writeBoolean(this.isPing),
            a.writeBits(0, 5)
        },
        deserialize(a) {
            this.pos = a.readVec(0, 0, 1024, 1024, 16),
            this.type = a.readGameType(),
            this.isPing = a.readBoolean(),
            a.readBits(5)
        }
      }
      gameManager.game.sendMessage(13, emote, 128);
    }
  } catch {}
  ref_setTimeout(sendEmote, settings.emoteSpam.speed);
}

export default function emoteSpam() {
  sendEmote();
}
