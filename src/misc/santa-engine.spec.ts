import { SantaEngine } from "./santa-engine";

// list-helpers imports utils/random, which loads p5, and p5 needs a browser
// window. shuffleList only uses Math.random, so stub the p5-backed module.
vi.mock("../utils/random", () => ({ random: Math.random, randomInt: () => 0 }));

describe("SantaEngine.addSiblings", () => {
  it("makes every sibling unable to gift to the others", () => {
    const engine = new SantaEngine();
    engine.addSiblings("Anna", "Bob", "Carl");

    expect(engine.getGuest("Anna").cannotGiftTo).toEqual(["Bob", "Carl"]);
    expect(engine.getGuest("Bob").cannotGiftTo).toEqual(["Anna", "Carl"]);
    expect(engine.getGuest("Carl").cannotGiftTo).toEqual(["Anna", "Bob"]);
  });

  it("adds a single sibling with no restriction", () => {
    const engine = new SantaEngine();
    engine.addSiblings("Solo");

    expect(engine.getGuest("Solo").cannotGiftTo).toEqual([]);
  });

  it("keeps addCouple behaving as a group of two", () => {
    const engine = new SantaEngine();
    engine.addCouple("Jeanne", "Maxime");

    expect(engine.getGuest("Jeanne").cannotGiftTo).toEqual(["Maxime"]);
    expect(engine.getGuest("Maxime").cannotGiftTo).toEqual(["Jeanne"]);
  });

  it("never assigns a gift between siblings", () => {
    const siblings = ["Anna", "Bob", "Carl"];
    const engine = new SantaEngine();
    engine.addSiblings(...siblings);
    engine.addCouple("Dora", "Eric");
    engine.addPerson("Fred");

    for (let run = 0; run < 50; run++) {
      engine.computeGifts();
      const assignments = engine.getAssignments();

      expect(assignments).toHaveLength(6);
      for (const { from, to } of assignments) {
        expect(siblings.includes(from) && siblings.includes(to)).toBe(false);
      }
    }
  });
});
