export interface Comparable<T> {
    equals: (obj: T) => boolean;
}

export class UniqueSet<T extends Comparable<T>> {
    private set: Set<T>;
    constructor(list?: T[]) {
        // TODO check unicity
        this.set = new Set<T>(list);
    }

    public get size(): number {
        return this.set.size;
    }

    public add(item: T): void {
        if (!this.includes(item)) {
            this.set.add(item);
        }
    }

    public filter(filteringFunc: (item: T) => boolean): UniqueSet<T> {
        const list: T[] = [];
        this.set.forEach(e => {
            if (filteringFunc(e)) {
                list.push(e);
            }
        });

        return new UniqueSet(list);
    }

    public delete(item: T): void {
        this.deleteWhere(e => e.equals(item));
    }

    public deleteWhere(deletingFunc: (item: T) => boolean): void {
        this.set.forEach(e => {
            if (deletingFunc(e)) {
                this.set.delete(e);
            }
        });
    }

    public includes(item: T): boolean {
        let includes = false
        this.set.forEach(e => {
            if (item.equals(e)) {
                includes = true;
                return;
            }
        });
        return includes;
    }

    public forEach(callback: (item: T) => void): void {
        this.set.forEach(callback);
    }

    public toList(): T[] {
        const list: T[] = [];
        this.set.forEach(e => list.push(e));
        return list;
    }

    public clear(): void {
        this.set.clear();
    }
}