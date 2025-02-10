// ==UserScript==
// @name         (XENOs)FREE HACKS 1.1
// @namespace    https://github.com/Drino955/survev-kr1tyhack
// @version      1.1
// @description  xray, tracer, better zoom, smoke/obstacle opacity, autoloot, player names...
// @author       kr1tyTeam/Xeno
// @license      GPL3
// @match        *://survev.io/*
// @match        *://resurviv.biz/*
// @match        *://eu-comp.net/*
// @match        *://zurviv.io/*
// @match        *://50v50.online/*
// @match        *://67.217.244.178/*
// @icon         https://www.google.com/s2/favicons?domain=survev.io
// @run-at       document-end
// @webRequest   [{"selector":"*app-*.js","action":"cancel"}]
// @webRequest   [{"selector":"*shared-*.js","action":"cancel"}]
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.0.3/pixi.min.js
// @homepageURL  https://github.com/Drino955/survev-kr1tyhack
// @updateURL    https://raw.githubusercontent.com/Drino955/survev-kr1tyhack/main/kr1tyhack.user.js
// @downloadURL  https://raw.githubusercontent.com/Drino955/survev-kr1tyhack/main/kr1tyhack.user.js
// @supportURL   https://github.com/Drino955/survev-kr1tyhack/issues
// ==/UserScript==
(function () {
    'use strict';
  
    function f() {
      const v = "This extension is not supported, install the \"Tamperokey Legacy MV2\", NOT \"TamperMonkey\"!!!\n    And check that you have not installed the script for \"Tampermonkey\", the script needs to be installed ONLY for \"Tamperokey Legacy MV2\"!!!";
      alert(v);
      unsafeWindow.stop();
      document.write(v);
    }
    if (typeof GM_info !== "undefined" && GM_info.scriptHandler === "Tampermonkey") {
      if (GM_info.version <= "5.1.1" || GM_info.userAgentData.brands[0].brand == "Firefox") {
        console.log("The script is launched at Tampermonkey Legacy");
      } else {
        f();
      }
    } else {
      console.log("The script is not launched at Tampermonkey");
      f();
    }
    const v2 = 65280;
    const v3 = 62451;
    const v4 = 16711680;
    const v5 = 16777215;
    const v6 = GM_info.script.version;
    const v7 = "newFeaturesShown_" + v6;
    const vGM_getValue = GM_getValue(v7, false);
    if (!vGM_getValue) {
      const v8 = "\n        <strong style=\"font-size:20px;display:block;\">🚀 Exciting Updates in Xeno Hack:</strong><br>\n        📢 Join our <a href=\"https://discord.gg/NCGUAmDM2p\" target=\"_blank\">Discord</a> to keep up with the latest announcements, updates, and more! Remember, this is the free version without aimbot. If you would like to upgrade to the paid version with aimbot, join our Discord and reach out to an admin so we can get you updated! HACKERS UNITE!<br>\n   ";
      const v9 = document.createElement("div");
      v9.style.position = "fixed";
      v9.style.top = "0";
      v9.style.left = "0";
      v9.style.width = "100%";
      v9.style.height = "100%";
      v9.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
      v9.style.zIndex = "999";
      const v10 = document.createElement("div");
      v10.innerHTML = v8;
      v10.style.position = "fixed";
      v10.style.top = "50%";
      v10.style.left = "50%";
      v10.style.transform = "translate(-50%, -50%)";
      v10.style.backgroundColor = "rgb(20, 20, 20)";
      v10.style.color = "#fff";
      v10.style.padding = "20px";
      v10.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
      v10.style.zIndex = "1000";
      v10.style.borderRadius = "10px";
      v10.style.maxWidth = "500px";
      v10.style.width = "80%";
      v10.style.textAlign = "center";
      v10.style.fontSize = "17px";
      v10.style.overflow = "auto";
      v10.style.maxHeight = "90%";
      v10.style.margin = "10px";
      const v11 = document.createElement("button");
      v11.textContent = "Close";
      v11.style.margin = "20px auto 0 auto";
      v11.style.padding = "10px 20px";
      v11.style.border = "none";
      v11.style.backgroundColor = "#007bff";
      v11.style.color = "#fff";
      v11.style.borderRadius = "5px";
      v11.style.cursor = "pointer";
      v11.style.display = "block";
      v11.addEventListener("click", () => {
        document.body.removeChild(v10);
        document.body.removeChild(v9);
        GM_setValue(v7, true);
      });
      v10.appendChild(v11);
      document.body.appendChild(v9);
      document.body.appendChild(v10);
    }
    let v12 = {
      isAimBotEnabled: false,
      isAimAtKnockedOutEnabled: true,
      get aimAtKnockedOutStatus() {
        return this.isAimBotEnabled && this.isAimAtKnockedOutEnabled;
      },
      isZoomEnabled: true,
      isMeleeAttackEnabled: true,
      get meleeStatus() {
        return this.isAimBotEnabled && this.isMeleeAttackEnabled;
      },
      isSpinBotEnabled: true,
      isAutoSwitchEnabled: true,
      isUseOneGunEnabled: false,
      focusedEnemy: null,
      get focusedEnemyStatus() {
        return this.isAimBotEnabled && this.focusedEnemy;
      },
      isXrayEnabled: true,
      friends: [],
      lastFrames: {},
      enemyAimBot: null,
      isLaserDrawerEnabled: true,
      isLineDrawerEnabled: true,
      isNadeDrawerEnabled: true,
      isOverlayEnabled: true
    };
    function f2(p) {
      return Object.keys(game.playerBarn.teamInfo).find(p2 => game.playerBarn.teamInfo[p2].playerIds.includes(p.__id));
    }
    function f3(p3) {
      const v13 = p3.netData.activeWeapon;
      if (v13 && unsafeWindow.guns[v13]) {
        return unsafeWindow.guns[v13];
      } else {
        return null;
      }
    }
    function f4(p4) {
      if (p4) {
        return unsafeWindow.bullets[p4.bulletType];
      } else {
        return null;
      }
    }
    const v14 = document.createElement("div");
    v14.className = "Xeno-overlay-broken";
    const v15 = document.createElement("h3");
    v15.className = "Xeno-title-broken";
    v15.innerText = "XENO 1.0";
    const v16 = document.createElement("div");
    v16.className = "aimbotDot-broken";
    function f5() {
      v14.innerHTML = "";
      const v17 = [["[Z] Zoom:", v12.isZoomEnabled, v12.isZoomEnabled ? "ON" : "OFF"]];
      v17.forEach((p5, p6) => {
        let [v18, v19, v20] = p5;
        const v21 = v18 + " " + v20;
        const v22 = document.createElement("p");
        v22.className = "kr1ty-control";
        v22.style.opacity = v19 ? 1 : 0.5;
        v22.textContent = v21;
        v14.appendChild(v22);
      });
    }
    function f6() {
      v12.isOverlayEnabled = !v12.isOverlayEnabled;
      v14.style.display = v12.isOverlayEnabled ? "block" : "none";
    }
    document.querySelector("#ui-game").append(v14);
    document.querySelector("#ui-top-left").insertBefore(v15, document.querySelector("#ui-top-left").firstChild);
    document.querySelector("#ui-game").append(v16);
    function f7() {
      v12.isMeleeAttackEnabled = !v12.isMeleeAttackEnabled;
      if (v12.isMeleeAttackEnabled) {
        return;
      }
      unsafeWindow.aimTouchMoveDir = null;
    }
    function f8(p7, p8) {
      if (!p7 || !p8) {
        console.log("Missing enemy or player data");
        return null;
      }
      const {
        pos: _0x11e5fe
      } = p7;
      const {
        pos: _0x48f06f
      } = p8;
      const v23 = performance.now();
      if (!(p7.__id in v12.lastFrames)) {
        v12.lastFrames[p7.__id] = [];
      }
      v12.lastFrames[p7.__id].push([v23, {
        ..._0x11e5fe
      }]);
      if (v12.lastFrames[p7.__id].length < 30) {
        console.log("Insufficient data for prediction, using current position");
        return unsafeWindow.game.camera.pointToScreen({
          x: _0x11e5fe._x,
          y: _0x11e5fe._y
        });
      }
      if (v12.lastFrames[p7.__id].length > 30) {
        v12.lastFrames[p7.__id].shift();
      }
      const v24 = (v23 - v12.lastFrames[p7.__id][0][0]) / 1000;
      const v25 = {
        x: (_0x11e5fe._x - v12.lastFrames[p7.__id][0][1]._x) / v24,
        y: (_0x11e5fe._y - v12.lastFrames[p7.__id][0][1]._y) / v24
      };
      const vF3 = f3(p8);
      const vF4 = f4(vF3);
      let v26;
      if (!vF4) {
        v26 = 1000;
      } else {
        v26 = vF4.speed;
      }
      const v27 = v25.x;
      const v28 = v25.y;
      const v29 = _0x11e5fe._x - _0x48f06f._x;
      const v30 = _0x11e5fe._y - _0x48f06f._y;
      const vV26 = v26;
      const v31 = vV26 ** 2 - v27 ** 2 - v28 ** 2;
      const v32 = (v27 * v29 + v28 * v30) * -2;
      const v33 = -(v29 ** 2) - v30 ** 2;
      let v34;
      if (Math.abs(v31) < 0.000001) {
        console.log("Linear solution bullet speed is much greater than velocity");
        v34 = -v33 / v32;
      } else {
        const v35 = v32 ** 2 - v31 * 4 * v33;
        if (v35 < 0) {
          console.log("No solution, shooting at current position");
          return unsafeWindow.game.camera.pointToScreen({
            x: _0x11e5fe._x,
            y: _0x11e5fe._y
          });
        }
        const v36 = Math.sqrt(v35);
        const v37 = (-v32 - v36) / (v31 * 2);
        const v38 = (-v32 + v36) / (v31 * 2);
        v34 = Math.min(v37, v38) > 0 ? Math.min(v37, v38) : Math.max(v37, v38);
      }
      if (v34 < 0) {
        console.log("Negative time, shooting at current position");
        return unsafeWindow.game.camera.pointToScreen({
          x: _0x11e5fe._x,
          y: _0x11e5fe._y
        });
      }
      const v39 = {
        x: _0x11e5fe._x + v27 * v34,
        y: _0x11e5fe._y + v28 * v34
      };
      return unsafeWindow.game.camera.pointToScreen(v39);
    }
    function f9(p9, p10) {
      const v40 = p10._x - p9._x;
      const v41 = p10._y - p9._y;
      return Math.atan2(v41, v40);
    }
    function f10(p11, p12 = {}, p13 = "") {
      const v42 = document.createElement(p11);
      Object.assign(v42.style, p12);
      v42.innerHTML = p13;
      return v42;
    }
    function f11() {
      const v43 = vF10.querySelectorAll("div[data-stateName]");
      v43.forEach(p14 => {
        const v44 = p14.getAttribute("data-stateName");
        const v45 = p14.getAttribute("data-role");
        const v46 = v12[v44];
        p14.style.color = v46 && v45 === "sub" ? "#a8a922" : v46 ? "white" : "#3e3e3e";
      });
    }
    function f12(p15, p16, p17, p18 = "sup") {
      let v47;
      if (p18 === "sup") {
        v47 = f10("div", {
          fontFamily: "Open Sans, sans-serif",
          fontSize: "18px",
          color: "white",
          textAlign: "left",
          cursor: "pointer"
        }, p15);
      } else if (p18 === "sub") {
        v47 = f10("div", {
          fontFamily: "Open Sans, sans-serif",
          fontSize: "16px",
          color: "#a8a922",
          textAlign: "left",
          paddingLeft: "14px",
          cursor: "pointer"
        }, p15);
      } else {
        throw new Error("Invalid role specified for feature button");
      }
      v47.setAttribute("data-stateName", p17);
      v47.setAttribute("data-role", p18);
      v47.addEventListener("click", () => {
        p16();
        f5();
        f11();
      });
      return v47;
    }
    const vF10 = f10("div", {
      maxWidth: "400px",
      maxHeight: "400px",
      width: "30%",
      height: "60%",
      overflow: "auto",
      backgroundColor: "#010302",
      borderRadius: "10px",
      position: "fixed",
      left: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "none",
      zIndex: 2147483646,
      userSelect: "none",
      transition: "transform 0.2s ease-in-out"
    });
    vF10.addEventListener("mouseenter", () => {
      unsafeWindow.game.inputBinds.menuHovered = true;
    });
    vF10.addEventListener("mouseleave", () => {
      unsafeWindow.game.inputBinds.menuHovered = false;
    });
    const vF102 = f10("div", {
      width: "100%",
      backgroundColor: "#3e3e3e"
    });
    const vF103 = f10("div", {
      fontFamily: "Open Sans, sans-serif",
      fontSize: "18px",
      color: "white",
      textAlign: "left",
      padding: "10px 20px",
      lineHeight: "100%"
    }, "Xeno hack 1.0");
    vF102.appendChild(vF103);
    const vF104 = f10("div", {
      padding: "12px 20px",
      color: "white",
      fontFamily: "Open Sans, sans-serif"
    });
    const vF12 = f12("Tracers", () => {
      v12.isLineDrawerEnabled = !v12.isLineDrawerEnabled;
      v12.isNadeDrawerEnabled = !v12.isNadeDrawerEnabled;
      v12.isLaserDrawerEnabled = !v12.isLaserDrawerEnabled;
    }, "isLineDrawerEnabled");
    const vF122 = f12("Flashlight", () => {
      v12.isLaserDrawerEnabled = !v12.isLaserDrawerEnabled;
    }, "isLaserDrawerEnabled", "sub");
    const vF123 = f12("Zoom", () => {
      v12.isZoomEnabled = !v12.isZoomEnabled;
    }, "isZoomEnabled");
    const vF124 = f12("Aim at Downed", () => {
      v12.isAimAtKnockedOutEnabled = !v12.isAimAtKnockedOutEnabled;
    }, "aimAtKnockedOutStatus", "sub");
    const vF125 = f12("Melee Attack", f7, "meleeStatus", "sub");
    const vF126 = f12("SpinBot", () => {}, "isSpinBotEnabled");
    const vF127 = f12("UseOneGun", () => {
      v12.isUseOneGunEnabled = !v12.isUseOneGunEnabled;
    }, "isUseOneGunEnabled");
    const vF128 = f12("Overlay", f6, "isOverlayEnabled");
    vF10.appendChild(vF102);
    vF104.appendChild(vF124);
    vF104.appendChild(vF125);
    vF104.appendChild(vF123);
    vF104.appendChild(vF12);
    vF104.appendChild(vF122);
    vF104.appendChild(vF126);
    vF104.appendChild(vF127);
    vF104.appendChild(vF128);
    vF10.appendChild(vF104);
    document.body.appendChild(vF10);
    f11();
    function f13() {
      const v48 = document.getElementById("ui-game-menu");
      if (v48) {
        const v49 = v48.style.display;
        vF10.style.display = v49;
      }
    }
    const v50 = new MutationObserver(f13);
    const v51 = document.getElementById("ui-game-menu");
    if (v51) {
      v50.observe(v51, {
        attributes: true,
        attributeFilter: ["style"]
      });
    }
    const vF105 = f10("style");
    vF105.innerHTML = "\n@keyframes fadeIn {\n    0% { opacity: 0; }\n    100% { opacity: 1; }\n}";
    document.head.appendChild(vF105);
    class C {
      constructor() {
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.kills = 0;
        this.setAnimationFrameCallback();
        if (unsafeWindow.location.hostname !== "resurviv.biz" && unsafeWindow.location.hostname !== "zurviv.io" && unsafeWindow.location.hostname !== "eu-comp.net") {
          this.initCounter("fpsCounter");
          this.initCounter("pingCounter");
          this.initCounter("killsCounter");
        }
        this.initMenu();
        this.initRules();
        this.setupWeaponBorderHandler();
      }
      initCounter(p19) {
        this[p19] = document.createElement("div");
        this[p19].id = p19;
        Object.assign(this[p19].style, {
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          padding: "5px 10px",
          marginTop: "10px",
          borderRadius: "5px",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          zIndex: "10000",
          pointerEvents: "none"
        });
        const v52 = document.getElementById("ui-top-left");
        if (v52) {
          v52.appendChild(this[p19]);
        }
      }
      setAnimationFrameCallback() {
        this.animationFrameCallback = p20 => setTimeout(p20, 1);
      }
      getKills() {
        const v53 = document.querySelector(".ui-player-kills.js-ui-player-kills");
        if (v53) {
          const vParseInt = parseInt(v53.textContent, 10);
          if (isNaN(vParseInt)) {
            return 0;
          } else {
            return vParseInt;
          }
        }
        return 0;
      }
      startPingTest() {
        const v54 = unsafeWindow.location.href;
        const v55 = /\/#\w+/.test(v54);
        const v56 = document.getElementById("team-server-select");
        const v57 = document.getElementById("server-select-main");
        const v58 = v55 && v56 ? v56.value : v57 ? v57.value : null;
        if (v58 && v58 !== this.currentServer) {
          this.currentServer = v58;
          this.resetPing();
          let v59 = unsafeWindow.servers;
          if (!v59) {
            return;
          }
          const v60 = v59.find(p21 => v58.toUpperCase() === p21.region.toUpperCase());
          if (v60) {
            this.pingTest = new C2(v60);
            this.pingTest.startPingTest();
          } else {
            this.resetPing();
          }
        }
      }
      resetPing() {
        if (this.pingTest && this.pingTest.test.ws) {
          this.pingTest.test.ws.close();
          this.pingTest.test.ws = null;
        }
        this.pingTest = null;
      }
      updateHealthBars() {
        const v61 = document.querySelectorAll("#ui-health-container");
        v61.forEach(p22 => {
          const v62 = p22.querySelector("#ui-health-actual");
          if (v62) {
            const v63 = Math.round(parseFloat(v62.style.width));
            let v64 = p22.querySelector(".health-text");
            if (!v64) {
              v64 = document.createElement("span");
              v64.classList.add("health-text");
              Object.assign(v64.style, {
                width: "100%",
                textAlign: "center",
                marginTop: "5px",
                color: "#333",
                fontSize: "20px",
                fontWeight: "bold",
                position: "absolute",
                zIndex: "10"
              });
              p22.appendChild(v64);
            }
            v64.textContent = v63 + "%";
          }
        });
      }
      updateBoostBars() {
        const v65 = document.querySelector("#ui-boost-counter");
        if (v65) {
          const v66 = v65.querySelectorAll(".ui-boost-base .ui-bar-inner");
          let v67 = 0;
          const v68 = [25, 25, 40, 10];
          v66.forEach((p23, p24) => {
            const vParseFloat = parseFloat(p23.style.width);
            if (!isNaN(vParseFloat)) {
              v67 += vParseFloat * (v68[p24] / 100);
            }
          });
          const v69 = Math.round(v67);
          let v70 = v65.querySelector(".boost-display");
          if (!v70) {
            v70 = document.createElement("div");
            v70.classList.add("boost-display");
            Object.assign(v70.style, {
              position: "absolute",
              bottom: "75px",
              right: "335px",
              color: "#FF901A",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              padding: "5px 10px",
              borderRadius: "5px",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
              zIndex: "10",
              textAlign: "center"
            });
            v65.appendChild(v70);
          }
          v70.textContent = "AD: " + v69 + "%";
        }
      }
      setupWeaponBorderHandler() {
        const v71 = Array.from(document.getElementsByClassName("ui-weapon-switch"));
        v71.forEach(p25 => {
          if (p25.id === "ui-weapon-id-4") {
            p25.style.border = "3px solid #2f4032";
          } else {
            p25.style.border = "3px solid #FFFFFF";
          }
        });
        const v72 = Array.from(document.getElementsByClassName("ui-weapon-name"));
        v72.forEach(p26 => {
          const v73 = p26.closest(".ui-weapon-switch");
          const v74 = new MutationObserver(() => {
            const v75 = p26.textContent.trim();
            let v76 = "#FFFFFF";
            switch (v75.toUpperCase()) {
              case "CZ-3A1":
              case "G18C":
              case "M9":
              case "M93R":
              case "MAC-10":
              case "MP5":
              case "P30L":
              case "DUAL P30L":
              case "UMP9":
              case "VECTOR":
              case "VSS":
              case "FLAMETHROWER":
                v76 = "#FFAE00";
                break;
              case "AK-47":
              case "OT-38":
              case "OTS-38":
              case "M39 EMR":
              case "DP-28":
              case "MOSIN-NAGANT":
              case "SCAR-H":
              case "SV-98":
              case "M1 GARAND":
              case "PKP PECHENEG":
              case "AN-94":
              case "BAR M1918":
              case "BLR 81":
              case "SVD-63":
              case "M134":
              case "GROZA":
              case "GROZA-S":
                v76 = "#007FFF";
                break;
              case "FAMAS":
              case "M416":
              case "M249":
              case "QBB-97":
              case "MK 12 SPR":
              case "M4A1-S":
              case "SCOUT ELITE":
              case "L86A2":
                v76 = "#0f690d";
                break;
              case "M870":
              case "MP220":
              case "SAIGA-12":
              case "SPAS-12":
              case "USAS-12":
              case "SUPER 90":
              case "LASR GUN":
              case "M1100":
                v76 = "#FF0000";
                break;
              case "MODEL 94":
              case "PEACEMAKER":
              case "VECTOR (.45 ACP)":
              case "M1911":
              case "M1A1":
                v76 = "#800080";
                break;
              case "DEAGLE 50":
              case "RAINBOW BLASTER":
                v76 = "#000000";
                break;
              case "AWM-S":
              case "MK 20 SSR":
                v76 = "#808000";
                break;
              case "POTATO CANNON":
              case "SPUD GUN":
                v76 = "#A52A2A";
                break;
              case "FLARE GUN":
                v76 = "#FF4500";
                break;
              case "M79":
                v76 = "#008080";
                break;
              case "HEART CANNON":
                v76 = "#FFC0CB";
                break;
              default:
                v76 = "#FFFFFF";
                break;
            }
            if (v73.id !== "ui-weapon-id-4") {
              v73.style.border = "3px solid " + v76;
            }
          });
          v74.observe(p26, {
            childList: true,
            characterData: true,
            subtree: true
          });
        });
      }
      initMenu() {
        const v77 = document.querySelector("#start-row-top");
        Object.assign(v77.style, {
          display: "flex",
          flexDirection: "row"
        });
        const v78 = document.createElement("div");
        v78.id = "kr1tyHack_broken";
        Object.assign(v78.style, {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          fontFamily: "Arial, sans-serif",
          fontSize: "18px",
          color: "#fff",
          maxWidth: "300px",
          height: "100%",
          overflowY: "auto",
          marginRight: "30px",
          boxSizing: "border-box"
        });
        const v79 = document.createElement("h2");
        v79.textContent = "Social networks";
        v79.className = "news-header";
        Object.assign(v79.style, {
          margin: "0 0 10px",
          fontSize: "20px"
        });
        v78.append(v79);
        const v80 = document.createElement("p");
        v80.className = "news-paragraph";
        v80.style.fontSize = "14px";
        v80.innerHTML = "⭐ Star us on GitHub<br>📢 Join our Telegram group<br>🎮 Join our Discord server";
        v78.append(v80);
        const vF = p27 => {
          const v81 = document.createElement("a");
          v81.textContent = "" + p27;
          v81.target = "_blank";
          Object.assign(v81.style, {
            display: "block",
            border: "none",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
            fontSize: "15px",
            lineHeight: "14px",
            cursor: "pointer",
            textAlign: "center",
            textDecoration: "none"
          });
          return v81;
        };
        const vVF = vF("");
        vVF.style.backgroundColor = "#0c1117";
        vVF.href = "https://github.com/Drino955/survev-kr1tyhack";
        vVF.innerHTML = "<i class=\"fa-brands fa-github\"></i> kr1tyHack";
        v78.append(vVF);
        const vVF2 = vF("");
        vVF2.style.backgroundColor = "#00a8e6";
        vVF2.href = "https://t.me/kr1tyteam";
        vVF2.innerHTML = "<i class=\"fa-brands fa-telegram-plane\"></i> kr1tyTeam";
        v78.append(vVF2);
        const vVF3 = vF("");
        vVF3.style.backgroundColor = "#5865F2";
        vVF3.href = "https://discord.gg/NCGUAmDM2p";
        vVF3.innerHTML = "<i class=\"fa-brands fa-discord\"></i> [HACK] League of Hackers";
        v78.append(vVF3);
        const v82 = document.createElement("p");
        v82.className = "news-paragraph";
        v82.style.fontSize = "14px";
        v82.innerHTML = "Your support helps us develop the project and provide better updates!";
        v78.append(v82);
        const v83 = document.querySelector("#left-column");
        v83.innerHTML = "";
        v83.style.marginTop = "10px";
        v83.style.marginBottom = "27px";
        v83.append(v78);
        this.menu = v78;
      }
      initRules() {
        const v84 = document.querySelector("#news-block");
        v84.innerHTML = "\n<h3 class=\"news-header\">Xeno Hack 1.0</h3>\n<div id=\"news-current\">\n<small class=\"news-date\">February 6, 2025</small>\n\n<h2>Welcome to Xenos free Cheats🚀</h2>\n<p class=\"news-paragraph\">Notice: This is the free version of the cheats without aimbot, If you would like the paid version with aimbot, please join the discord server and dm admin/staff</p>\n\n<h3>Recommendations:</h3>\n<ul>\n    <li>Play smart and don't rush headlong, as the cheat does not provide immortality.</li>\n    <li>Use adrenaline to the max to heal and run fast.</li>\n    <li>The map is color-coded: white circle - Mosin, gold container - SV98, etc.</li>\n</ul>\n\n<p class=\"news-paragraph\">For more details, visit the <a href=\"https://github.com/Drino955/survev-kr1tyhack\">GitHub page</a> and join our <a href=\"https://t.me/kr1tyteam\">Telegram group</a> or <a href=\"https://discord.gg/NCGUAmDM2p\">Discord</a>.</p></div>";
      }
      startUpdateLoop() {
        const v85 = performance.now();
        const v86 = v85 - this.lastFrameTime;
        this.frameCount++;
        if (v86 >= 1000) {
          this.fps = Math.round(this.frameCount * 1000 / v86);
          this.frameCount = 0;
          this.lastFrameTime = v85;
          this.kills = this.getKills();
          if (this.fpsCounter) {
            this.fpsCounter.textContent = "FPS: " + this.fps;
          }
          if (this.killsCounter) {
            this.killsCounter.textContent = "Kills: " + this.kills;
          }
          if (this.pingCounter && this.pingTest) {
            const v87 = this.pingTest.getPingResult();
            this.pingCounter.textContent = "PING: " + v87.ping + " ms";
          }
        }
        this.startPingTest();
        this.updateBoostBars();
        this.updateHealthBars();
      }
    }
    class C2 {
      constructor(p28) {
        this.ptcDataBuf = new ArrayBuffer(1);
        this.test = {
          region: p28.region,
          url: "wss://" + p28.url + "/ptc",
          ping: 9999,
          ws: null,
          sendTime: 0,
          retryCount: 0
        };
      }
      startPingTest() {
        if (!this.test.ws) {
          const v88 = new WebSocket(this.test.url);
          v88.binaryType = "arraybuffer";
          v88.onopen = () => {
            this.sendPing();
            this.test.retryCount = 0;
          };
          v88.onmessage = () => {
            const v89 = (Date.now() - this.test.sendTime) / 1000;
            this.test.ping = Math.round(v89 * 1000);
            this.test.retryCount = 0;
            setTimeout(() => this.sendPing(), 200);
          };
          v88.onerror = () => {
            this.test.ping = "Error";
            this.test.retryCount++;
            if (this.test.retryCount < 5) {
              setTimeout(() => this.startPingTest(), 2000);
            } else {
              this.test.ws.close();
              this.test.ws = null;
            }
          };
          v88.onclose = () => {
            this.test.ws = null;
          };
          this.test.ws = v88;
        }
      }
      sendPing() {
        if (this.test.ws.readyState === WebSocket.OPEN) {
          this.test.sendTime = Date.now();
          this.test.ws.send(this.ptcDataBuf);
        }
      }
      getPingResult() {
        return {
          region: this.test.region,
          ping: this.test.ping
        };
      }
    }
    unsafeWindow.GameMod = new C();
    console.log("Script injecting...");
    const v90 = document.getElementById("player-name-input-solo");
    if (v90) {
      v90.value = "discord.gg/krity";
      v90.dispatchEvent(new Event("input", {
        bubbles: true
      }));
    }
    (async () => {
      const v91 = [...Array.from(document.querySelectorAll("link[rel=\"modulepreload\"][href]")), ...Array.from(document.querySelectorAll("script[type=\"module\"][src]"))];
      const v92 = v91.find(p29 => p29.src?.includes("app-"));
      const v93 = v91.find(p30 => p30.href?.includes("shared-"));
      const v94 = v91.find(p31 => p31.href?.includes("vendor-"));
      const v95 = v92.src;
      const v96 = v93.href;
      const v97 = v94.href;
      let v98 = null;
      let v99 = null;
      if (v96) {
        const v100 = await GM.xmlHttpRequest({
          url: v96
        }).catch(p32 => console.error(p32));
        let v101 = await v100.responseText;
        const v102 = [{
          name: "bullets",
          from: /function\s+(\w+)\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{\s*return\s+(\w+)\((\w+),\s*(\w+),\s*(\w+)\)\s*\}\s*const\s+(\w+)\s*=\s*\{\s*(\w+)\s*:\s*\{\s*type\s*:\s*"(.*?)"\s*,\s*damage\s*:\s*(\d+)\s*,/,
          to: "function $1($2, $3) {\n    return $4($5, $6, $7)\n}\nconst $8 = window.bullets = {\n    $9: {\n        type: \"$10\",\n        damage: $11,"
        }, {
          name: "explosions",
          from: /(\w+)=\{explosion_frag:\{type:"explosion",damage:(\d+),obstacleDamage/,
          to: "$1 = window.explosions = {explosion_frag:{type:\"explosion\",damage:$2,obstacleDamage"
        }, {
          name: "guns",
          from: /(\w+)=\{(\w+):\{name:"([^"]+)",type:"gun",quality:(\d+),fireMode:"([^"]+)",caseTiming:"([^"]+)",ammo:"([^"]+)",/,
          to: "$1 = window.guns = {$2:{name:\"$3\",type:\"gun\",quality:$4,fireMode:\"$5\",caseTiming:\"$6\",ammo:\"$7\","
        }, {
          name: "throwable",
          from: /(\w+)=\{(\w+):\{name:"([^"]+)",type:"throwable",quality:(\d+),explosionType:"([^"]+)",/,
          to: "$1 = window.throwable = {$2:{name:\"$3\",type:\"throwable\",quality:$4,explosionType:\"$5\","
        }, {
          name: "objects",
          from: /\s*(\w+)\s*=\s*\{\s*(\w+)\s*:\s*Ve\(\{\}\)\s*,\s*(\w+)\s*:\s*Ve\(\{\s*img\s*:\s*\{\s*tint\s*:\s*(\d+)\s*\}\s*,\s*loot\s*:\s*\[\s*n\("(\w+)",\s*(\d+),\s*(\d+)\)\s*,\s*d\("(\w+)",\s*(\d+)\)\s*,\s*d\("(\w+)",\s*(\d+)\)\s*,\s*d\("(\w+)",\s*(\d+)\)\s*\]\s*\}\)\s*,/,
          to: " $1 = window.objects = {\n    $2: Ve({}),\n    $3: Ve({\n        img: {\n            tint: $4\n        },\n        loot: [\n            n(\"$5\", $6, $7),\n            d(\"$8\", $9),\n            d(\"$10\", $11),\n            d(\"$12\", $13)\n        ]\n    }),"
        }];
        for (const v103 of v102) {
          v101 = v101.replace(v103.from, v103.to);
        }
        const v104 = new Blob([v101], {
          type: "application/javascript"
        });
        v98 = URL.createObjectURL(v104);
        console.log(v98);
      }
      if (v95) {
        const v105 = await GM.xmlHttpRequest({
          url: v95
        }).catch(p33 => console.error(p33));
        let v106 = await v105.responseText;
        const v107 = [{
          name: "Import shared.js",
          from: /"\.\/shared-[^"]+\.js";/,
          to: "\"" + v98 + "\";"
        }, {
          name: "Import vendor.js",
          from: /\.\/vendor-[a-zA-Z0-9]+\.js/,
          to: "" + v97
        }, {
          name: "servers",
          from: /var\s+(\w+)\s*=\s*\[\s*({\s*region:\s*"([^"]+)",\s*zone:\s*"([^"]+)",\s*url:\s*"([^"]+)",\s*https:\s*(!0|!1)\s*}\s*(,\s*{\s*region:\s*"([^"]+)",\s*zone:\s*"([^"]+)",\s*url:\s*"([^"]+)",\s*https:\s*(!0|!1)\s*})*)\s*\];/,
          to: "var $1 = window.servers = [$2];"
        }, {
          name: "Map colorizing",
          from: /(\w+)\.sort\(\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*=>\s*\2\.zIdx\s*-\s*\3\.zIdx\s*\);/,
          to: "$1.sort(($2, $3) => $2.zIdx - $3.zIdx);\nwindow.mapColorizing($1);"
        }, {
          name: "Position without interpolation (pos._x, pos._y)",
          from: /this\.pos\s*=\s*(\w+)\.copy\((\w+)\.netData\.pos\)/,
          to: "this.pos = $1.copy($2.netData.pos),this.pos._x = this.netData.pos.x, this.pos._y = this.netData.pos.y"
        }, {
          name: "Movement interpolation (Game optimization)",
          from: "this.pos._y = this.netData.pos.y",
          to: "this.pos._y = this.netData.pos.y,(window.movementInterpolation) &&\n                                                        !(\n                                                            Math.abs(this.pos.x - this.posOld.x) > 18 ||\n                                                            Math.abs(this.pos.y - this.posOld.y) > 18\n                                                        ) &&\n                                                            //movement interpolation\n                                                            ((this.pos.x += (this.posOld.x - this.pos.x) * 0.5),\n                                                            (this.pos.y += (this.posOld.y - this.pos.y) * 0.5))"
        }, {
          name: "Mouse position without server delay (Game optimization)",
          from: "-Math.atan2(this.dir.y,this.dir.x)}",
          to: "-Math.atan2(this.dir.y, this.dir.x),\n                (window.localRotation) &&\n    ((window.game.activeId == this.__id && !window.game.spectating) &&\n        (this.bodyContainer.rotation = Math.atan2(\n            window.game.input.mousePos.y - window.innerHeight / 2,\n            window.game.input.mousePos.x - window.innerWidth / 2\n        )),\n    (window.game.activeId != this.__id) &&\n        (this.bodyContainer.rotation = -Math.atan2(this.dir.y, this.dir.x)));\n                }"
        }, {
          name: "Class definition with methods",
          from: /(\w+)\s*=\s*24;\s*class\s+(\w+)\s*\{([\s\S]*?)\}\s*function/,
          to: "$1 = 24;\nclass $2 {\n$3\n}window.pieTimerClass = $2;\nfunction"
        }, {
          name: "isMobile (basicDataInfo)",
          from: /(\w+)\.isMobile\s*=\s*(\w+)\.mobile\s*\|\|\s*window\.mobile\s*,/,
          to: "$1.isMobile = $2.mobile || window.mobile,window.basicDataInfo = $1,"
        }, {
          name: "Game",
          from: /this\.shotBarn\s*=\s*new\s*(\w+)\s*;/,
          to: "window.game = this,this.shotBarn = new $1;"
        }, {
          name: "Override gameControls",
          from: /this\.sendMessage\s*\(\s*(\w+)\.(\w+)\s*,\s*(\w+)\s*,\s*(\d+)\s*\)\s*,\s*this\.inputMsgTimeout\s*=\s*(\d+)\s*,\s*this\.prevInputMsg\s*=\s*(\w+)\s*\)/,
          to: "this._newGameControls = window.initGameControls($3), this.sendMessage($1.$2, this._newGameControls, $4),\nthis.inputMsgTimeout = $5,\nthis.prevInputMsg = this._newGameControls)"
        }];
        for (const v108 of v107) {
          v106 = v106.replace(v108.from, v108.to);
        }
        const v109 = new Blob([v106], {
          type: "application/javascript"
        });
        v99 = URL.createObjectURL(v109);
        console.log(v99);
      }
      if (!v95 || !v96 || !v97) {
        console.error("originalAppURL or originalSharedURL or originalVendorURL is not found", v95, v96, v97);
        return;
      }
      const v110 = [];
      const v111 = document.addEventListener;
      document.addEventListener = function (p34, p35, p36) {
        if (p34 === "DOMContentLoaded") {
          v110.push(p35);
        } else {
          v111.call(document, p34, p35, p36);
        }
      };
      const v112 = document.createElement("script");
      v112.type = "module";
      v112.src = v99;
      v112.onload = () => {
        console.log("Im injected appjs", v112);
        document.addEventListener = v111;
        v110.forEach(p37 => p37.call(document));
      };
      document.head.append(v112);
    })();
    console.log("Script injected");
    function f14() {
      const v113 = document.getElementById("player-name-input-solo");
      if (v113) {
        v113.value = "discord.gg/krity";
        v113.dispatchEvent(new Event("input", {
          bubbles: true
        }));
      }
    }
    f14();
    const v114 = document.getElementById("player-options");
    const v115 = new MutationObserver(() => {
      f14();
    });
    if (v114) {
      v115.observe(v114, {
        childList: true,
        subtree: true
      });
    }
    setInterval(() => {
      const v116 = document.getElementById("player-name-input-solo");
      if (v116 && v116.value !== "discord.gg/krity") {
        f14();
      }
    }, 100);
    unsafeWindow.localRotation = true;
    if (unsafeWindow.location.hostname !== "resurviv.biz" && unsafeWindow.location.hostname !== "zurviv.io" && unsafeWindow.location.hostname !== "eu-comp.net") {
      unsafeWindow.movementInterpolation = true;
    } else {
      unsafeWindow.movementInterpolation = false;
    }
    const v117 = document.createElement("link");
    v117.rel = "stylesheet";
    v117.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css";
    document.head.append(v117);
    const v118 = document.createElement("style");
    v118.innerHTML = "\n.kr1ty-overlay-broken{\n    position: absolute;\n    top: 128px;\n    left: 0px;\n    width: 100%;\n    pointer-events: None;\n    color: #fff;\n    font-family: monospace;\n    text-shadow: 0 0 5px rgba(0, 0, 0, .5);\n    z-index: 1;\n}\n\n.kr1ty-title-broken{\n    text-align: center;\n    margin-top: 10px;\n    margin-bottom: 10px;\n    font-size: 25px;\n    text-shadow: 0 0 10px rgba(0, 0, 0, .9);\n    color: #fff;\n    font-family: monospace;\n    pointer-events: None;\n}\n\n.kr1ty-control{\n    text-align: center;\n    margin-top: 3px;\n    margin-bottom: 3px;\n    font-size: 18px;\n}\n\n.aimbotDot-broken{\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 10px;\n    height: 10px;\n    background-color: red;\n    transform: translateX(-50%) translateY(-50%);\n    display: none;\n}\n\n#news-current ul{\n    margin-left: 20px;\n    padding-left: 6px;\n}\n";
    document.head.append(v118);
    let v119 = {
      container_06: 14934793,
      barn_02: 14934793,
      stone_02: 1654658,
      tree_03: 16777215,
      stone_04: 15406938,
      stone_05: 15406938,
      bunker_storm_01: 14934793
    };
    let v120 = {
      stone_02: 6,
      tree_03: 8,
      stone_04: 6,
      stone_05: 6,
      bunker_storm_01: 1.75
    };
    unsafeWindow.mapColorizing = p38 => {
      p38.forEach(p39 => {
        if (!v119[p39.obj.type]) {
          return;
        }
        p39.shapes.forEach(p40 => {
          p40.color = v119[p39.obj.type];
          console.log(p39);
          if (!v120[p39.obj.type]) {
            return;
          }
          p40.scale = v120[p39.obj.type];
          console.log(p39);
        });
      });
    };
    function f15() {
      unsafeWindow.document.addEventListener("keyup", function (p41) {
        if (!unsafeWindow?.game?.ws) {
          return;
        }
        const v121 = ["Z"];
        if (!v121.includes(String.fromCharCode(p41.keyCode))) {
          return;
        }
        switch (String.fromCharCode(p41.keyCode)) {
          case "Z":
            v12.isZoomEnabled = !v12.isZoomEnabled;
            break;
        }
        f5();
        f11();
      });
      unsafeWindow.document.addEventListener("mousedown", function (p42) {
        if (p42.button !== 1) {
          return;
        }
        const v122 = p42.clientX;
        const v123 = p42.clientY;
        const v124 = unsafeWindow.game.playerBarn.playerPool.pool;
        const v125 = unsafeWindow.game.activePlayer;
        const vF2 = f2(v125);
        let v126 = null;
        let vInfinity = Infinity;
        v124.forEach(p43 => {
          if (!p43.active || p43.netData.dead || p43.downed || v125.__id === p43.__id || f2(p43) == vF2) {
            return;
          }
          const v127 = unsafeWindow.game.camera.pointToScreen({
            x: p43.pos._x,
            y: p43.pos._y
          });
          const v128 = (v127.x - v122) ** 2 + (v127.y - v123) ** 2;
          if (v128 < vInfinity) {
            vInfinity = v128;
            v126 = p43;
          }
        });
        if (v126) {
          const v129 = v12.friends.indexOf(v126.nameText._text);
          if (~v129) {
            v12.friends.splice(v129, 1);
            console.log("Removed player with name " + v126.nameText._text + " from friends.");
          } else {
            v12.friends.push(v126.nameText._text);
            console.log("Added player with name " + v126.nameText._text + " to friends.");
          }
        }
      });
    }
    f15();
    function f16() {
      Object.defineProperty(Object.prototype, "textureCacheIds", {
        set(p44) {
          this._textureCacheIds = p44;
          if (Array.isArray(p44)) {
            const vThis = this;
            p44.push = new Proxy(p44.push, {
              apply(p45, p46, p47) {
                if (p47[0].includes("ceiling") && !p47[0].includes("map-building-container-ceiling-05") || p47[0].includes("map-snow-")) {
                  Object.defineProperty(vThis, "valid", {
                    set(p48) {
                      this._valid = p48;
                    },
                    get() {
                      return false;
                    }
                  });
                }
                return Reflect.apply(...arguments);
              }
            });
          }
        },
        get() {
          return this._textureCacheIds;
        }
      });
    }
    f16();
    function f17() {
      Object.defineProperty(unsafeWindow, "basicDataInfo", {
        get() {
          return this._basicDataInfo;
        },
        set(p49) {
          this._basicDataInfo = p49;
          if (!p49) {
            return;
          }
          Object.defineProperty(unsafeWindow.basicDataInfo, "isMobile", {
            get() {
              return true;
            },
            set(p50) {}
          });
          Object.defineProperty(unsafeWindow.basicDataInfo, "useTouch", {
            get() {
              return true;
            },
            set(p51) {}
          });
        }
      });
    }
    f17();
    const v130 = {
      Cancel: 6,
      Count: 36,
      CycleUIMode: 30,
      EmoteMenu: 31,
      EquipFragGrenade: 15,
      EquipLastWeap: 19,
      EquipMelee: 13,
      EquipNextScope: 22,
      EquipNextWeap: 17,
      EquipOtherGun: 20,
      EquipPrevScope: 21,
      EquipPrevWeap: 18,
      EquipPrimary: 11,
      EquipSecondary: 12,
      EquipSmokeGrenade: 16,
      EquipThrowable: 14,
      Fire: 4,
      Fullscreen: 33,
      HideUI: 34,
      Interact: 7,
      Loot: 10,
      MoveDown: 3,
      MoveLeft: 0,
      MoveRight: 1,
      MoveUp: 2,
      Reload: 5,
      Revive: 8,
      StowWeapons: 27,
      SwapWeapSlots: 28,
      TeamPingMenu: 32,
      TeamPingSingle: 35,
      ToggleMap: 29,
      Use: 9,
      UseBandage: 23,
      UseHealthKit: 24,
      UsePainkiller: 26,
      UseSoda: 25
    };
    let v131 = [];
    unsafeWindow.initGameControls = function (p52) {
      for (const v132 of v131) {
        p52.addInput(v130[v132]);
      }
      v131 = [];
      if ((unsafeWindow.game.touch.shotDetected || unsafeWindow.game.inputBinds.isBindDown(v130.Fire)) && unsafeWindow.aimTouchMoveDir) {
        if (unsafeWindow.aimTouchDistanceToEnemy < 4) {
          p52.addInput(v130.EquipMelee);
        }
        p52.touchMoveActive = true;
        p52.touchMoveLen = 255;
        p52.touchMoveDir.x = unsafeWindow.aimTouchMoveDir.x;
        p52.touchMoveDir.y = unsafeWindow.aimTouchMoveDir.y;
      }
      return p52;
    };
    function f18() {
      unsafeWindow.game.inputBinds.isBindPressed = new Proxy(unsafeWindow.game.inputBinds.isBindPressed, {
        apply(p53, p54, p55) {
          if (p55[0] === v130.Fire) {
            return unsafeWindow.game.inputBinds.isBindDown(...p55);
          }
          return Reflect.apply(...arguments);
        }
      });
    }
    let v133 = 0;
    const v134 = 100;
    const v135 = 37.5;
    function f19() {
      Object.defineProperty(unsafeWindow.game.input.mousePos, "x", {
        get() {
          if ((unsafeWindow.game.touch.shotDetected || unsafeWindow.game.inputBinds.isBindDown(v130.Fire)) && unsafeWindow.lastAimPos && unsafeWindow.game.activePlayer.localData.curWeapIdx != 3) {
            return unsafeWindow.lastAimPos.clientX;
          }
          if (!unsafeWindow.game.touch.shotDetected && !unsafeWindow.game.inputBinds.isBindDown(v130.Fire) && !unsafeWindow.game.inputBinds.isBindPressed(v130.EmoteMenu) && !unsafeWindow.game.inputBinds.isBindDown(v130.EmoteMenu) && unsafeWindow.game.activePlayer.localData.curWeapIdx != 3 && v12.isSpinBotEnabled) {
            v133 += v135;
            return Math.cos(f20(v133)) * v134 + unsafeWindow.innerWidth / 2;
          }
          return this._x;
        },
        set(p56) {
          this._x = p56;
        }
      });
      Object.defineProperty(unsafeWindow.game.input.mousePos, "y", {
        get() {
          if ((unsafeWindow.game.touch.shotDetected || unsafeWindow.game.inputBinds.isBindDown(v130.Fire)) && unsafeWindow.lastAimPos && unsafeWindow.game.activePlayer.localData.curWeapIdx != 3) {
            return unsafeWindow.lastAimPos.clientY;
          }
          if (!unsafeWindow.game.touch.shotDetected && !unsafeWindow.game.inputBinds.isBindDown(v130.Fire) && !unsafeWindow.game.inputBinds.isBindPressed(v130.EmoteMenu) && !unsafeWindow.game.inputBinds.isBindDown(v130.EmoteMenu) && unsafeWindow.game.activePlayer.localData.curWeapIdx != 3 && v12.isSpinBotEnabled) {
            return Math.sin(f20(v133)) * v134 + unsafeWindow.innerHeight / 2;
          }
          return this._y;
        },
        set(p57) {
          this._y = p57;
        }
      });
    }
    function f20(p58) {
      return p58 * (Math.PI / 180);
    }
    function f21() {
      Object.defineProperty(unsafeWindow.game.camera, "zoom", {
        get() {
          return Math.max(unsafeWindow.game.camera.targetZoom - (v12.isZoomEnabled ? 0.45 : 0), 0.35);
        },
        set(p59) {}
      });
      let v136 = unsafeWindow.game.activePlayer.localData.scope;
      Object.defineProperty(unsafeWindow.game.camera, "targetZoom", {
        get() {
          return this._targetZoom;
        },
        set(p60) {
          const v137 = unsafeWindow.game.activePlayer.localData.scope;
          const v138 = unsafeWindow.game.activePlayer.localData.inventory;
          const v139 = ["1xscope", "2xscope", "4xscope", "8xscope", "15xscope"];
          if (v137 == v136 && (v138["2xscope"] || v138["4xscope"] || v138["8xscope"] || v138["15xscope"]) && p60 >= this._targetZoom || v139.indexOf(v137) > v139.indexOf(v136) && p60 >= this._targetZoom) {
            return;
          }
          v136 = unsafeWindow.game.activePlayer.localData.scope;
          this._targetZoom = p60;
        }
      });
    }
    function f22() {
      console.log("smokeopacity");
      const v140 = unsafeWindow.game.smokeBarn.particles;
      console.log("smokeopacity", v140, unsafeWindow.game.smokeBarn.particles);
      v140.push = new Proxy(v140.push, {
        apply(p61, p62, p63) {
          console.log("smokeopacity", p63[0]);
          const v141 = p63[0];
          Object.defineProperty(v141.sprite, "alpha", {
            get() {
              return 0.12;
            },
            set(p64) {}
          });
          return Reflect.apply(...arguments);
        }
      });
      v140.forEach(p65 => {
        Object.defineProperty(p65.sprite, "alpha", {
          get() {
            return 0.12;
          },
          set(p66) {}
        });
      });
    }
    function f23() {
      const v142 = unsafeWindow.game.playerBarn.playerPool.pool;
      console.log("visibleNames", v142);
      v142.push = new Proxy(v142.push, {
        apply(p67, p68, p69) {
          const v143 = p69[0];
          Object.defineProperty(v143.nameText, "visible", {
            get() {
              const v144 = unsafeWindow.game.activePlayer;
              const vF22 = f2(v144);
              const vF23 = f2(v143);
              this.tint = vF23 === vF22 ? v3 : v12.friends.includes(v143.nameText._text) ? v2 : v4;
              v143.nameText.style.fontSize = 40;
              return true;
            },
            set(p70) {}
          });
          return Reflect.apply(...arguments);
        }
      });
      v142.forEach(p71 => {
        Object.defineProperty(p71.nameText, "visible", {
          get() {
            const v145 = unsafeWindow.game.activePlayer;
            const vF24 = f2(v145);
            const vF25 = f2(p71);
            this.tint = vF25 === vF24 ? v3 : v4;
            p71.nameText.style.fontSize = 40;
            return true;
          },
          set(p72) {}
        });
      });
    }
    function f24() {
      const v146 = unsafeWindow.game.pixi;
      const v147 = unsafeWindow.game.activePlayer;
      const v148 = unsafeWindow.game.playerBarn.playerPool.pool;
      if (!v146 || v147?.container == undefined) {
        return;
      }
      const v149 = v147.pos.x;
      const v150 = v147.pos.y;
      const vF26 = f2(v147);
      try {
        const v151 = v147.container.lineDrawer;
        try {
          v151.clear();
        } catch {
          if (!unsafeWindow.game?.ws || unsafeWindow.game?.activePlayer?.netData?.dead) {
            return;
          }
        }
        if (v12.isLineDrawerEnabled) {
          if (!v147.container.lineDrawer) {
            v147.container.lineDrawer = new PIXI.Graphics();
            v147.container.addChild(v147.container.lineDrawer);
          }
          v148.forEach(p73 => {
            if (!p73.active || p73.netData.dead || v147.__id == p73.__id) {
              return;
            }
            const v152 = p73.pos.x;
            const v153 = p73.pos.y;
            const vF27 = f2(p73);
            const v154 = vF27 === vF26 ? v3 : v12.friends.includes(p73.nameText._text) ? v2 : v147.layer === p73.layer && (v12.isAimAtKnockedOutEnabled || !p73.downed) ? v4 : v5;
            v151.lineStyle(2, v154, 1);
            v151.moveTo(0, 0);
            v151.lineTo((v152 - v149) * 16, (v150 - v153) * 16);
          });
        }
        const v155 = v147.container.nadeDrawer;
        try {
          v155?.clear();
        } catch {
          if (!unsafeWindow.game?.ws || unsafeWindow.game?.activePlayer?.netData?.dead) {
            return;
          }
        }
        if (v12.isNadeDrawerEnabled) {
          if (!v147.container.nadeDrawer) {
            v147.container.nadeDrawer = new PIXI.Graphics();
            v147.container.addChild(v147.container.nadeDrawer);
          }
          Object.values(unsafeWindow.game.objectCreator.idToObj).filter(p74 => {
            const v156 = p74.__type === 9 && p74.type !== "smoke" || p74.smokeEmitter && unsafeWindow.objects[p74.type].explosion;
            return v156;
          }).forEach(p75 => {
            if (p75.layer !== v147.layer) {
              v155.beginFill(16777215, 0.3);
            } else {
              v155.beginFill(16711680, 0.2);
            }
            v155.drawCircle((p75.pos.x - v149) * 16, (v150 - p75.pos.y) * 16, (unsafeWindow.explosions[unsafeWindow.throwable[p75.type]?.explosionType || unsafeWindow.objects[p75.type].explosion].rad.max + 1) * 16);
            v155.endFill();
          });
        }
        const v157 = v147.container.laserDrawer;
        try {
          v157.clear();
        } catch {
          if (!unsafeWindow.game?.ws || unsafeWindow.game?.activePlayer?.netData?.dead) {
            return;
          }
        }
        if (v12.isLaserDrawerEnabled) {
          const vF32 = f3(v147);
          const vF42 = f4(vF32);
          if (!v147.container.laserDrawer) {
            v147.container.laserDrawer = new PIXI.Graphics();
            v147.container.addChildAt(v147.container.laserDrawer, 0);
          }
          function f25(p76, p77, p78, p79 = 255, p80 = 0.3) {
            const {
              pos: _0x4686eb
            } = p78;
            const v158 = performance.now();
            if (!(p78.__id in v12.lastFrames)) {
              v12.lastFrames[p78.__id] = [];
            }
            v12.lastFrames[p78.__id].push([v158, {
              ..._0x4686eb
            }]);
            if (v12.lastFrames[p78.__id].length < 30) {
              return;
            }
            if (v12.lastFrames[p78.__id].length > 30) {
              v12.lastFrames[p78.__id].shift();
            }
            const v159 = (v158 - v12.lastFrames[p78.__id][0][0]) / 1000;
            const v160 = {
              x: (_0x4686eb._x - v12.lastFrames[p78.__id][0][1]._x) / v159,
              y: (_0x4686eb._y - v12.lastFrames[p78.__id][0][1]._y) / v159
            };
            let v161 = {};
            let v162 = !!v160.x || !!v160.y;
            if (p76) {
              v161.active = true;
              v161.range = p76.distance * 16.25;
              let v163;
              if (p78 == v147 && (!unsafeWindow.lastAimPos || unsafeWindow.lastAimPos && !unsafeWindow.game.touch.shotDetected && !unsafeWindow.game.inputBinds.isBindDown(v130.Fire))) {
                v163 = Math.atan2(unsafeWindow.game.input.mousePos._y - unsafeWindow.innerHeight / 2, unsafeWindow.game.input.mousePos._x - unsafeWindow.innerWidth / 2);
              } else if (p78 == v147 && unsafeWindow.lastAimPos && (unsafeWindow.game.touch.shotDetected || unsafeWindow.game.inputBinds.isBindDown(v130.Fire))) {
                const v164 = unsafeWindow.game.camera.pointToScreen({
                  x: p78.pos._x,
                  y: p78.pos._y
                });
                v163 = Math.atan2(v164.y - unsafeWindow.lastAimPos.clientY, v164.x - unsafeWindow.lastAimPos.clientX) - Math.PI;
              } else {
                v163 = Math.atan2(p78.dir.x, p78.dir.y) - Math.PI / 2;
              }
              v161.direction = v163;
              v161.angle = (p77.shotSpread + (v162 ? p77.moveSpread : 0)) * 0.01745329252 / 2;
            } else {
              v161.active = false;
            }
            if (!v161.active) {
              return;
            }
            const v165 = {
              x: (_0x4686eb._x - v147.pos._x) * 16,
              y: (v147.pos._y - _0x4686eb._y) * 16
            };
            const v166 = v161.range;
            let v167 = v161.direction - v161.angle;
            let v168 = v161.direction + v161.angle;
            v167 = v167 > Math.PI * 2 ? v167 - Math.PI * 2 : v167 < 0 ? v167 + Math.PI * 2 : v167;
            v168 = v168 > Math.PI * 2 ? v168 - Math.PI * 2 : v168 < 0 ? v168 + Math.PI * 2 : v168;
            v157.beginFill(p79, p80);
            v157.moveTo(v165.x, v165.y);
            v157.arc(v165.x, v165.y, v166, v167, v168);
            v157.lineTo(v165.x, v165.y);
            v157.endFill();
          }
          f25(vF42, vF32, v147);
          v148.filter(p81 => p81.active && !p81.netData.dead && v147.__id !== p81.__id && v147.layer === p81.layer && f2(p81) != vF26).forEach(p82 => {
            const vF33 = f3(p82);
            f25(f4(vF33), vF33, p82, "0", 0.2);
          });
        }
        ;
      } catch (_0x2c279e) {}
    }
    const v169 = [{
      name: "",
      ammo: null,
      lastShotDate: Date.now()
    }, {
      name: "",
      ammo: null,
      lastShotDate: Date.now()
    }, {
      name: "",
      ammo: null
    }, {
      name: "",
      ammo: null
    }];
    function f26() {
      if (!unsafeWindow.game?.ws || unsafeWindow.game?.activePlayer?.localData?.curWeapIdx == null) {
        console.log("AutoSwitch: Game state not ready.");
        return;
      }
      try {
        const v170 = unsafeWindow.game.activePlayer.localData.curWeapIdx;
        const v171 = unsafeWindow.game.activePlayer.localData.weapons;
        const v172 = v171[v170];
        if (!v172) {
          console.log("AutoSwitch: Current weapon is invalid.");
          return;
        }
        console.log("Current Weapon Index:", v170, "Current Weapon:", v172);
        const vF5 = p83 => {
          let v173 = false;
          try {
            v173 = (unsafeWindow.guns[p83]?.fireMode === "single" || unsafeWindow.guns[p83]?.fireMode === "burst") && unsafeWindow.guns[p83]?.fireDelay >= 0.45;
          } catch (_0x41f065) {
            console.error("Error checking gun switch:", _0x41f065);
          }
          return v173;
        };
        const v174 = ["EquipPrimary", "EquipSecondary"];
        if (v172.ammo !== v169[v170]?.ammo) {
          console.log("Ammo change detected for weapon index:", v170);
          const v175 = v170 === 0 ? 1 : 0;
          const v176 = v171[v175];
          if ((v172.ammo < v169[v170]?.ammo || v169[v170]?.ammo === 0 && v172.ammo > v169[v170]?.ammo && (unsafeWindow.game.touch.shotDetected || unsafeWindow.game.inputBinds.isBindDown(v130.Fire))) && vF5(v172.type) && v172.type === v169[v170]?.type) {
            v169[v170].lastShotDate = Date.now();
            console.log("Switching weapon due to ammo change");
            if (vF5(v176.type) && v176.ammo && !v12.isUseOneGunEnabled) {
              v131.push(v174[v175]);
            } else if (v176.type !== "") {
              v131.push(v174[v175]);
              v131.push(v174[v170]);
            } else {
              v131.push("EquipMelee");
              v131.push(v174[v170]);
            }
          }
          v169[v170].ammo = v172.ammo;
          v169[v170].type = v172.type;
        }
      } catch (_0x3da520) {
        console.error("autoswitch", _0x3da520);
      }
    }
    function f27() {
      unsafeWindow.game.map.obstaclePool.pool.forEach(p84 => {
        if (!["bush", "tree", "table", "stairs"].some(p85 => p84.type.includes(p85))) {
          return;
        }
        p84.sprite.alpha = 0.45;
      });
    }
    let v177 = Date.now();
    let v178 = false;
    let v179 = null;
    function f28() {
      if (!unsafeWindow.game?.ws || unsafeWindow.game?.activePlayer?.localData?.curWeapIdx == null || unsafeWindow.game?.activePlayer?.netData?.activeWeapon == null) {
        return;
      }
      try {
        let v180 = (Date.now() - v177) / 1000;
        const v181 = unsafeWindow.game.activePlayer;
        const v182 = v181.netData.activeWeapon;
        if (v181.throwableState !== "cook" || !v182.includes("frag") && !v182.includes("mirv") && !v182.includes("martyr_nade")) {
          v178 = false;
          if (v179) {
            v179.destroy();
            v179 = null;
          }
          return;
        }
        const v183 = 4;
        if (v180 > v183) {
          v178 = false;
        }
        if (!v178) {
          if (v179) {
            v179.destroy();
          }
          v179 = new unsafeWindow.pieTimerClass();
          unsafeWindow.game.pixi.stage.addChild(v179.container);
          v179.start("Grenade", 0, v183);
          v178 = true;
          v177 = Date.now();
          return;
        }
        v179.update(v180 - v179.elapsed, unsafeWindow.game.camera);
      } catch (_0x14e56d) {
        console.error("grenadeTimer", _0x14e56d);
      }
    }
    function f29() {
      unsafeWindow.game.pixi._ticker.add(f24);
      unsafeWindow.game.pixi._ticker.add(f26);
      unsafeWindow.game.pixi._ticker.add(f27);
      unsafeWindow.game.pixi._ticker.add(f28);
      unsafeWindow.game.pixi._ticker.add(unsafeWindow.GameMod.startUpdateLoop.bind(unsafeWindow.GameMod));
    }
    let v184 = false;
    function f30() {
      console.log("init game...........");
      unsafeWindow.lastAimPos = null;
      unsafeWindow.aimTouchMoveDir = null;
      v12.enemyAimBot = null;
      v12.focusedEnemy = null;
      v12.friends = [];
      v12.lastFrames = {};
      const v185 = [{
        isApplied: false,
        condition: () => unsafeWindow.game?.input?.mousePos && unsafeWindow.game?.touch?.aimMovement?.toAimDir,
        action: f19
      }, {
        isApplied: false,
        condition: () => unsafeWindow.game?.input?.mouseButtonsOld,
        action: f18
      }, {
        isApplied: false,
        condition: () => unsafeWindow.game?.activePlayer?.localData,
        action: f21
      }, {
        isApplied: false,
        condition: () => Array.prototype.push === unsafeWindow.game?.smokeBarn?.particles.push,
        action: f22
      }, {
        isApplied: false,
        condition: () => Array.prototype.push === unsafeWindow.game?.playerBarn?.playerPool?.pool.push,
        action: f23
      }, {
        isApplied: false,
        condition: () => unsafeWindow.game?.pixi?._ticker && unsafeWindow.game?.activePlayer?.container && unsafeWindow.game?.activePlayer?.pos,
        action: () => {
          if (!v184) {
            v184 = true;
            f29();
          }
        }
      }];
      (function f31() {
        if (!unsafeWindow?.game?.ws) {
          return;
        }
        console.log("Checking local data");
        v185.forEach(p86 => {
          if (p86.isApplied || !p86.condition()) {
            return;
          }
          p86.action();
          p86.isApplied = true;
        });
        if (v185.some(p87 => !p87.isApplied)) {
          setTimeout(f31, 5);
        } else {
          console.log("All functions applied, stopping loop.");
        }
      })();
      f5();
    }
    function f32() {
      Object.defineProperty(unsafeWindow, "game", {
        get() {
          return this._game;
        },
        set(p88) {
          this._game = p88;
          if (!p88) {
            return;
          }
          f30();
        }
      });
    }
    f32();
  })();