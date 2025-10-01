import { gameManager } from "@/utils/injector.js";
import { settings } from "@/state/settings.js";
import { tr } from '@/utils/obfuscatedNameTranslator.js';
import { reflect, ref_addEventListener, object } from "@/utils/hook.js";

export let isLayerHackActive = false;
export let originalLayerValue = null;
let originalLayerDescriptor = null;
let activePlayerRef = null;
let originalPlayerAlpha = 1.0;

function applyLayerSpoof(player, targetLayer) {
    if (!player || player.layer === undefined) return false;
    
    try {
        originalLayerDescriptor = object.getOwnPropertyDescriptor(player, 'layer');
        originalLayerValue = player.layer;

        if (!originalLayerDescriptor) {
            originalLayerDescriptor = { value: originalLayerValue, writable: true, enumerable: true, configurable: true };
        } else if (!originalLayerDescriptor.configurable) {
            originalLayerDescriptor = null;
            return false;
        }

        object.defineProperty(player, 'layer', {
            configurable: true,
            get() { return targetLayer; },
            set() {} 
        });
        return true;
    } catch (e) {
        originalLayerDescriptor = null;
        originalLayerValue = null;
        return false;
    }
}

function restoreOriginalLayer(player) {
    if (!player) return;

    try {
        if (originalLayerDescriptor) {
            object.defineProperty(player, 'layer', originalLayerDescriptor);

            if ('value' in originalLayerDescriptor && !originalLayerDescriptor.get && !originalLayerDescriptor.set) {
                player.layer = originalLayerValue;
            }
        } else if (originalLayerValue !== null) {
            player.layer = originalLayerValue;
        }
    } catch (e) {
        if (originalLayerValue !== null) {
            try { player.layer = originalLayerValue; } catch (e) {}
        }
    } finally {
        originalLayerDescriptor = null;
        originalLayerValue = null;
    }
}

function setPlayerAlpha(player, alpha) {
    if (player?.container) {
        try { player.container.alpha = alpha; } catch (e) {}
    }
}

function handleKeyDown(event) {
    if (event.code !== 'Space' || !settings.layerHack.enabled || isLayerHackActive) return;

    try {
        const player = gameManager.game?.[tr.activePlayer];
        if (!player || typeof player.layer === 'undefined' || !player.container) return;

        activePlayerRef = player;
        originalPlayerAlpha = player.container.alpha;
        
        const currentLayer = player.layer;
        const targetLayer = currentLayer === 0 ? 1 : 0;

        if (applyLayerSpoof(player, targetLayer)) {
            isLayerHackActive = true;
            setPlayerAlpha(player, 0.5);
        } else {
            activePlayerRef = null;
        }
    } catch (e) {
        cleanupHack();
    }
}

function handleKeyUp(event) {
    if (event.code !== 'Space' || !isLayerHackActive) return;
    cleanupHack();
}

function cleanupHack() {
    try {
        if (activePlayerRef) {
            restoreOriginalLayer(activePlayerRef);
            setPlayerAlpha(activePlayerRef, originalPlayerAlpha);
        }
    } catch (e) {
        if (activePlayerRef) {
            try { 
                restoreOriginalLayer(activePlayerRef);
                setPlayerAlpha(activePlayerRef, originalPlayerAlpha);
            } catch (e) {}
        }
    } finally {
        isLayerHackActive = false;
        activePlayerRef = null;
        originalPlayerAlpha = 1.0;
    }
}

export default function() {
    reflect.apply(ref_addEventListener, globalThis, ["keydown", handleKeyDown]);
    reflect.apply(ref_addEventListener, globalThis, ["keyup", handleKeyUp]);
}