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

    document.addEventListener('keydown', (e)=>{
        console.log(e.key)
        if(e.key === 'ArrowLeft'){
            pageSlider.goToSlide(2);
        }

        if(e.key === 'ArrowRight'){
            console.log(pageSlider.data);
        }
    });
}
