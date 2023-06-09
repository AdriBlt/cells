export function parseFileLines<T>(
  path: string,
  lineParser: (line: string) => T | undefined,
  skipFirstLine: boolean = false,
  skipableChar?: string
): Promise<T[]> {
  return fetch(path)
    .then((response) => response.text())
    .then((data) => {
      let lines = data.split("\n");
      if (skipableChar) {
        lines = lines.filter((line: string) => !line.startsWith(skipableChar));
      }

      const parsedLines: T[] = [];
      for (let i = skipFirstLine ? 1 : 0; i < lines.length; i++) {
        if (lines[i].trim() === "") {
          continue;
        }

        const value = lineParser(lines[i]);
        if (value) {
          parsedLines.push(value);
        }
      }

      return parsedLines;
    });
}
