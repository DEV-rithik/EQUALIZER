// ─── System EQ Plugin Bridge ─────────────────────────────────────────────────
// TypeScript wrapper for the native SystemEQ Capacitor plugin.
// Handles communication between the web layer and native Android EQ.

import { registerPlugin } from '@capacitor/core';
import type { EQGains } from '../types';
import { EQ_BANDS } from '../types';

// ─── Plugin interface ────────────────────────────────────────────────────────

interface SystemEQPluginInterface {
    initialize(): Promise<{
        success: boolean;
        numBands: number;
        minLevel: number;
        maxLevel: number;
        bands: Array<{
            index: number;
            centerFreq: number;
            lowFreq: number;
            highFreq: number;
        }>;
    }>;
    applyEQ(options: { gains: number[] }): Promise<{ success: boolean; applied: boolean }>;
    setEnabled(options: { enabled: boolean }): Promise<{ success: boolean; enabled: boolean }>;
    getStatus(): Promise<{
        initialized: boolean;
        enabled: boolean;
        numBands?: number;
        currentGains?: Array<{
            band: number;
            centerFreq: number;
            level: number;
        }>;
    }>;
    release(): Promise<{ success: boolean }>;
}

// ─── Register native plugin ──────────────────────────────────────────────────

const NativeSystemEQ = registerPlugin<SystemEQPluginInterface>('SystemEQ');

// ─── State ───────────────────────────────────────────────────────────────────

let deviceInfo: {
    numBands: number;
    minLevel: number;
    maxLevel: number;
} | null = null;

let currentlyApplied: EQGains | null = null;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Initialize the system-wide equalizer.
 * Must be called before applySystemEQ.
 */
export async function initializeSystemEQ(): Promise<{
    success: boolean;
    numBands: number;
    minLevel: number;
    maxLevel: number;
    error?: string;
}> {
    try {
        const result = await NativeSystemEQ.initialize();
        deviceInfo = {
            numBands: result.numBands,
            minLevel: result.minLevel,
            maxLevel: result.maxLevel,
        };
        console.log(`[SystemEQ] Initialized: ${result.numBands} bands, range ${result.minLevel} to ${result.maxLevel} dB`);
        return {
            success: true,
            numBands: result.numBands,
            minLevel: result.minLevel,
            maxLevel: result.maxLevel,
        };
    } catch (err: any) {
        console.error('[SystemEQ] Initialize failed:', err);
        return {
            success: false,
            numBands: 0,
            minLevel: 0,
            maxLevel: 0,
            error: err?.message || 'Unknown error',
        };
    }
}

/**
 * Apply EQ gains to the system-wide equalizer.
 * Takes our 10-band EQGains and sends them to the native plugin.
 */
export async function applySystemEQ(gains: EQGains): Promise<boolean> {
    try {
        // Convert EQGains object to ordered array
        const gainsArray = EQ_BANDS.map(band => gains[band]);

        const result = await NativeSystemEQ.applyEQ({ gains: gainsArray });
        if (result.success) {
            currentlyApplied = { ...gains };
            console.log('[SystemEQ] EQ applied successfully');
        }
        return result.success;
    } catch (err) {
        console.error('[SystemEQ] Apply failed:', err);
        return false;
    }
}

/**
 * Enable or disable the system EQ effect.
 */
export async function enableSystemEQ(enabled: boolean): Promise<boolean> {
    try {
        const result = await NativeSystemEQ.setEnabled({ enabled });
        if (!enabled) {
            currentlyApplied = null;
        }
        return result.success;
    } catch (err) {
        console.error('[SystemEQ] Toggle failed:', err);
        return false;
    }
}

/**
 * Get the current status of the system EQ.
 */
export async function getSystemEQStatus(): Promise<{
    initialized: boolean;
    enabled: boolean;
    numBands: number;
}> {
    try {
        const status = await NativeSystemEQ.getStatus();
        return {
            initialized: status.initialized,
            enabled: status.enabled,
            numBands: status.numBands ?? 0,
        };
    } catch {
        return { initialized: false, enabled: false, numBands: 0 };
    }
}

/**
 * Release the system EQ effect and clean up.
 */
export async function releaseSystemEQ(): Promise<void> {
    try {
        await NativeSystemEQ.release();
        deviceInfo = null;
        currentlyApplied = null;
        console.log('[SystemEQ] Released');
    } catch (err) {
        console.error('[SystemEQ] Release failed:', err);
    }
}

/**
 * Get currently applied EQ gains, if any.
 */
export function getCurrentAppliedEQ(): EQGains | null {
    return currentlyApplied;
}

/**
 * Get device EQ capability info.
 */
export function getDeviceEQInfo() {
    return deviceInfo;
}
