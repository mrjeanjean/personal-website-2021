import {debounce, throttle, wrapElement} from "./helpers";

/**
 * Page slider options
 * @property {number} multiplier - Scroll speed based on slide height * multiplier
 * @property {number} throttle - Computing rate on scroll event
 * @property {boolean} autoCenter - Auto center slide when user stop scrolling
 * @property {boolean} autoCenterDelay - How long wait before autoCenter slide
 */
interface pageSliderOptions {
    multiplier: number,
    scrollThrottle: number,
    autoCenter: boolean,
    autoCenterDelay: number
}

class PageSlider {
    $slidesContainer: HTMLElement;
    $pageSliderWrapper: HTMLElement;
    slides: NodeList;
    options: pageSliderOptions

    /**
     * @param {HTMLElement} slideContainer
     * @param {pageSliderOptions} options
     */
    public constructor(slideContainer: HTMLElement, options: pageSliderOptions = null) {
        this.options = this.getDefaultOptions(options);

        this.$slidesContainer = slideContainer;
        this.$pageSliderWrapper = this.generateWrapper();
        this.slides = this.$slidesContainer.querySelectorAll(".slide");

        this.draw();
        this.attachEvents();
    }

    /**
     * @return {HTMLElement}
     */
    private generateWrapper(): HTMLElement {
        const $pageSliderWrapper = document.createElement("div");

        $pageSliderWrapper.classList.add("js-page-slider-wrapper");
        $pageSliderWrapper.style.position = 'fixed';
        $pageSliderWrapper.style.left = '0';
        $pageSliderWrapper.style.top = '0';

        wrapElement(this.$slidesContainer, $pageSliderWrapper);

        return $pageSliderWrapper;
    }

    private draw(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        document.body.style.overflowX = 'hidden';

        document.body.style.height = `${this.slides.length * this.options.multiplier * windowHeight}px`;
        this.$slidesContainer.style.display = 'flex';
        this.$slidesContainer.style.width = `${this.slides.length * windowWidth}px`;
    }

    private attachEvents() {
        this.moveSlider = this.moveSlider.bind(this);
        this.redrawSlider = this.redrawSlider.bind(this);

        window.addEventListener("scroll", throttle(this.moveSlider, this.options.scrollThrottle));
        window.addEventListener("resize", debounce(this.redrawSlider, 200));
    }

    private moveSlider() {
        const ratio = window.scrollY / (this.slides.length * this.options.multiplier - 1) / window.innerHeight;
        const totalLength = this.slides.length * window.innerWidth - window.innerWidth;
        this.$pageSliderWrapper.style.left = `-${totalLength * ratio}px`;
    }

    private redrawSlider(){
        this.draw();
    }

    private getDefaultOptions(options: object): pageSliderOptions {
        options = options || {};
        return {
            multiplier: 1,
            scrollThrottle: 10,
            autoCenter: true,
            autoCenterDelay: 3000,
            ...options
        }
    }
}

export default PageSlider;

const $slidersContainer = null;
if ($slidersContainer) {
    const sliders = document.querySelectorAll(".slider");
    const $pageSliderWrapper = document.createElement("div");

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const multiplier = 0.8;

    document.body.style.overflowX = 'hidden';

    $pageSliderWrapper.classList.add("js-sliders-wrapper");

    $pageSliderWrapper.style.position = 'fixed';
    $pageSliderWrapper.style.left = '0';
    $pageSliderWrapper.style.top = '0';

    $slidersContainer.style.display = 'flex';
    document.body.style.height = `${sliders.length * multiplier * windowHeight}px`;
    $slidersContainer.style.width = `${sliders.length * windowWidth}px`;

    wrapElement($slidersContainer, $pageSliderWrapper);

    let debounceScrollInterval = null;
    let currentRatio = 0;
    let currentLeft = 0;

    window.addEventListener("scroll", () => {
        const ratio = window.scrollY / (sliders.length * multiplier - 1) / window.innerHeight;
        const totalLength = sliders.length * window.innerWidth - window.innerWidth;
        $pageSliderWrapper.style.left = `-${totalLength * ratio}px`;
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

            if (delta < 0.08) {
                window.scrollTo({
                    top: window.innerHeight * (sliders.length * multiplier - 1) * ratio,
                    behavior: "smooth"
                });
            }


        }, 1000);
    });
}

