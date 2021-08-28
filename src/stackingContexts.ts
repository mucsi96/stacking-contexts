export type StackingContext = {
  element: Element;
  zIndex?: string;
  children?: StackingContext[];
};

export function isFormingStackingContext(element: Element): boolean {
  const styles = window.getComputedStyle(element) as any;
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

export function getStackingContexts(root: Element): StackingContext[] {
  const children = Array.from(root.children)
    .filter((child) => child.nodeType === Node.ELEMENT_NODE)
    .flatMap((child) => getStackingContexts(child));

  if (isFormingStackingContext(root)) {
    const styles = window.getComputedStyle(root);

    return [
      {
        element: root,
        ...(styles.zIndex && { zIndex: styles.zIndex }),
        ...(children.length && { children }),
      },
    ];
  }

  return children;
}
