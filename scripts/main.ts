import './../styles/main.scss';

import PageSlider from "./page-slider";
import {PageSliderEventsType} from "./page-slider-events";
import {clamp, clampDistance, lerp} from "./helpers";

// WORKS PANEL
//-----------------------------
const $workPanel = document.querySelector(".js-works-panel");

const $workPanelButton = $workPanel.querySelector(".js-works-panel-button");

$workPanelButton.addEventListener("click", () => {
    $workPanel.classList.toggle("active");
})


// HORIZONTAL SLIDER
//-----------------------------
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
