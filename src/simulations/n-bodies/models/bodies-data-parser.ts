import { Asset, getAssetPath } from "../../../assets";
import { parseFileLines } from "../../../utils/file";

export interface BodyData {
    // Order: for bodies within their parent scope, indicating distance from it
    order?: number;

    // Label: symbol or roman notation indicating size within parent scope
    label?: string;

    // Name
    name: string;

    // H = Abs. Mag.
    absoluteMagnitude?: number;

    // d = Diameter (km)
    diameter: number;

    // m = Mass (e+16 kg)
    mass: number;

    // a = Semi-major axis (km)
    semiMajorAxis: number;

    // T = Orbital period (d)
    orbitalPeriod?: number;

    // i = Inclination (degrees)
    inclination?: number;

    // e = Eccentricity
    eccentricity: number;

    // Group: children are often regroupped in categories
    group?: string;

    // Parent
    parent: string;
}

export function loadBodiesList(): Promise<BodyData[]> {
    return parseFileLines(
        getAssetPath(Asset.PlanetsFile),
        parseBodyData,
        true, // skipFirstLine
    );
}

function parseBodyData(line: string): BodyData {
    const fields = line.split('\t');
    return {
        order: parseNumber(fields[0]),
        label: fields[1].trim(),
        name: fields[2].trim(),
        absoluteMagnitude: parseNumber(fields[3]),
        diameter: parseNumber(fields[4]) || 0,
        mass: (parseNumber(fields[5]) || 0) * 1e+16,
        semiMajorAxis: parseNumber(fields[6]) || 0,
        orbitalPeriod: parseNumber(fields[7]) || 0,
        inclination: parseNumber(fields[8]) || 0,
        eccentricity: parseNumber(fields[9]) || 0,
        group: fields[10].trim(),
        parent: fields[11].trim(),
    };
}

function parseNumber(field: string): number | undefined {
    if (field.trim() === "") {
        return undefined;
    }

    return +field;
}
