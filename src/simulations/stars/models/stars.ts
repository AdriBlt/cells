/**
 * All stars now have both an epoch and equinox of 2000.0. In v2 of the catalog, all three primary source catalogs either had or were adjusted to equinox 2000, but all 3 had different epochs, leading to small position errors at high magnifications.
 * The Flamsteed numbers now include many that were not in the Yale Bright Star Catalog, the primary reference for these numbers in the original catalog. In particular, it now contains all valid numbers listed in "Flamsteed's Missing Stars", M. Wagman, JHA xviii (1987), p 210-223.
 * Some errors in proper motions have been corrected.
 * A few additional proper names have been added.
 * For stars in Hipparcos that are known to be variable, the variable star designations have been added. In general, stars that were merely suspected of variability ("NSV") were excluded.
 *
 * Fields in the database:
 * - id: The database primary key.
 * - hip: The star's ID in the Hipparcos catalog, if known.
 * - hd: The star's ID in the Henry Draper catalog, if known.
 * - hr: The star's ID in the Harvard Revised catalog, which is the same as its number in the Yale Bright Star Catalog.
 * - gl: The star's ID in the third edition of the Gliese Catalog of Nearby Stars.
 * - bf: The Bayer / Flamsteed designation, primarily from the Fifth Edition of the Yale Bright Star Catalog. This is a combination of the two designations. The Flamsteed number, if present, is given first; then a three-letter abbreviation for the Bayer Greek letter; the Bayer superscript number, if present; and finally, the three-letter constellation abbreviation. Thus Alpha Andromedae has the field value "21Alp And", and Kappa1 Sculptoris (no Flamsteed number) has "Kap1Scl".
 * - ra, dec: The star's right ascension and declination, for epoch and equinox 2000.0.
 * - proper: A common name for the star, such as "Barnard's Star" or "Sirius". I have taken these names primarily from the Hipparcos project's web site, which lists representative names for the 150 brightest stars and many of the 150 closest stars. I have added a few names to this list. Most of the additions are designations from catalogs mostly now forgotten (e.g., Lalande, Groombridge, and Gould ["G."]) except for certain nearby stars which are still best known by these designations.
 * - dist: The star's distance in parsecs, the most common unit in astrometry. To convert parsecs to light years, multiply by 3.262. A value >= 100000 indicates missing or dubious (e.g., negative) parallax data in Hipparcos.
 * - pmra, pmdec: The star's proper motion in right ascension and declination, in milliarcseconds per year.
 * - rv: The star's radial velocity in km/sec, where known.
 * - mag: The star's apparent visual magnitude.
 * - absmag: The star's absolute visual magnitude (its apparent magnitude from a distance of 10 parsecs).
 * - spect: The star's spectral type, if known.
 * - ci: The star's color index (blue magnitude - visual magnitude), where known.
 * - x,y,z: The Cartesian coordinates of the star, in a system based on the equatorial coordinates as seen from Earth. +X is in the direction of the vernal equinox (at epoch 2000), +Z towards the north celestial pole, and +Y in the direction of R.A. 6 hours, declination 0 degrees.
 * - vx,vy,vz: The Cartesian velocity components of the star, in the same coordinate system described immediately above. They are determined from the proper motion and the radial velocity (when known). The velocity unit is parsecs per year; these are small values (around 1 millionth of a parsec per year), but they enormously simplify calculations using parsecs as base units for celestial mapping.
 * - rarad, decrad, pmrarad, prdecrad: The positions in radians, and proper motions in radians per year.
 * - bayer: The Bayer designation as a distinct value
 * - flam: The Flamsteed number as a distinct value
 * - con: The standard constellation abbreviation
 * - comp, comp_primary, base: Identifies a star in a multiple star system. comp = ID of companion star, comp_primary = ID of primary star for this component, and base = catalog ID or name for this multi-star system. Currently only used for Gliese stars.
 * - lum: Star's luminosity as a multiple of Solar luminosity.
 * - var: Star's standard variable star designation, when known.
 * - var_min, var_max: Star's approximate magnitude range, for variables. This value is based on the Hp magnitudes for the range in the original Hipparcos catalog, adjusted to the V magnitude scale to match the "mag" field.
 *
 *  0: id
 *  1: hip
 *  2: hd
 *  3: hr
 *  4: gl
 *  5: bf
 *  6: proper
 *  7: ra
 *  8: dec
 *  9: dist
 * 10: pmra
 * 11: pmdec
 * 12: rv
 * 13: mag
 * 14: absmag
 * 15: spect
 * 16: ci
 * 17: x
 * 18: y
 * 19: z
 * 20: vx
 * 21: vy
 * 22: vz
 * 23: rarad
 * 24: decrad
 * 25: pmrarad
 * 26: pmdecrad
 * 27: bayer
 * 28: flam
 * 29: con
 * 30: comp
 * 31: comp_primary
 * 32: base
 * 33: lum
 * 34: var
 * 35: var_min
 * 36: var_max
 */

import { Asset, getAssetPath } from "../../../assets";
import { parseFileLines } from "../../../utils/file";

export interface Star {
  id: string;
  x: number;
  y: number;
  z: number;
  mag: number;
  ci: number | undefined;
  name: string | undefined;
}

function parseStarLine(line: string): Star {
  const columns = line.split(",");
  return {
    id: columns[1],
    x: Number.parseFloat(columns[17]),
    y: Number.parseFloat(columns[18]),
    z: Number.parseFloat(columns[19]),
    mag: Number.parseFloat(columns[13]),
    ci: !!columns[16] ? Number.parseFloat(columns[16]) : undefined,
    name: columns[6],
  };
}

export function loadStarsList(): Promise<Star[]> {
  return parseFileLines(getAssetPath(Asset.StarsFile), parseStarLine, true);
}
