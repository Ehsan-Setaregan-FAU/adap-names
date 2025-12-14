import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";

describe("Name Immutability Tests", () => {

  it("should return a new instance on append", () => {
    const original = new StringName("oss.cs.fau");
    const modified = original.append("de");

    // Original object must remain unchanged (Immutability check)
    expect(original.asDataString()).toBe("oss.cs.fau");
    
    // The returned object should contain the appended value
    expect(modified.asDataString()).toBe("oss.cs.fau.de");
    
    // Ensure they are distinct objects in memory
    expect(original).not.toBe(modified);
  });

  it("should return a new instance on insert", () => {
    const original = new StringArrayName(["oss", "fau", "de"]);
    const modified = original.insert(1, "cs");

    expect(original.asDataString()).toBe("oss.fau.de");
    expect(modified.asDataString()).toBe("oss.cs.fau.de");
    expect(original).not.toBe(modified);
  });

  it("should return a new instance on remove", () => {
    const original = new StringName("oss.cs.fau.de");
    const modified = original.remove(0);

    expect(original.asDataString()).toBe("oss.cs.fau.de");
    expect(modified.asDataString()).toBe("cs.fau.de");
    expect(original).not.toBe(modified);
  });

  it("should handle equality correctly", () => {
    const n1 = new StringName("oss.cs.fau.de");
    const n2 = new StringArrayName(["oss", "cs", "fau", "de"]);

    // Testing contract: Equal objects must have equal hash codes
    expect(n1.isEqual(n2)).toBe(true);
    expect(n1.getHashCode()).toBe(n2.getHashCode());
  });

});