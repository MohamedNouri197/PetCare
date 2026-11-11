import { toKg, trainWeightModel } from "./weight-regression";
import type { WeightEntry } from "@/types";

function makeEntry(date: string, weight: number, unit: "kg" | "lbs" = "kg"): WeightEntry {
  return { id: "w1", animalId: "a1", weight, unit, date, createdAt: date };
}

describe("toKg", () => {
  it("returns kg value unchanged", () => {
    expect(toKg(makeEntry("2026-01-01", 10, "kg"))).toBe(10);
  });

  it("converts lbs to kg", () => {
    expect(toKg(makeEntry("2026-01-01", 22, "lbs"))).toBeCloseTo(9.979, 2);
  });
});

describe("trainWeightModel", () => {
  it("returns null with fewer than 3 entries", () => {
    expect(trainWeightModel([])).toBeNull();
    expect(trainWeightModel([makeEntry("2026-01-01", 5)])).toBeNull();
    expect(trainWeightModel([makeEntry("2026-01-01", 5), makeEntry("2026-01-15", 6)])).toBeNull();
  });

  it("returns null when all entries are on the same date", () => {
    const entries = [
      makeEntry("2026-01-01", 5),
      makeEntry("2026-01-01", 5.1),
      makeEntry("2026-01-01", 5.2),
    ];
    expect(trainWeightModel(entries)).toBeNull();
  });

  it("trains a model on a perfect linear trend (gaining weight)", () => {
    const entries = [
      makeEntry("2026-01-01", 5),
      makeEntry("2026-01-31", 6),
      makeEntry("2026-03-02", 7),
    ];
    const model = trainWeightModel(entries);
    expect(model).not.toBeNull();
    expect(model!.r2).toBeCloseTo(1, 2);
    expect(model!.slope).toBeGreaterThan(0);
    expect(model!.trend).toBe("up");
    expect(model!.points).toHaveLength(3);
  });

  it("trains a model on a weight-loss trend", () => {
    const entries = [
      makeEntry("2026-01-01", 12),
      makeEntry("2026-02-01", 11),
      makeEntry("2026-03-01", 10),
    ];
    const model = trainWeightModel(entries);
    expect(model).not.toBeNull();
    expect(model!.slope).toBeLessThan(0);
    expect(model!.trend).toBe("down");
  });

  it("detects stable weight", () => {
    const entries = [
      makeEntry("2026-01-01", 10),
      makeEntry("2026-02-01", 10.001),
      makeEntry("2026-03-01", 10.002),
    ];
    const model = trainWeightModel(entries);
    expect(model).not.toBeNull();
    expect(model!.trend).toBe("stable");
  });

  it("predict returns intercept at day 0", () => {
    const entries = [
      makeEntry("2026-01-01", 5),
      makeEntry("2026-02-01", 6),
      makeEntry("2026-03-01", 7),
    ];
    const model = trainWeightModel(entries)!;
    expect(model.predict(0)).toBeCloseTo(model.intercept, 5);
  });

  it("predictInDays predicts from the last entry", () => {
    const entries = [
      makeEntry("2026-01-01", 5),
      makeEntry("2026-02-01", 6),
      makeEntry("2026-03-01", 7),
    ];
    const model = trainWeightModel(entries)!;
    const pred30 = model.predictInDays(30);
    expect(pred30).toBeGreaterThan(7);
  });

  it("handles lbs entries by converting to kg", () => {
    const entries = [
      makeEntry("2026-01-01", 11, "lbs"),
      makeEntry("2026-02-01", 13.2, "lbs"),
      makeEntry("2026-03-01", 15.4, "lbs"),
    ];
    const model = trainWeightModel(entries);
    expect(model).not.toBeNull();
    expect(model!.points[0].weight).toBeCloseTo(4.99, 1);
  });

  it("handles unsorted entries", () => {
    const entries = [
      makeEntry("2026-03-01", 7),
      makeEntry("2026-01-01", 5),
      makeEntry("2026-02-01", 6),
    ];
    const model = trainWeightModel(entries)!;
    expect(model.points[0].day).toBe(0);
    expect(model.points[2].day).toBeGreaterThan(0);
  });
});
