import { Color, COLORS } from "../../../utils/color";
import { BodyData, loadBodiesList } from "./bodies-data-parser";
import { BodyInfo } from "./models";

export function getSolarSystemInfo(): Promise<BodyInfo[]> {
    return loadBodiesList()
        .then(bodies => {
            const bodyColors = getBodyColors();
            return bodies
                .filter(d => !!bodyColors[d.name])
                .map((d: BodyData) => {
                    const color: Color = bodyColors[d.name] || COLORS.White;
                    return {
                        name: d.name,
                        mass: d.mass,
                        radius: d.diameter / 2,
                        semiMajorAxis: d.semiMajorAxis,
                        eccentricity: d.eccentricity,
                        parent: d.parent,
                        color,
                    };
                });
        });
}

function getBodyColors(): { [name: string]: Color} {
    // What Color are the Planets?
    // Mercury – Grey
    // Venus – Brown and grey
    // Earth – Blue, brown green and white
    // Mars – Red, brown and tan
    // Jupiter – Brown, orange and tan, with white cloud stripes
    // Saturn – Golden, brown, and blue-grey
    // Uranus – Blue-green
    // Neptune – Blue
    return {
        'Sun': COLORS.Orange,
        'Mercury': COLORS.DarkGray,
        'Venus': COLORS.SandyBrown,
        'Earth': COLORS.Blue,
        'Mars': COLORS.Firebrick,
        'Jupiter': COLORS.Tan,
        'Saturn': COLORS.GoldenRod,
        'Uranus': COLORS.LightBlue,
        'Neptune': COLORS.Blue,
        'Moon': COLORS.LightGray,
        'Pallas': COLORS.Yellow,
        'Vesta': COLORS.Yellow,
        'Ceres': COLORS.Yellow,
        'Hygiea': COLORS.Yellow,
        'Phobos': COLORS.Red,
        'Deimos': COLORS.Red,
    };
}

// mass in kg, radius and distance in km
export function getSolarSystemDataSampleData(): BodyData[] {
    const mSun = 1.989e+30;
    const rSun = 696340;

    const mEarth = 5.972e+24;
    const rEarth = 6371;
    const dEarth = 149600000;

    const mMoon = 7.349e+22;
    const rMoon = 1737;
    const dMoon = 384400;

    return [
        {
            name: 'Sun',
            mass: mSun,
            diameter: 2 * rSun,
            eccentricity: 0,
            parent: '',
            semiMajorAxis: 0,
        },
        {
            name: 'Earth',
            mass: mEarth,
            diameter: 2 * rEarth,
            eccentricity: 0,
            parent: 'Sun',
            semiMajorAxis: dEarth,
        },
        {
            name: 'Moon',
            mass: mMoon,
            diameter: 2 * rMoon,
            eccentricity: 0,
            parent: 'Earth',
            semiMajorAxis: dMoon,
        },
    ];
};
