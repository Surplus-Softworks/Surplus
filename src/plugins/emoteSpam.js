import { gameManager } from "../utils/injector.js";
import { settings } from "../loader.js";

const emoteTypes = ["emote_joyface", "emote_question", "emote_sadface", "emote_headshotface"];

export default function emoteSpam() {
  setInterval(() => {
    try {
      if (settings.trolling.emoteSpam && (gameManager.game)) {
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
        gameManager.game.sendMessage(13, emote, 128)
      }
    } catch {

    }
  }, 50);
}