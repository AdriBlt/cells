export enum Asset {
    StarsFile = '/stars/hygdata_v3.csv',
    ConstellationsDefinitionFileFormat = '/stars/{0}/constellationship.fab.txt',
    ConstellationsNameFileFormat = '/stars/{0}/constellation_names.eng.fab.txt',

    MazeImage = '/maze.png',

    PlanetsFile = '/planets.tsv',

    WaveFunctionCollapseFormat = '/tiles/{0}/{1}.png',

    CoversFormat = '/covers/{0}/{1}.png',
}

export function getAssetPath(asset: Asset): string {
    // tslint:disable-next-line:whitespace (tslint does not understand import.meta)
    return import.meta.env.BASE_URL + 'data' + (asset as string);
}