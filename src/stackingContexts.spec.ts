import { getStackingContexts, StackingContext } from "./stackingContexts";

type MockStackingContext = {
  id: string;
  zIndex?: string;
  children?: MockStackingContext[];
};

function mapToMockStackingContext(
  contexts: StackingContext[]
): MockStackingContext[] {
  return contexts.map((context) => {
    return {
      id: context.element.id,
      ...(context.zIndex && { zIndex: context.zIndex }),
      ...(context.children && {
        children: mapToMockStackingContext(context.children),
      }),
    } as MockStackingContext;
  });
}

function getMockStackingContexts() {
  return mapToMockStackingContext(getStackingContexts(document.body));
}

describe("getStackingContexts", () => {
  test("returns stacking context", () => {
    document.body.innerHTML = `
      <div id="a-in-root" style="isolation: isolate;"></div>
      <div></div>
    `;
    expect(getMockStackingContexts()).toEqual([{ id: "a-in-root" }]);
  });

  test("returns nested stacking context", () => {
    document.body.innerHTML = `
      <div>
        <div id="a-nested" style="isolation: isolate;"></div>
        <div></div>
      </div>
    `;
    expect(getMockStackingContexts()).toEqual([{ id: "a-nested" }]);
  });

  test("returns empty array if there are no stacking contexts", () => {
    document.body.innerHTML = `
      <div>
        <div id="a-nested" style="isolation: auto;"></div>
        <div></div>
      </div>
    `;
    expect(getMockStackingContexts()).toEqual([]);
  });
});
