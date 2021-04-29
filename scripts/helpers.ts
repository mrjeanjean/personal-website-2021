/**
 * Wrap first element with the second one
 * @param {HTMLElement} $el
 * @param {HTMLElement} wrapper
 * @return HTMLElement
 */
export function wrapElement($el: HTMLElement, wrapper: HTMLElement): HTMLElement {
    $el.parentNode.insertBefore(wrapper, $el);
    wrapper.appendChild($el);
    return wrapper;
}

/**
 * Unwrap HTML element
 * @param {HTMLElement} $el
 * @return HTMLElement
 */
export function unwrapElement($el: HTMLElement): void {
    const $parent = $el.parentNode;
    while ($el.firstChild) $parent.insertBefore($el.firstChild, $el);
    $parent.removeChild($el);
}

/**
 * Throttle function
 * @param {Function} fn
 * @param {number} delay
 */
export function throttle(fn: Function, delay: number = 200) {
    let throttle = null;
    return function () {
        if (throttle) {
            return;
        }
        throttle = setTimeout(function () {
            fn.apply(this, arguments);
            throttle = false;
        }, delay);
        fn.apply(this, arguments);
    };
}

/**
 * Debounce function
 * @param {Function} fn
 * @param {number} delay
 */
export function debounce(fn: Function, delay: number = 200) {
    let timeout
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn.call(this, ...args), delay)
    }
}

/**
 * Clamp number between in and max value
 * @param {number} num - value
 * @param {number} min - min value
 * @param {number} max - max value
 * @return {number}
 */
export function clamp(num: number, min: number, max: number): number {
    return Math.max(Math.min(num, Math.max(min, max)), Math.min(min, max))
}

/**
 * @param {number} num
 * @param {number} distance
 * @return {number}
 */
export function clampDistance(num: number, distance: number): number {
    const max = distance;
    const min = distance * -1;
    return clamp(num, min, max);
}

/**
 * Linear interpolation
 * @param start
 * @param end
 * @param amount
 * @return {number}
 */
export function lerp(start: number, end: number, amount: number): number {
    return (1 - amount) * start + amount * end;
}

/**
 * Simple reverse string function
 * @param str
 * @return {string}
 */
export function reverseString(str):string {
    let splitString = str.split("");
    let reverseArray = splitString.reverse();
    return reverseArray.join("");
}
