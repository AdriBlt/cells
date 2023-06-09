
export function readBlackAndWhiteImage(path: string): Promise<boolean[][]> {
    return new Promise<boolean[][]>((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = (ev => {
            if (!hasDimensions(ev.currentTarget)) {
                reject("readBlackAndWhiteImage: No dimensions");
                return;
            }

            const imgWidth = ev.currentTarget.width;
            const imgHeight = ev.currentTarget.height;

            const canvas = document.createElement('canvas');
            canvas.width = imgWidth;
            canvas.height = imgHeight;

            const context = canvas.getContext('2d');
            if (!context) {
                reject("readBlackAndWhiteImage: No context");
                return;
            }

            const matrix: boolean[][] = [];
            context.drawImage(img, 0, 0);
            const darkThreshold = 3 * 256 / 2;
            for (let i = 0; i < imgHeight; i++) {
                const line: boolean[] = [];
                matrix.push(line);
                for (let j = 0; j < imgWidth; j++) {
                    const data = context.getImageData(j, i, 1, 1).data;
                    const isDark = (data[0] + data[1] + data[2]) < darkThreshold;
                    line.push(isDark);
                }
            }

            resolve(matrix);
        });
    });
}

interface Dimension extends EventTarget {
    width: number;
    height: number;
}

function hasDimensions(ev: EventTarget | null): ev is Dimension {
    return !!ev && 'width' in ev && 'height' in ev;
}