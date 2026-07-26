/**
 * Utility helper for triggering haptic feedback (vibration) on mobile devices
 * and supporting web browsers.
 */

export const triggerHaptic = (pattern: number | number[] = 50) => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore errors on non-supported platforms or permissions
    }
  }
};

/**
 * Haptic feedback pattern when starting a work timer (distinct ascending double pulse)
 */
export const vibrateStartTimer = () => {
  triggerHaptic([60, 40, 100]);
};

/**
 * Haptic feedback pattern when stopping a work timer (solid double stop pulse)
 */
export const vibrateStopTimer = () => {
  triggerHaptic([100, 50, 120]);
};

/**
 * Haptic feedback pattern when submitting a critical damage report (strong triple warning pattern)
 */
export const vibrateSubmitDamage = () => {
  triggerHaptic([80, 40, 80, 40, 160]);
};

/**
 * Haptic feedback for voice recording start/stop
 */
export const vibrateRecordVoice = () => {
  triggerHaptic([50, 30, 50]);
};
