import './../styles/main.scss';

import PageSlider from "./page-slider";
import {PageSliderEventsType} from "./page-slider-events";
import {reverseString} from "./helpers";

/**
 * Works panel
 * display works when button is clicked
 */
const $workPanel = document.querySelector(".js-works-panel");

const $workPanelButton = $workPanel.querySelector(".js-works-panel-button");

$workPanelButton.addEventListener("click", () => {
    $workPanel.classList.toggle("active");
})


/**
 * Horizontal slider instance and configuration
 */
const $slidersContainer = document.querySelector(".js-page-slider") as HTMLElement;
let pageSlider = new PageSlider($slidersContainer, {
    multiplier: 1
});

pageSlider.events.add(PageSliderEventsType.updated, (data: any) => {
    const currentColor = data.currentSlide.dataset.slideColor;
    if (currentColor) {
        $workPanel.setAttribute("data-panel-color", currentColor);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        pageSlider.previous();
    }

    if (e.key === 'ArrowRight') {
        pageSlider.next();
    }
});

/**
 * Basic email obfuscation using hashing array
 */
const em = [
    "ag",
    "te",
    "na",
    "@",
    "vom",
    "oe",
];
const $emailTarget = document.querySelector(".js-email-helper") as HTMLLinkElement;
if ($emailTarget) {

    let decodedEm = function (email:Array<string>): string{
        return email.reduce((prev, current) => {
            return prev + reverseString(current);
        }, "") + ".fr";
    }(em);

    $emailTarget.href = `mailto:${decodedEm}`;

    setTimeout(()=>{
        $emailTarget.querySelector(".js-email-target").innerHTML = decodedEm;
    }, 300);
}


