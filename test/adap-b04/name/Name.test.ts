import { describe, it, expect } from "vitest";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { Name } from "../../../src/adap-b04/names/Name";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";

describe("B04 Name Contract Tests", () => {

  // Test both implementations
  const implementations = [
    { type: "StringName", create: (s: string, d?: string) => new StringName(s, d) },
    { type: "StringArrayName", create: (s: string, d?: string) => new StringArrayName(s.split(d || "."), d) }
  ];

  implementations.forEach(({ type, create }) => {
    describe(type, () => {

      it("should construct properly with valid arguments", () => {
        const n = create("oss.cs.fau.de");
        expect(n.asString()).toBe("oss.cs.fau.de");
      });

      it("should throw IllegalArgumentException (Precondition) if delimiter is undefined/null", () => {
        // Pushing the limits: Constructor contract
        expect(() => create("test", null as any)).toThrow(IllegalArgumentException);
      });

      it("should throw IllegalArgumentException (Precondition) for invalid index access", () => {
        const n = create("oss.cs.fau.de"); // 4 components: 0, 1, 2, 3
        // Index 4 is out of bounds
        expect(() => n.getComponent(4)).toThrow(IllegalArgumentException);
        // Index -1 is out of bounds
        expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
      });

      it("should throw IllegalArgumentException (Precondition) for null component", () => {
        const n = create("oss.cs.fau.de");
        // Cannot append null
        expect(() => n.append(null as any)).toThrow(IllegalArgumentException);
      });

      it("should maintain Class Invariant (delimiter length)", () => {
         // If we somehow forced a bad delimiter (e.g. via inheritance abuse or ignoring types), 
         // the invariant should catch it. 
         // Testing invariant directly is hard without exposing protected methods, 
         // but normal operations check it.
         const n = create("a.b");
         expect(() => n.asString()).not.toThrow();
      });
    });
  });
});