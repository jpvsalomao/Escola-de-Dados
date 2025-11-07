import type { PackSchema, Challenge } from "./types";
import { loadParquet } from "./duck";
import { config } from "./config";

/**
 * Load a pack from a URL or path
 */
export async function loadPack(packPath: string): Promise<PackSchema> {
  const response = await fetch(`${packPath}/pack.json`);
  if (!response.ok) {
    throw new Error(`Failed to load pack from ${packPath}`);
  }
  const pack: PackSchema = await response.json();

  // Validate schema version (support v1.1 and v1.2)
  const supportedVersions = ["1.1", "1.2"];
  if (!supportedVersions.includes(pack.schema_version)) {
    throw new Error(`Unsupported pack schema version: ${pack.schema_version}`);
  }

  // Validate app version
  const minVersion = pack.min_app_version;
  const currentVersion = "1.0.0";
  if (!isVersionCompatible(currentVersion, minVersion)) {
    throw new Error(`Pack requires app version ${minVersion} or higher`);
  }

  return pack;
}

/**
 * Load all datasets from a pack into DuckDB
 */
export async function loadPackDatasets(packPath: string, pack: PackSchema): Promise<void> {
  for (const dataset of pack.datasets) {
    const datasetUrl = `${packPath}/${dataset.src}`;

    // Check file size if possible
    try {
      const response = await fetch(datasetUrl, { method: "HEAD" });
      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > config.limits.maxBytesPerDataset) {
        throw new Error(
          `Dataset ${dataset.name} exceeds size limit of ${config.limits.maxBytesPerDataset} bytes`
        );
      }
    } catch (e) {
      console.warn(`Could not check size for ${dataset.name}:`, e);
    }

    await loadParquet(dataset.name, datasetUrl);
  }
}

/**
 * Get all available packs
 */
export async function getAvailablePacks(): Promise<Array<{ id: string; path: string }>> {
  // For v1, we have a hardcoded list of packs
  // In future versions, this could be dynamic
  return [
    { id: "pack_basics", path: "/packs/pack_basics" },
    { id: "pack_intermediate", path: "/packs/pack_intermediate" },
  ];
}

/**
 * Get a specific challenge from a pack
 */
export function getChallengeById(pack: PackSchema, challengeId: string): Challenge | null {
  return pack.challenges.find((c) => c.id === challengeId) || null;
}

/**
 * Validate pack integrity (check dataset hashes)
 */
export async function validatePackIntegrity(
  packPath: string,
  pack: PackSchema
): Promise<boolean> {
  if (!pack.integrity || !pack.integrity.datasets) {
    return true; // No integrity check defined
  }

  for (const [filename, expectedHash] of Object.entries(pack.integrity.datasets)) {
    const datasetUrl = `${packPath}/${filename}`;
    const response = await fetch(datasetUrl);
    const buffer = await response.arrayBuffer();
    const hash = await computeSHA256(buffer);

    if (hash !== expectedHash) {
      console.error(`Integrity check failed for ${filename}`);
      return false;
    }
  }

  return true;
}

/**
 * Compute SHA-256 hash of a buffer
 */
async function computeSHA256(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Check if current version is compatible with minimum required version
 */
function isVersionCompatible(current: string, minimum: string): boolean {
  const currentParts = current.split(".").map(Number);
  const minimumParts = minimum.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (currentParts[i] > minimumParts[i]) return true;
    if (currentParts[i] < minimumParts[i]) return false;
  }

  return true; // Equal versions
}
