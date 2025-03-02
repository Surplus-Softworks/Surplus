import { objects } from "./constants";
import { object, proxy } from "./hook";

const { getOwnPropertyNames, getPrototypeOf } = object;
const { __lookupGetter__: lookupGetter } = object.prototype;
const { isArray } = Array;

export let obfuscatedNameTranslator = {};

function getAllProperties(obj) {
  return [
    ...getOwnPropertyNames(getPrototypeOf(obj)),
    ...getOwnPropertyNames(obj),
  ];
}

function isAsync(func) {
  return getPrototypeOf(func) === getPrototypeOf(async () => { });
}

function getSignature(obj) {
  if (!obj || typeof obj !== "object" || obj instanceof Array) return null;
  let counts = { primitives: 0, functions: 0, objects: 0, arrays: 0, total: 0 };
  let allProps = new Set([
    ...Object.keys(obj),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(obj) || {}),
  ]);
  allProps.forEach((prop) => {
    let v = obj[prop];
    if (Array.isArray(v)) counts.arrays++;
    else if (typeof v === "object" && v !== null) counts.objects++;
    else if (typeof v === "function") counts.functions++;
    else counts.primitives++;
    counts.total++;
  });
  return `${counts.primitives}-${counts.functions}-${counts.objects}-${counts.arrays}-${counts.total}`;
}

export function translate(gameManager) {
  if (!location.hostname.includes("survev") && false) return new Promise((resolve) => {
    obfuscatedNameTranslator = new Proxy({}, {
      get(th, p) {
        return p;
      }
    });
    resolve(obfuscatedNameTranslator);
  });
  return new Promise((resolve) => {
    const signatureMap = {
      ws: "10-7-0-0-17",
      touch: "21-20-11-1-53",
      camera: "7-9-1-0-17",
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
      gas: "3-8-3-0-14",
      uiManager: "51-64-87-2-204",
      ui2Manager: "1-28-5-4-38",
      emoteBarn: "27-16-24-8-75",
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
      pos: "",
      posOld: "",
      dir: "",
      dirOld: "",
      zoom: "",
      update: "",
      pool: "",
      sendMessage: "",
      obstaclePool: "",
      pointToScreen: "",
      screenToPoint: "",
      curWeapIdx: ""
    };

    // Convert signature strings to character-based format for comparison
    const convertedSignatureMap = {};
    for (const [key, value] of Object.entries(signatureMap)) {
      if (value == "") {
        convertedSignatureMap[key] = "";
        continue;
      }
      const parts = value.split("-").map(Number);
      const converted = parts.map((n) => String.fromCharCode(97 + n)).join("");
      convertedSignatureMap[key] = converted;
    }

    // Function to get the signature of an object
    function getSignature(obj) {
      if (!obj || typeof obj !== "object" || obj instanceof Array) return null;

      let counts = {
        primitives: 0,
        functions: 0,
        objects: 0,
        arrays: 0,
        total: 0,
      };
      let allProps = new Set([
        ...Object.keys(obj),
        ...Object.getOwnPropertyNames(Object.getPrototypeOf(obj) || {}),
      ]);

      allProps.forEach((prop) => {
        let v = obj[prop];
        if (Array.isArray(v)) counts.arrays++;
        else if (typeof v === "object" && v !== null) counts.objects++;
        else if (typeof v === "function") counts.functions++;
        else counts.primitives++;
        counts.total++;
      });

      return Object.values(counts)
        .map((n) => String.fromCharCode(97 + n))
        .join("");
    }

    function matchGameProperties() {
      if (!gameManager || !gameManager.game) {
        console.error("gameManager.game not found");
        return {};
      }

      const game = gameManager.game;
      const translated = { ...obfuscatedNameTranslator };

      for (const prop in game) {
        if (game.hasOwnProperty(prop)) {
          try {
            if (game[prop].hasOwnProperty("bones")) {
              translated["activePlayer"] = prop;
              const newplr = new game[prop].constructor();
              for (const pProp in newplr) {
                try {
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
                } catch { }
              }
              if (translated.localData != null && translated.camera != null) { // get zoom
                const localDataKeys = getOwnPropertyNames(game[prop][translated.localData]);
                const cameraKeys = getOwnPropertyNames(game[translated.camera]);
                translated.zoom = localDataKeys.filter(v => cameraKeys.includes(v)).find(v => typeof game[prop][translated.localData][v] == "number");
              }
              console.log(translated);
              if (translated.netData == null) continue;
              const vectors = getOwnPropertyNames(newplr).filter(v => v.startsWith("_0x")).filter(v => typeof newplr[v] == "object").filter(v => getOwnPropertyNames(newplr[v]).length == 2);
              vectors.forEach(key => {
                const val = newplr[key];
                if (val.x == 0) {
                  if (key in game[prop][translated.netData]) {
                    // pos
                    translated.pos = key;
                  } else {
                    // posOld
                    translated.posOld = key;
                  }
                } else if (val.x == 1) {
                  if (key in game[prop][translated.netData]) {
                    // dir
                    translated.dir = key;
                  } else {
                    // dirOld
                    translated.dirOld = key;
                  }
                }
              })
              continue;
            }
            if (game[prop].hasOwnProperty("mapTexture")) {
              translated["map"] = prop;
              continue;
            }
            if (game[prop].hasOwnProperty("topLeft")) {
              translated["uiManager"] = prop;
              continue;
            }

          } catch { }
          try {
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
            if (pool.some(V => objects[V.type] != null)) {
              return true;
            }
          });
        }
      } catch { }

      try {
        if (translated.obstaclePool != null && translated.pointToScreen == null) {
          const pool = game[translated.map][translated.obstaclePool][translated.pool];
          pool[0].render.call({}, new proxy({}, {
            get(th, p) {
              translated.pointToScreen = p;
            }
          }))
        }
      } catch { }

      try {
        if (translated.emoteBarn != null && translated.screenToPoint == null) {
          emotebarn = new game[translated.emoteBarn].constructor();
          emotebarn.activePlayer = 1;
          emotebarn.emoteSelector.ping = "ping_danger";
          emotebarn.uiManager = { getWorldPosFromMapPos: () => { } }
          emotebarn.camera = new Proxy({}, {
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
          game[translated.touch].getAimMovement.call({},{
            [translated.localData]: new Proxy({}, {
              get(th, p) {
                translated.curWeapIdx = p;
              }
            })
          })
        }
      } catch { }


      return translated;
    }

    function allKeysFound() {
      const signatureKeys = Object.keys(signatureMap);
      const translatorKeys = Object.keys(obfuscatedNameTranslator);
      return signatureKeys.every(key => translatorKeys.includes(key));
    }

    const intervalId = setInterval(() => {
      obfuscatedNameTranslator = matchGameProperties();

      if (allKeysFound()) {
        clearInterval(intervalId);
        resolve(obfuscatedNameTranslator);
      }
    });

    setTimeout(() => {
      if (!allKeysFound()) {
        clearInterval(intervalId);
        resolve(obfuscatedNameTranslator);
      }
    }, 1000);
  });
}