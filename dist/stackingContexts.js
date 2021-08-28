"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getStackingContexts = exports.isFormingStackingContext = void 0;
function isFormingStackingContext(element) {
    var styles = window.getComputedStyle(element);
    var parentStyles = element.parentElement && window.getComputedStyle(element.parentElement);
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
        ].some(function (value) { return value && value !== "none"; }) ||
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
        ].some(function (value) { return styles.willChange.includes(value); }) ||
        ["layout", "paint", "strict", "content"].some(function (value) {
            return styles.contain.includes(value);
        }) ||
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
    var opacity = parseFloat(styles.opacity);
    if (isNaN(opacity) || opacity == 1) {
        return false;
    }
    return true;
}
exports.isFormingStackingContext = isFormingStackingContext;
function getStackingContexts(root) {
    var children = Array.from(root.children)
        .filter(function (child) { return child.nodeType === Node.ELEMENT_NODE; })
        .flatMap(function (child) { return getStackingContexts(child); });
    if (isFormingStackingContext(root)) {
        var styles = window.getComputedStyle(root);
        return [
            __assign(__assign({ element: root }, (styles.zIndex && { zIndex: styles.zIndex })), (children.length && { children: children })),
        ];
    }
    return children;
}
exports.getStackingContexts = getStackingContexts;
