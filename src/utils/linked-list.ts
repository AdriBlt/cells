interface LinkedListNode<T> {
  value: T;
  previous: LinkedListNode<T> | undefined;
  next: LinkedListNode<T> | undefined;
}

function makeNode<T>(value: T): LinkedListNode<T> {
  return {
    value,
    previous: undefined,
    next: undefined
  };
}

export class LinkedList<T> {
  public head: LinkedListNode<T> | undefined;
  public tail: LinkedListNode<T> | undefined;
  public count = 0;

  public peekHead(): T | undefined {
    if (this.head === undefined) {
      return undefined;
    }

    return this.head.value;
  }

  public peekTail(): T | undefined {
    if (this.tail === undefined) {
      return undefined;
    }

    return this.tail.value;
  }

  public popHead(): T | undefined {
    if (this.head === undefined) {
      return undefined;
    }

    const value = this.head.value;
    this.head = this.head.next;

    this.count--;
    if (this.head === undefined) {
      this.tail = undefined;
    } else {
      this.head.previous = undefined;
    }

    return value;
  }

  public popTail(): T | undefined {
    if (this.tail === undefined) {
      return undefined;
    }

    const value = this.tail.value;
    this.tail = this.tail.previous;

    this.count--;
    if (this.tail === undefined) {
      this.head = undefined;
    } else {
      this.tail.next = undefined;
    }

    return value;
  }

  public insertHead(value: T): void {
    const node = makeNode(value);
    node.next = this.head;
    if (this.head !== undefined) {
      this.head.previous = node;
    }

    this.head = node;

    this.count++;
    if (this.tail === undefined) {
      this.tail = node;
    }
  }

  public insertTail(value: T): void {
    const node = makeNode(value);
    node.previous = this.tail;
    if (this.tail !== undefined) {
      this.tail.next = node;
    }

    this.tail = node;

    this.count++;
    if (this.head === undefined) {
      this.head = node;
    }
  }

  public clear(): void {
    this.head = undefined;
    this.tail = undefined;
    this.count = 0;
  }

  public toList(): T[] {
    const list = [];
    let node = this.head;
    while (node !== undefined) {
      list.push(node.value);
      node = node.next;
    }

    return list;
  }

  public toReversedList(): T[] {
    const list = [];
    let node = this.tail;
    while (node !== undefined) {
      list.push(node.value);
      node = node.previous;
    }

    return list;
  }

  public forEach(callback: (element: T, index: number) => void): void {
    let index = 0;
    let node = this.head;
    while (node !== undefined) {
      callback(node.value, index);
      node = node.next;
      index++;
    }
  }

  public map<V>(callback: (element: T, index: number) => V): LinkedList<V> {
    const list = new LinkedList<V>();
    this.forEach((e, i) => list.insertTail(callback(e, i)));
    return list;
  }

  public where(callback: (element: T, index: number) => boolean): LinkedList<T> {
    const list = new LinkedList<T>();
    this.forEach((e, i) => {
      if (callback(e, i)) {
        list.insertTail(e);
      }
    });
    return list;
  }

  public clone(elementCopyFn: (element: T, index: number) => T = (element: T) => element): LinkedList<T> {
    return this.map(elementCopyFn);
  }
}
