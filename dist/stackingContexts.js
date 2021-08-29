let id = -1;
const colorMap = new Map();
export function isFormingStackingContext(element) {
    const styles = window.getComputedStyle(element);
    const parentStyles = element.parentElement && window.getComputedStyle(element.parentElement);
    if (["fixed", "sticky"].includes(styles.position) ||
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
        ["layout", "paint", "strict", "content"].some((value) => styles.contain.includes(value)) ||
        (parentStyles &&
            parentStyles.display == "flex" &&
            styles.zIndex &&
            styles.zIndex !== "auto") ||
        (parentStyles &&
            parentStyles.display == "grid" &&
            styles.zIndex &&
            styles.zIndex !== "auto")) {
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
function getBackgroundColor(parents) {
    if (colorMap.has(parents)) {
        return colorMap.get(parents);
    }
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    colorMap.set(parents, color);
    return color;
}
function getStackingContextsRecursive(parents, root) {
    if (isFormingStackingContext(root)) {
        id++;
        const zIndex = root.style.zIndex;
        const context = {
            id,
            parents,
            level: parents.length,
            selector: `${root.tagName.toLocaleLowerCase()}${root.id ? `#${root.id}` : ""}${root.className ? `.${root.className}` : ""}`,
            ...(zIndex && { zIndex }),
        };
        root.style.backgroundColor = getBackgroundColor(parents);
        root.title = JSON.stringify(context)
            .replace(/[{}"]/g, "")
            .replace(/:/g, " : ")
            .replace(/,/g, "\n");
        return [context, ...getNestedStackingContxts([...parents, id], root)];
    }
    return getNestedStackingContxts(parents, root);
}
export function getStackingContexts() {
    id = -1;
    return getStackingContextsRecursive([], document.body);
}
