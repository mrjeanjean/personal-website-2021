/**
 * Wrap first element with the second one
 * @param {HTMLElement} el
 * @param {HTMLElement} wrapper
 * @return HTMLElement
 */
export function wrapElement(el:HTMLElement, wrapper:HTMLElement):HTMLElement{
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    return wrapper;
}

/**
 * Throttle function
 * @param {Function} fn
 * @param {number} delay
 */
export function throttle(fn:Function, delay:number = 200) {
    let throttle = null;
    return function(){
        if (throttle){ return; }
        throttle = setTimeout(function(){
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
export function debounce (fn: Function, delay: number = 200) {
    let timeout
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn.call(this, ...args), delay)
    }
}

