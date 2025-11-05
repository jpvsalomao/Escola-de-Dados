import { config } from "./config";

/**
 * Log a telemetry event (no-op if telemetry is disabled)
 */
export function logEvent(eventName: string, data?: Record<string, unknown>): void {
  if (!config.flags.enableTelemetry) return;

  // In v1, we just log to console
  // In future versions, this could send to an analytics service
  console.log(`[Telemetry] ${eventName}`, data);
}

/**
 * Log a challenge attempt
 */
export function logChallengeAttempt(
  packId: string,
  challengeId: string,
  success: boolean,
  elapsedMs: number
): void {
  logEvent("challenge_attempt", {
    packId,
    challengeId,
    success,
    elapsedMs,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log a pack load
 */
export function logPackLoad(packId: string): void {
  logEvent("pack_load", {
    packId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log an error
 */
export function logError(error: Error, context?: Record<string, unknown>): void {
  logEvent("error", {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}
