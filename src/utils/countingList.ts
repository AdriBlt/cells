export interface WithId {
    id: string;
}

interface Data<T> {
    value: T;
    count: number;
}

export class CountingList<T extends WithId> {
    private map: Map<string, Data<T>> = new Map<string, Data<T>>();

    public getCount(key: T): number {
        const data = this.map.get(key.id);
        return data ? data.count : 0;
    }

    public add(key: T): void {
        const count = this.getCount(key);
        this.map.set(key.id, { value: key, count: count + 1 });
    }

    public getItemsWhere(callback: (count: number) => boolean): T[] {
        const list: T[] = [];
        this.map.forEach(d => {
            if (callback(d.count)) {
                list.push(d.value);
            }
        })
        return list;
    }
}