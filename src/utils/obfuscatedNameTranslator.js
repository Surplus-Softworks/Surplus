import { object, proxy } from "./hook";

const { getOwnPropertyNames, getPrototypeOf } = object;
const { __lookupGetter__: lookupGetter } = object.prototype;
const { isArray } = Array;

export let tr = {};

export function translate(gameManager) {
  return new Promise((resolve) => {
    const signatureMap = {
      ws: "10-7-0-0-17",
      touch: "21-20-11-1-53",
      camera: ["7-9-1-0-17", "9-10-1-0-20"],
      renderer: "9-9-3-1-22",
      particleBarn: "1-7-1-2-11",
      decalBarn: "0-4-1-1-6",
      playerBarn: "1-19-5-1-26",
      bulletBarn: "0-6-1-1-8",
      flareBarn: "0-4-0-1-5",
      projectileBarn: "0-2-1-0-3",
      explosionBarn: "0-4-0-2-6",
      planeBarn: "0-7-2-2-11",
      airdropBarn: "0-3-1-0-4",
      smokeBarn: "1-3-1-1-6",
      deadBodyBarn: "0-3-1-0-4",
      lootBarn: "1-3-1-0-5",
      gas: ["3-8-3-0-14", "5-8-3-0-16"],
      uiManager: "51-64-87-2-204",
      ui2Manager: "1-28-5-4-38",
      emoteBarn: "",
      shotBarn: "0-3-0-1-4",
      objectCreator: "1-7-2-0-10",
      debugDisplay: "36-42-12-3-93",
      prevInputMsg: "12-4-2-1-19",
      activePlayer: "52-40-44-3-139",
      pixi: "2-8-5-0-15",
      audioManager: "8-23-3-1-35",
      localization: "1-7-1-1-10",
      config: "2-8-1-1-12",
      input: "4-28-6-1-39",
      inputBinds: "1-17-3-1-22",
      inputBindUi: "0-3-2-0-5",
      ambience: "3-5-1-1-10",
      resourceManager: "5-7-4-0-16",
      netData: "21-11-3-1-36",
      localData: "6-11-2-1-20",
      pieTimer: "6-6-5-0-17",
      pos: "",
      posOld: "",
      visualPos: "",
      dir: "",
      dirOld: "",
      zoom: "",
      update: "",
      pool: "",
      sendMessage: "",
      obstaclePool: "",
      pointToScreen: "",
      screenToPoint: "",
      curWeapIdx: "",
      weapons: "",
      activeWeapon: "",
      dead: "",
      particles: "",
      idToObj: ""

    };

    const convertedSignatureMap = {};
    for (const [key, value] of Object.entries(signatureMap)) {
      if (value == "") {
        convertedSignatureMap[key] = "";
        continue;
      }
      if (value instanceof Array) {
        value.forEach((v, i) => {
          const parts = v.split("-").map(Number);
          const converted = parts.map((n) => String.fromCharCode(97 + n)).join("");
          value[i] = converted;
        });
        convertedSignatureMap[key] = value;
      } else {
        const parts = value.split("-").map(Number);
        const converted = parts.map((n) => String.fromCharCode(97 + n)).join("");
        convertedSignatureMap[key] = converted;
      }
    }

    function getSignature(obj) {
      if (!obj || typeof obj !== "object" || obj instanceof Array) return null;

      let counts = {
        v: 0,
        t: 0,
        j: 0,
        y: 0,
        l: 0,
      };
      let allProps = new Set([
        ...Object.keys(obj),
        ...Object.getOwnPropertyNames(Object.getPrototypeOf(obj) || {}),
      ]);

      allProps.forEach((prop) => {
        let v = obj[prop];
        if (Array.isArray(v)) counts.y++;
        else if (typeof v === "object" && v !== null) counts.j++;
        else if (typeof v === "function") counts.t++;
        else counts.v++;
        counts.l++;
      });

      return Object.values(counts)
        .map((n) => String.fromCharCode(97 + n))
        .join("");
    }

    function matchGameProperties() {
      if (!gameManager || !gameManager.game) {
        return {};
      }

      const game = gameManager.game;
      const translated = { ...tr };

      function matchSignature(obj, prop) {
        const objSignature = getSignature(obj[prop]);
        if (objSignature) {
          for (const [signatureName, signatureValue] of object.entries(convertedSignatureMap)) {
            if (translated[signatureName]) continue;
            if (signatureValue instanceof Array) {
              if (signatureValue.some(v => v == objSignature)) {
                translated[signatureName] = prop
              }
            }
            if (signatureValue == objSignature) {
              translated[signatureName] = prop
            }
          };
        }
      }

      for (const prop in game) {
        if (game.hasOwnProperty(prop)) {
          try {
            if (game[prop].hasOwnProperty("bones")) {
              translated["activePlayer"] = prop;
              const newplr = new game[prop].constructor();
              for (const pProp in newplr) {
                try {
                  /*
                  const objSignature = getSignature(game[prop][pProp]);
                  if (objSignature) {
                    for (const [signatureName, signatureValue] of Object.entries(
                      convertedSignatureMap
                    )) {
                      if (translated[signatureName]) continue;

                      if (signatureValue === objSignature) {
                        translated[signatureName] = pProp;
                        break;
                      }
                    }
                  }
                    */
                  matchSignature(game[prop], pProp);
                } catch { }
              }
              if (translated.localData != null) {
                translated.weapons = getOwnPropertyNames(game[prop][translated.localData]).find(v => game[prop][translated.localData][v] instanceof Array);
              }
              if (translated.localData != null && translated.camera != null) { // get zoom
                const localDataKeys = getOwnPropertyNames(game[prop][translated.localData]);
                const cameraKeys = getOwnPropertyNames(game[translated.camera]);
                translated.zoom = localDataKeys.filter(v => cameraKeys.includes(v)).find(v => typeof game[prop][translated.localData][v] == "number");
              }
              //console.log(translated);
              if (translated.netData == null) continue;
              if (translated.activePlayer != null) {
                try {
                  game[translated.activePlayer].selectIdlePose.call({
                    [translated.netData]: new proxy({}, {
                      get(th, p) {
                        translated.activeWeapon = p;
                      }
                    })
                  })
                } catch { }
                try {
                  game[translated.activePlayer].canInteract.call({
                    [translated.netData]: new proxy({}, {
                      get(th, p) {
                        translated.dead = p;
                      }
                    })
                  })
                } catch { }
              }
              (() => {
                let nextIsVisual = false;
                let cameraInteracted = false;
                const GET = [null, null, "pos", "dir"];
                const SET = ["posOld", "dirOld", null];
                const UPDATE = getOwnPropertyNames(newplr.__proto__).find(v => newplr[v].length == 13);
                try {
                  newplr[UPDATE].call(new proxy({}, {
                    get(th, p) {
                      const val = GET.shift();
                      if (val) translated[val] = p;
                      return new proxy({ x: 0, y: 0 }, {
                        get(th, p) {
                          return th[p] || { x: 0, y: 0 }
                        }
                      })
                    },
                    set(th, p, v) {
                      if (nextIsVisual) {
                        nextIsVisual = false;
                        translated.visualPos = p;
                      }
                      const val = SET.shift();
                      if (val) translated[val] = p;
                      return true;
                    }
                  }), null, { getPlayerById: () => { } }, null, null, null, null, new proxy({}, {
                    get(th, p) {
                      nextIsVisual = true;
                      cameraInteracted = true;
                    }
                  }))
                } catch { }
                if (!cameraInteracted) translated.visualPos = translated.pos;
              })();

              continue;
            }
            if (game[prop].hasOwnProperty("triggerPing")) {
              translated["emoteBarn"] = prop;
              continue;
            }
            if (game[prop].hasOwnProperty("mapTexture")) {
              translated["map"] = prop;
              continue;
            }
            if (game[prop].hasOwnProperty("topLeft")) {
              translated["uiManager"] = prop;
              object.getOwnPropertyNames(game[prop]).forEach(v => {
                if (typeof game[prop][v] == "object" && game[prop][v] != null)
                  if (getSignature(game[prop][v]) == convertedSignatureMap.pieTimer) {
                    translated.pieTimer = v;
                  }
              })
              continue;
            }

          } catch { }
          try {
            /*
            const objSignature = getSignature(game[prop]);
            if (objSignature) {
              for (const [signatureName, signatureValue] of Object.entries(
                convertedSignatureMap
              )) {
                if (translated[signatureName]) continue;

                if (signatureValue === objSignature) {
                  translated[signatureName] = prop;
                  break;
                }
              }
            }
              */
            matchSignature(game, prop);
          } catch (e) {
          }
        }
      }
      try {
        if (translated.playerBarn != null) {
          object.getOwnPropertyNames(game[translated.playerBarn].playerPool).forEach(v => {
            if (Array.isArray(game[translated.playerBarn].playerPool[v])) {
              translated.pool = v
            }
          })
        }
      } catch { }

      try {
        if (translated.sendMessage == null) {
          translated.sendMessage = getOwnPropertyNames(game.__proto__).filter(v => typeof game[v] == "function").find(v => game[v].length == 3);
        }
      } catch { }

      try {
        if (translated.map != null && translated.obstaclePool == null) {
          const objectProps = object.getOwnPropertyNames(game[translated.map]).filter(v => typeof game[translated.map][v] == "object" && game[translated.map][v] != null);
          translated.obstaclePool = objectProps.filter(v => translated.pool in game[translated.map][v]).find(v => {
            const pool = game[translated.map][v][translated.pool]
            if (pool.some(V => V.isBush != null)) {
              return true;
            }
          });
        }
      } catch { }

      try {
        if (translated.obstaclePool != null && translated.pointToScreen == null) {
          const pool = game[translated.map][translated.obstaclePool][translated.pool];
          const proxyarg = new proxy({}, {
            get(th, p) {
              translated.pointToScreen = p;
            }
          });
          pool[0].render.call({}, proxyarg, proxyarg)
        }
      } catch { }

      try {
        if (translated.emoteBarn != null && translated.screenToPoint == null) {
          let emotebarn = new game[translated.emoteBarn].constructor();
          emotebarn.activePlayer = 1;
          emotebarn.emoteSelector.ping = "ping_danger";
          emotebarn.uiManager = { getWorldPosFromMapPos: () => { } }
          emotebarn.camera = new proxy({}, {
            get(th, p) {
              translated.screenToPoint = p;
            }
          })
          emotebarn.triggerPing();
        }
      } catch { }

      try {
        if (translated.emoteBarn != null && translated.update == null) {
          translated.update = getOwnPropertyNames(game[translated.emoteBarn].__proto__).find(v => game[translated.emoteBarn][v].length == 10);
        }
      } catch { }

      try {
        if (translated.touch != null && translated.curWeapIdx == null) {
          game[translated.touch].getAimMovement.call({}, {
            [translated.localData]: new proxy({}, {
              get(th, p) {
                translated.curWeapIdx = p;
              }
            })
          })
        }
      } catch { }

      try {
        if (translated.smokeBarn != null && translated.particles == null) {
          translated.particles = getOwnPropertyNames(gameManager.game[translated.smokeBarn]).find(v => gameManager.game[translated.smokeBarn][v] instanceof Array);
        }
      } catch { }

      try {
        if (translated.objectCreator != null && translated.idToObj == null) {
          f = object.getOwnPropertyNames(gameManager.game[translated.objectCreator].__proto__).find(v => gameManager.game[translated.objectCreator][v].length == 4)
          gameManager.game[translated.objectCreator][f].call(new proxy(gameManager.game[translated.objectCreator], {
            get(th, p) {
              return th[p].bind(new proxy({}, {
                get(th, p) {
                  translated.idToObj = p;
                }
              }))
            }
          }));
        }
      } catch { }

      return translated;
    }

    function allKeysFound() {
      const signatureKeys = Object.keys(signatureMap);
      const translatorKeys = Object.keys(tr);
      return signatureKeys.every(key => translatorKeys.includes(key));
    }

    const intervalId = setInterval(() => {
      tr = matchGameProperties();
      if (DEV) {
        window.tr = tr;
      }

      if (allKeysFound()) {
        clearInterval(intervalId);
        resolve(tr);
      }
    });

    setTimeout(() => {
      if (!allKeysFound()) {
        clearInterval(intervalId);
        resolve(tr);
      }
    }, 1000);
  });
}