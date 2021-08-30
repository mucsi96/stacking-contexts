import { getStackingContexts } from "./stackingContexts";

describe("getStackingContexts", () => {
  test("returns stacking context", () => {
    document.body.innerHTML = `
      <div id="a-in-root" style="isolation: isolate;"></div>
      <div></div>
    `;
    expect(getStackingContexts()).toEqual([
      { id: 1, level: 0, selector: "div#a-in-root" },
    ]);
  });

  test("returns nested stacking context", () => {
    document.body.innerHTML = `
      <div>
        <div id="a-nested" style="isolation: isolate;"></div>
        <div></div>
      </div>
    `;
    expect(getStackingContexts()).toEqual([
      { id: 1, level: 0, selector: "div#a-nested" },
    ]);
  });

  test("returns deply nested stacking context", () => {
    document.body.innerHTML = `
      <div>
        <div>
          <div>
            <div id="a-deeply-nested" style="isolation: isolate;"></div>
            <div></div>
          </div>
        </div>
      </div>
    `;
    expect(getStackingContexts()).toEqual([
      { id: 1, level: 0, selector: "div#a-deeply-nested" },
    ]);
  });

  test("returns multiple stacking contexts", () => {
    document.body.innerHTML = `
      <div id="a" style="isolation: isolate;"></div>
      <div></div>
      <div id="b" style="isolation: isolate;"></div>
    `;
    expect(getStackingContexts()).toEqual([
      { id: 1, level: 0, selector: "div#a" },
      { id: 2, level: 0, selector: "div#b" },
    ]);
  });

  test("returns multiple stacking contexts with one nested", () => {
    document.body.innerHTML = `
      <div>
        <div id="a" style="isolation: isolate;"></div>
      </div>
      <div></div>
      <div id="b" style="isolation: isolate;"></div>
    `;
    expect(getStackingContexts()).toEqual([
      { id: 1, level: 0, selector: "div#a" },
      { id: 2, level: 0, selector: "div#b" },
    ]);
  });

  test("returns nested stacking contexts", () => {
    document.body.innerHTML = `
      <div id="a" style="isolation: isolate;">
        <div></div>
        <div id="b" style="isolation: isolate;">
          <div>
            <div></div>
            <div id="c" style="isolation: isolate;">
          </div>
        </div>
      </div>
      <div></div>
    `;
    expect(getStackingContexts()).toEqual([
      { id: 1, level: 0, selector: "div#a" },
      { id: 2, level: 1, parent: 1, selector: "div#b" },
      { id: 3, level: 2, parent: 2, selector: "div#c" },
    ]);
  });

  test("returns empty array if there are no stacking contexts", () => {
    document.body.innerHTML = `
      <div>
        <div id="a-nested" style="isolation: auto;"></div>
        <div></div>
      </div>
    `;
    expect(getStackingContexts()).toEqual([]);
  });
});
