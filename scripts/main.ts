import './../styles/main.scss';

import PageSlider from "./page-slider";

// WORKS PANEL
//-----------------------------
const worksPanels = document.querySelectorAll(".js-works-panel");

worksPanels.forEach($workPanel => {
    const $workPanelButton = $workPanel.querySelector(".js-works-panel-button");

    $workPanelButton.addEventListener("click", () => {
        $workPanel.classList.toggle("active");
    })
});

// HORIZONTAL SLIDER
//-----------------------------
const $slidersContainer = document.querySelector(".js-page-slider") as HTMLElement;
if ($slidersContainer) {
    const pageSlider = new PageSlider($slidersContainer, {
        multiplier: 1
    });
}
