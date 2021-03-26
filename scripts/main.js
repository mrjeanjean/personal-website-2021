import './../styles/main.scss';

import {wrapElement} from './helpers';

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
const $slidersContainer = document.querySelector(".js-sliders-container");

function calculateScrollPercentage(target, childElemHeight) {
    try {
        if (!target) throw 'scrolling element height not found'

        let bool = target === document

        let scrollHeight = (() => {
            if (bool) return childElemHeight
            return target.scrollHeight
        })()

        if (!scrollHeight) throw 'child element height not found'

        let clientHeight = bool ? window.innerHeight : target.clientHeight
        let scrollTop = bool ? window.scrollY : target.scrollTop

        let gottaScroll = scrollHeight - clientHeight
        let percentage = Math.ceil((scrollTop / gottaScroll) * 100)

        return percentage
    } catch (err) {
        console.error(err)
    }
}


if ($slidersContainer) {
    const sliders = document.querySelectorAll(".slider");
    const $slidersWrapper = document.createElement("div");

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const multiplier = 0.8;

    document.body.style.overflowX = 'hidden';

    $slidersWrapper.classList.add("js-sliders-wrapper");

    $slidersWrapper.style.position = 'fixed';
    $slidersWrapper.style.left = '0';
    $slidersWrapper.style.top = '0';

    $slidersContainer.style.display = 'flex';
    document.body.style.height = `${sliders.length * multiplier * windowHeight}px`;
    $slidersContainer.style.width = `${sliders.length * windowWidth}px`;

    wrapElement($slidersContainer, $slidersWrapper);

    let debounceScrollInterval = null;
    let currentRatio = 0;
    let currentLeft = 0;

    window.addEventListener("scroll", () => {
        const ratio = window.scrollY / (sliders.length * multiplier - 1) / window.innerHeight;
        const totalLength = sliders.length * window.innerWidth - window.innerWidth;
        $slidersWrapper.style.left = `-${totalLength * ratio}px`;
        currentRatio = ratio;
        currentLeft = totalLength * ratio;
        clearTimeout(debounceScrollInterval);
        debounceScrollInterval = setTimeout(() => {
            let slideIndex = Math.round(currentLeft / window.innerWidth);
            let ratio = (slideIndex * window.innerWidth) / totalLength;

            const delta = Math.abs(
                (currentLeft / window.innerWidth * window.innerWidth) / totalLength -
                (slideIndex * window.innerWidth) / totalLength
            );

            console.log("DELTA : ", delta);

            if(delta < 0.08){
                window.scrollTo({
                    top: window.innerHeight * (sliders.length * multiplier -1) * ratio,
                    behavior: "smooth"
                });
            }


        }, 1000);
    });
}
