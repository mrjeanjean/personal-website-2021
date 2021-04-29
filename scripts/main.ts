import './../styles/main.scss';

import PageSlider from "./page-slider";
import {PageSliderEventsType} from "./page-slider-events";
import {reverseString, throttle} from "./helpers";

/**
 * Works panel
 * display works when button is clicked
 */
const $workPanel = document.querySelector(".js-works-panel");

const $workPanelButton = $workPanel.querySelector(".js-works-panel-button");

$workPanelButton.addEventListener("click", () => {
    $workPanel.classList.toggle("active");
    document.body.classList.toggle("work-panel-active");
})


/**
 * Horizontal slider instance and configuration
 */
const $slidersContainer = document.querySelector(".js-page-slider") as HTMLElement;
let pageSlider = buildPageSlider();

function buildPageSlider():PageSlider{
    let pageSlider = new PageSlider($slidersContainer, {
        multiplier: 1
    });

    pageSlider.events.add(PageSliderEventsType.updated, (data: any) => {
        const currentColor = data.currentSlide.dataset.slideColor;
        if (currentColor) {
            $workPanel.setAttribute("data-panel-color", currentColor);
        }
    });

    return pageSlider;
}


/**
 * Responsive rules
 */
function detectDevice(){
    if( window.innerWidth < 1200){
        pageSlider?.clear();
        pageSlider = null;
        return;
    }

    if(!pageSlider){
        pageSlider = buildPageSlider();
    }
}

window.addEventListener('resize', throttle(detectDevice, 300));
window.addEventListener('load', detectDevice);

/**
 * Cheap email obfuscation using hashing array
 */
const em = ["ag", "te", "na", "@", "vom", "oe"];
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


