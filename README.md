# stacking-contexts

Script for debugging / demonstrating stacking contexts

```js
(function () {
  let id = -1;

  function isFormingStackingContext(element) {
    const styles = window.getComputedStyle(element);
    const parentStyles =
      element.parentElement && window.getComputedStyle(element.parentElement);
    if (
      ["fixed", "sticky"].includes(styles.position) ||
      (styles.position &&
        styles.position !== "static" &&
        styles.zIndex !== "auto") ||
      (styles.mixBlendMode && styles.mixBlendMode !== "normal") ||
      [
        styles.transform,
        styles.filter,
        styles.perspective,
        styles.clipPath,
        styles.mask,
        styles.maskImage,
        styles.maskBorder,
      ].some((value) => value && value !== "none") ||
      styles.isolation === "isolate" ||
      styles.webkitOverflowScrolling === "touch" ||
      [
        "mix-blend-mode",
        "transform",
        "filter",
        "perspective",
        "clip-path",
        "mask",
        "mask-image",
        "mask-border",
      ].some((value) => styles.willChange.includes(value)) ||
      ["layout", "paint", "strict", "content"].some((value) =>
        styles.contain.includes(value)
      ) ||
      (parentStyles &&
        parentStyles.display == "flex" &&
        styles.zIndex &&
        styles.zIndex !== "auto") ||
      (parentStyles &&
        parentStyles.display == "grid" &&
        styles.zIndex &&
        styles.zIndex !== "auto")
    ) {
      return true;
    }
    if (styles.opacity == "auto") {
      return false;
    }
    const opacity = parseFloat(styles.opacity);
    if (isNaN(opacity) || opacity == 1) {
      return false;
    }
    return true;
  }

  function getNestedStackingContxts(parents, root) {
    return Array.from(root.children)
      .filter((child) => child.nodeType === Node.ELEMENT_NODE)
      .flatMap((child) => getStackingContextsRecursive(parents, child));
  }

  function getStackingContextsRecursive(parents, root) {
    if (isFormingStackingContext(root)) {
      id++;
      const styles = window.getComputedStyle(root);
      return [
        {
          id,
          parents,
          level: parents.length,
          selector: `${root.tagName.toLocaleLowerCase()}${
            root.id ? `#${root.id}` : ""
          }${root.className ? `.${root.className}` : ""}`,
          ...(styles.zIndex && { zIndex: styles.zIndex }),
        },
        ...getNestedStackingContxts([...parents, id], root),
      ];
    }
    return getNestedStackingContxts(parents, root);
  }

  function getStackingContexts() {
    id = -1;
    return getStackingContextsRecursive([], document.body);
  }

  console.table(getStackingContexts());
})();
```
