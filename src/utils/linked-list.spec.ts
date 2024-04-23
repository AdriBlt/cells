import { LinkedList } from "./linked-list";

describe("LinkedList", () => {
  test("basic", () => {
    const list = new LinkedList<string>();

    expect(list.count).toBe(0);
    expect(list.peekHead).toBeUndefined();
    expect(list.peekTail).toBeUndefined();

    list.insertTail("foo");
    list.insertHead("bar");
    expect(list.count).toBe(2);
    expect(list.peekHead).toBe("bar");
    expect(list.peekTail).toBe("foo");
  });

  // clear
  // toList
  // toReversedList
  // forEach
  // map
  // where
  // clone
  // insertBeforeElement
});
