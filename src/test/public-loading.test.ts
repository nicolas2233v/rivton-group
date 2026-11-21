import { describe, it, expect, vi } from "vitest";
vi.mock("@/platform/public-content", () => ({
  readPublic: vi.fn(() => {
    throw new Error("Repeated remote read");
  }),
}));
import {
  loadHomeContent,
  loadAboutContent,
  loadSiteSettings,
  loadPropertyList,
  contentFromParent,
} from "@/services/content";
import type { PublicSnapshot } from "@/platform/public-content";
import { localProperties, localSettings, localTeam } from "@/data/properties";
const snapshot = {
  properties: localProperties,
  settings: localSettings,
  team: localTeam,
} as PublicSnapshot;
describe("public navigation uses one validated root snapshot", () => {
  it("derives all sections and pages without another server request", async () => {
    const context = { parentMatchPromise: Promise.resolve({ loaderData: { cms: snapshot } }) };
    expect((await loadHomeContent(context)).featured.every((p) => p.featured)).toBe(true);
    expect((await loadAboutContent(context)).settings).toBe(localSettings);
    expect(await loadSiteSettings(context)).toBe(localSettings);
    expect(await loadPropertyList(context)).toBe(localProperties);
  });
  it("does not substitute mock data when the root content is unavailable", async () => {
    await expect(contentFromParent(Promise.resolve({ loaderData: { cms: null } }))).rejects.toThrow(
      "no está disponible",
    );
  });
});
