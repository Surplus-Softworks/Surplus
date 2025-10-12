import { outer } from '@/core/outer.js';

export let translations = {};

export function translate(gameManager) {
  return new Promise((resolve) => {
    const signatureMap = {
      ws_: '10-7-0-0-17',
      touch_: '21-20-11-1-53',
      camera_: ['7-9-1-0-17', '9-10-1-0-20', '10-11-1-0-22'],
      renderer_: '9-9-3-1-22',
      particleBarn_: '1-7-1-2-11',
      decalBarn_: '0-4-1-1-6',
      playerBarn_: ['1-19-5-1-26', '1-18-5-1-25'],
      bulletBarn_: '0-6-1-1-8',
      flareBarn_: '0-4-0-1-5',
      projectileBarn_: '0-2-1-0-3',
      explosionBarn_: '0-4-0-2-6',
      planeBarn_: '0-7-2-2-11',
      airdropBarn_: '0-3-1-0-4',
      smokeBarn_: '1-3-1-1-6',
      deadBodyBarn_: '0-3-1-0-4',
      lootBarn_: '1-3-1-0-5',
      gas_: ['3-8-3-0-14', '5-8-3-0-16'],
      uiManager_: '51-64-87-2-204',
      ui2Manager_: '1-28-5-4-38',
      emoteBarn_: '',
      shotBarn_: '0-3-0-1-4',
      objectCreator_: '1-7-2-0-10',
      debugDisplay_: '36-42-12-3-93',
      prevInputMsg_: '12-4-2-1-19',
      activePlayer_: '52-40-44-3-139',
      pixi_: '2-8-5-0-15',
      audioManager_: '8-23-3-1-35',
      localization_: '1-7-1-1-10',
      config_: '2-8-1-1-12',
      input_: '4-28-6-1-39',
      inputBinds_: '1-17-3-1-22',
      inputBindUi_: '0-3-2-0-5',
      ambience_: '3-5-1-1-10',
      resourceManager_: '5-7-4-0-16',
      netData_: ['21-11-3-1-36', '23-11-3-1-38'],
      localData_: '6-11-2-1-20',
      pieTimer_: '6-6-5-0-17',
      pos_: '',
      posOld_: '',
      visualPos_: '',
      dir_: '',
      dirOld_: '',
      zoom_: '',
      update_: '',
      pool_: '',
      sendMessage_: '',
      obstaclePool_: '',
      pointToScreen_: '',
      screenToPoint_: '',
      curWeapIdx_: '',
      weapons_: '',
      activeWeapon_: '',
      dead_: '',
      particles_: '',
      idToObj_: '',
    };

    const convertedSignatureMap = {};
    for (const [key, value] of Object.entries(signatureMap)) {
      if (value == '') {
        convertedSignatureMap[key] = '';
        continue;
      }
      if (value instanceof Array) {
        value.forEach((v, i) => {
          const parts = v.split('-').map(Number);
          const converted = parts.map((n) => String.fromCharCode(97 + n)).join('');
          value[i] = converted;
        });
        convertedSignatureMap[key] = value;
      } else {
        const parts = value.split('-').map(Number);
        const converted = parts.map((n) => String.fromCharCode(97 + n)).join('');
        convertedSignatureMap[key] = converted;
      }
    }

    function getSignature(obj) {
      if (!obj || typeof obj !== 'object' || obj instanceof Array) return null;

      let counts = {
        others_: 0,
        functions_: 0,
        objects_: 0,
        arrays_: 0,
        total_: 0,
      };
      let allProps = new Set([
        ...Object.keys(obj),
        ...Object.getOwnPropertyNames(Object.getPrototypeOf(obj) || {}),
      ]);

      allProps.forEach((prop) => {
        let v = obj[prop];
        if (Array.isArray(v)) counts.arrays_++;
        else if (typeof v === 'object' && v !== null) counts.objects_++;
        else if (typeof v === 'function') counts.functions_++;
        else counts.others_++;
        counts.total_++;
      });

      return Object.values(counts)
        .map((n) => String.fromCharCode(97 + n))
        .join('');
    }

    function matchGameProperties() {
      if (!gameManager || !gameManager.game) {
        return {};
      }

      const game = gameManager.game;
      const translated = { ...translations };

      function matchSignature(obj, prop) {
        const objSignature = getSignature(obj[prop]);
        if (objSignature) {
          for (const [signatureName, signatureValue] of Object.entries(convertedSignatureMap)) {
            if (translated[signatureName]) continue;
            if (signatureValue instanceof Array) {
              if (signatureValue.some((v) => v == objSignature)) {
                translated[signatureName] = prop;
              }
            }
            if (signatureValue == objSignature) {
              translated[signatureName] = prop;
            }
          }
        }
      }

      for (const prop in game) {
        if (game.hasOwnProperty(prop)) {
          try {
            if (game[prop].hasOwnProperty('deadBodyPool')) {
              translated.deadBodyBarn_ = prop;
            } else if (game[prop].hasOwnProperty('airdropPool')) {
              translated.airdropBarn_ = prop;
            }
          } catch { }
          try {
            if (game[prop].hasOwnProperty('bones')) {
              translated.activePlayer_ = prop;
              const newplr = new game[prop].constructor();
              for (const pProp in newplr) {
                try {
                  matchSignature(game[prop], pProp);
                } catch { }
              }
              if (translated.localData_ != null) {
                translated.weapons_ = Object.getOwnPropertyNames(
                  game[prop][translated.localData_]
                ).find((v) => game[prop][translated.localData_][v] instanceof outer.Array);
              }
              if (translated.localData_ != null && translated.camera_ != null) {
                const localDataKeys = Object.getOwnPropertyNames(game[prop][translated.localData_]);
                const cameraKeys = Object.getOwnPropertyNames(game[translated.camera_]);
                translated.zoom_ = localDataKeys
                  .filter((v) => cameraKeys.includes(v))
                  .find((v) => typeof game[prop][translated.localData_][v] == 'number');
              }
              if (translated.netData_ == null) continue;
              if (translated.activePlayer_ != null) {
                try {
                  game[translated.activePlayer_].selectIdlePose.call({
                    [translated.netData_]: new Proxy(
                      {},
                      {
                        get(th, p) {
                          translated.activeWeapon_ = p;
                        },
                      }
                    ),
                  });
                } catch { }
                try {
                  game[translated.activePlayer_].canInteract.call({
                    [translated.netData_]: new Proxy(
                      {},
                      {
                        get(th, p) {
                          translated.dead_ = p;
                        },
                      }
                    ),
                  });
                } catch { }
              }
              (() => {
                let nextIsVisual = false;
                let cameraInteracted = false;
                const GET = [
                  null,
                  null,
                  (v) => (translated.pos_ = v),
                  (v) => (translated.dir_ = v),
                ];
                const SET = [
                  (v) => (translated.posOld_ = v),
                  (v) => (translated.dirOld_ = v),
                  null,
                ];
                const UPDATE = Object.getOwnPropertyNames(newplr.__proto__).find(
                  (v) => newplr[v].length == 13
                );
                try {
                  newplr[UPDATE].call(
                    new Proxy(
                      {},
                      {
                        get(th, p) {
                          GET.shift()?.(p);
                          return new Proxy(
                            { x: 0, y: 0 },
                            {
                              get(th, p) {
                                return th[p] || { x: 0, y: 0 };
                              },
                            }
                          );
                        },
                        set(th, p, v) {
                          if (nextIsVisual) {
                            nextIsVisual = false;
                            translated.visualPos_ = p;
                          }
                          SET.shift()?.(p);
                          return true;
                        },
                      }
                    ),
                    null,
                    { getPlayerById: () => { } },
                    null,
                    { isSoundPlaying: () => false },
                    null,
                    {
                      isBindDown: () => {
                        GET.unshift(null, null, null, null, null);
                        return false;
                      },
                    },
                    new Proxy(
                      {},
                      {
                        get(th, p) {
                          nextIsVisual = true;
                          cameraInteracted = true;
                        },
                      }
                    )
                  );
                } catch { }
                if (!cameraInteracted) translated.visualPos_ = translated.pos_;
              })();

              continue;
            }
            if (game[prop].hasOwnProperty('triggerPing')) {
              translated.emoteBarn_ = prop;
              continue;
            }
            if (game[prop].hasOwnProperty('mapTexture')) {
              translated.map_ = prop;
              continue;
            }
            if (game[prop].hasOwnProperty('topLeft')) {
              translated.uiManager_ = prop;
              Object.getOwnPropertyNames(game[prop]).forEach((v) => {
                if (typeof game[prop][v] == 'object' && game[prop][v] != null)
                  if (getSignature(game[prop][v]) == convertedSignatureMap.pieTimer_) {
                    translated.pieTimer_ = v;
                  }
              });
              continue;
            }
          } catch { }
          try {
            matchSignature(game, prop);
          } catch (e) { }
        }
      }
      try {
        if (translated.playerBarn_ != null) {
          Object.getOwnPropertyNames(game[translated.playerBarn_].playerPool).forEach((v) => {
            if (Array.isArray(game[translated.playerBarn_].playerPool[v])) {
              translated.pool_ = v;
            }
          });
        }
      } catch { }

      try {
        if (translated.sendMessage_ == null) {
          translated.sendMessage_ = Object.getOwnPropertyNames(game.__proto__)
            .filter((v) => typeof game[v] == 'function')
            .find((v) => game[v].length == 3);
        }
      } catch { }

      try {
        if (
          translated.map_ != null &&
          translated.update_ != null &&
          translated.obstaclePool_ == null
        ) {
          /*
          const objectProps = Object.getOwnPropertyNames(game[translated.map_]).filter(
            (v) => typeof game[translated.map_][v] == 'object' && game[translated.map_][v] != null
          );
          translated.obstaclePool_ = objectProps
            .filter((v) => translated.pool_ in game[translated.map_][v])
            .find((v) => {
              const pool = game[translated.map_][v][translated.pool_];
              if (pool.some((V) => V.isBush != null)) {
                return true;
              }
            });
            */
          try {
            game[translated.map_][translated.update_].call(
              new Proxy(
                {},
                {
                  get(th, p) {
                    translated.obstaclePool_ = p;
                    throw null;
                  },
                }
              )
            );
          } catch { }
        }
      } catch { }

      try {
        if (translated.obstaclePool_ != null && translated.pointToScreen_ == null) {
          const pool = game[translated.map_][translated.obstaclePool_][translated.pool_];
          const proxyarg = new Proxy(
            {},
            {
              get(th, p) {
                translated.pointToScreen_ = p;
              },
            }
          );
          pool[0].render.call({}, proxyarg, proxyarg);
        }
      } catch { }

      try {
        if (translated.emoteBarn_ != null && translated.screenToPoint_ == null) {
          let emotebarn = new game[translated.emoteBarn_].constructor();
          emotebarn.activePlayer = 1;
          emotebarn.emoteSelector.ping = 'ping_danger';
          emotebarn.uiManager = { getWorldPosFromMapPos: () => { } };
          emotebarn.camera = new Proxy(
            {},
            {
              get(th, p) {
                translated.screenToPoint_ = p;
              },
            }
          );
          emotebarn.triggerPing();
        }
      } catch { }

      try {
        if (translated.emoteBarn_ != null && translated.update_ == null) {
          translated.update_ = Object.getOwnPropertyNames(
            game[translated.emoteBarn_].__proto__
          ).find((v) => game[translated.emoteBarn_][v].length == 10);
        }
      } catch { }

      try {
        if (translated.touch_ != null && translated.curWeapIdx_ == null) {
          game[translated.touch_].getAimMovement.call(
            {},
            {
              [translated.localData_]: new Proxy(
                {},
                {
                  get(th, p) {
                    translated.curWeapIdx_ = p;
                  },
                }
              ),
            }
          );
        }
      } catch { }

      try {
        if (translated.smokeBarn_ != null && translated.particles_ == null) {
          translated.particles_ = Object.getOwnPropertyNames(
            gameManager.game[translated.smokeBarn_]
          ).find((v) => gameManager.game[translated.smokeBarn_][v] instanceof outer.Array);
        }
      } catch { }

      try {
        if (translated.objectCreator_ != null && translated.idToObj_ == null) {
          f = Object.getOwnPropertyNames(
            gameManager.game[translated.objectCreator_].__proto__
          ).find((v) => gameManager.game[translated.objectCreator_][v].length == 4);
          gameManager.game[translated.objectCreator_][f].call(
            new Proxy(gameManager.game[translated.objectCreator_], {
              get(th, p) {
                return th[p].bind(
                  new Proxy(
                    {},
                    {
                      get(th, p) {
                        translated.idToObj_ = p;
                      },
                    }
                  )
                );
              },
            })
          );
        }
      } catch { }

      return translated;
    }

    function allKeysFound() {
      const signatureKeys = Object.keys(signatureMap);
      const translatorKeys = Object.keys(translations);
      return signatureKeys.every((key) => translatorKeys.includes(key));
    }

    const intervalId = setInterval(() => {
      translations = matchGameProperties();
      if (DEV) {
        outer.tr = translations;
      }

      if (allKeysFound()) {
        clearInterval(intervalId);
        resolve(translations);
      }
    });

    setTimeout(() => {
      if (!allKeysFound()) {
        clearInterval(intervalId);
        resolve(translations);
      }
    }, 1000);
  });
}
