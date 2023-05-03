import { Asset, getAssetPath } from "../../../assets";
import { parseFileLines } from "../../../utils/file";

export const KnownConstellationsFamilies: string[] = [
  "western",
  "almagest",
  "anutan",
  "arabic",
  "arabic_moon_stations",
  "armintxe",
  "aztec",
  "belarusian",
  "boorong",
  "chinese",
  "chinese_contemporary",
  "chinese_medieval",
  "dakota",
  "egyptian",
  "hawaiian_starlines",
  "indian",
  "inuit",
  "japanese_moon_stations",
  "kamilaroi",
  "korean",
  "lokono",
  "macedonian",
  "maori",
  "maya",
  "mongolian",
  "mulapin",
  "navajo",
  "norse",
  "northern_andes",
  "ojibwe",
  "romanian",
  "sami",
  "sardinian",
  "seleucid",
  "siberian",
  "tongan",
  "tukano",
  "tupi",
  "vanuatu_netwar",
];

export interface Edge {
  start: string;
  end: string;
}

export interface ConstellationEdges {
  id: string;
  edges: Edge[];
  name?: string;
}

export interface ConstellationName {
  id: string;
  name: string;
  altName: string;
}

export interface Constellation {
  id: string;
  edges: Edge[];
  name: string;
}

function parseConstellation(line: string): ConstellationEdges {
  const columns = line.split(" ");
  const id = columns[0];
  const edges: Edge[] = [];
  for (let i = 3; i < columns.length; i += 2) {
    edges.push({ start: columns[i - 1], end: columns[i] });
  }

  return { id, edges };
}

const regex = /^(.+)\t"(.*)"\t_\("(.*)"\)$/;
function parseConstellationName(line: string): ConstellationName | undefined {
  const result = line.match(regex);
  if (!result) {
    const groups = line.split("\t");
    if (groups.length !== 3) {
      return undefined;
    }

    const id = groups[0];
    const name = groups[2].substring(3, groups[2].length - 3);
    const altName = groups[1].substring(1, groups[1].length - 1);

    return { id, name, altName };
  }

  return {
    id: result[1],
    name: result[3],
    altName: result[2],
  };
}

export function loadConstellationListFamilies(
  families: string[]
): Promise<Constellation[][]> {
  return Promise.all(families.map(loadConstellationList));
}

function loadConstellationList(
  constellationFamily: string
): Promise<Constellation[]> {
  const constellationDefinitionFormat = getAssetPath(Asset.ConstellationsDefinitionFileFormat);
  const constellationNameFormat = getAssetPath(Asset.ConstellationsNameFileFormat);
  return Promise.all([
    parseFileLines<ConstellationEdges>(
      constellationDefinitionFormat.replace('{0}', constellationFamily),
      parseConstellation,
      false,
      "#",
    ),
    parseFileLines<ConstellationName>(
      constellationNameFormat.replace('{0}', constellationFamily),
      parseConstellationName,
      false,
      "#",
    ),
  ]).then(
    ([constellations, constellationNames]: [
      ConstellationEdges[],
      ConstellationName[]
    ]) => {
      const map = new Map<string, ConstellationEdges>();
      constellations.forEach((constellation) =>
        map.set(constellation.id, constellation)
      );

      // ADDING NAMES
      constellationNames.forEach((constellationName) => {
        const constellation = map.get(constellationName.id);
        if (constellation) {
          constellation.name = constellationName.name;
        }
      });

      const emptyOnes = constellations.filter(
        (cons) =>
          cons.edges.filter((e) => e.start.trim() === "" || e.end.trim() === "")
            .length > 0
      );
      if (emptyOnes.length > 0) {
        // tslint:disable-next-line:no-console
        console.log(constellationFamily);
      }

      const c = constellations.filter(isConstellationWithName);

      if (c.length === 0) {
        // tslint:disable-next-line:no-console
        console.log(constellationFamily);
      }

      return c;
    }
  );
}

function isConstellationWithName(
  constellation: ConstellationEdges
): constellation is Constellation {
  return !!constellation.name;
}
