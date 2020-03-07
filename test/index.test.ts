import { Robot } from "../src/index";
import _ from "lodash";

const equal = (a: any, b: any) => expect(_.isEqual(a, b)).toBe(true);

describe("name", () => {
  //   describe("I/O", () => {
  //     it("parses input correctly", () => {
  //       Robot.fromInput(`\
  // 3
  // pile 1 onto 2
  // pile 0 onto 2
  // quit`);
  //     });
  //   });

  it("doesn't crash when constructing", () => {
    new Robot(3);
  });

  it("blocks should remain without operations", () => {
    const robot = new Robot(3);
    equal(robot.getOutput(), [[0], [1], [2]]);
  });

  describe("pile onto", () => {
    it("two operations", () => {
      const robot = new Robot(3);
      robot.pileOnto(1, 2);
      robot.pileOnto(0, 2);
      equal(robot.getOutput(), [[], [1], [2, 0]]);
    });
  });
  describe("pile over", () => {
    it("one operation", () => {
      const robot = new Robot(3);
      robot.pileOver(1, 2);
      equal(robot.getOutput(), [[0], [], [2, 1]]);
    });
    it("three operations", () => {
      const robot = new Robot(3);
      robot.pileOver(1, 2);
      robot.pileOver(1, 0);
      robot.pileOver(0, 2);

      equal(robot.getOutput(), [[], [], [2, 0, 1]]);
    });
  });
  describe("move over", () => {
    it("one operation", () => {
      const robot = new Robot(3);
      robot.moveOver(1, 2);
      equal(robot.getOutput(), [[0], [], [2, 1]]);
    });

    it("two operations", () => {
      const robot = new Robot(3);
      robot.moveOver(1, 2);
      robot.moveOver(2, 0);
      equal(robot.getOutput(), [[0, 2], [1], []]);
    });
  });
});
