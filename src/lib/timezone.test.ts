import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { startOfJakartaDay, startOfJakartaMonth, startOfJakartaYear } from "./timezone";

describe("Asia/Jakarta boundaries", () => {
  it("menghitung awal hari Jakarta dari UTC malam", () => {
    // 2026-03-15 17:30 UTC = 2026-03-16 00:30 WIB
    const utc = new Date("2026-03-15T17:30:00.000Z");
    const start = startOfJakartaDay(utc);
    assert.equal(start.toISOString(), "2026-03-15T17:00:00.000Z");
  });

  it("menghitung awal bulan Jakarta", () => {
    const utc = new Date("2026-03-15T10:00:00.000Z");
    const start = startOfJakartaMonth(utc);
    assert.equal(start.toISOString(), "2026-02-28T17:00:00.000Z");
  });

  it("menghitung awal tahun Jakarta", () => {
    const utc = new Date("2026-02-01T00:00:00.000Z");
    const start = startOfJakartaYear(utc);
    assert.equal(start.toISOString(), "2025-12-31T17:00:00.000Z");
  });
});
