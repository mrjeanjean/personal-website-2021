import {debounce, throttle, wrapElement} from "./helpers";

/**
 * Page slider options
 * @property {number} multiplier - Scroll speed based on slide height * multiplier
 * @property {number} throttle - Computing rate on scroll event
 * @property {boolean} autoCenter - Auto center slide when user stop scrolling
 * @property {boolean} autoCenterDelay - How long wait before autoCenter slide
 */
interface PageSliderOptions {
    multiplier: number,
    scrollThrottle: number,
    autoCenter: boolean,
    autoCenterDelay: number
}

interface PageSliderData {
    leftIndent: number,
    currentSlide: HTMLElement,
    currentIndex: number,
    nbSlides: number,
    distanceToNextSlide: number
}

class PageSlider {
    $slidesContainer: HTMLElement;
    $pageSliderWrapper: HTMLElement;
    slides: NodeList;
    options: PageSliderOptions;
    data: PageSliderData;

    /**
     * @constructor
     * @param {HTMLElement} slideContainer
     * @param {PageSliderOptions} options
     */
    public constructor(slideContainer: HTMLElement, options: PageSliderOptions = null) {
        this.options = this.getDefaultOptions(options);

        this.$slidesContainer = slideContainer;
        this.$pageSliderWrapper = this.generateWrapper();
        this.slides = this.$slidesContainer.querySelectorAll(".slide");

        this.data = {
            leftIndent: 0,
            currentSlide: null,
            currentIndex: 0,
            nbSlides: this.slides.length,
            distanceToNextSlide: 0
        }

        this.draw();
        this.attachEvents();
    }

    /**
     * Move slider to reach the index slide position
     * @param {number} index
     */
    public goToSlide(index: number): void {
        const totalLength = this.data.nbSlides * window.innerWidth - window.innerWidth;
        const nextPosition = index * window.innerWidth;
        const widthRatio = nextPosition / totalLength;

        const nextScrollPosition = window.innerHeight * (this.data.nbSlides * this.options.multiplier - 1) * widthRatio;

        window.scrollTo({
            top: nextScrollPosition,
            behavior: "smooth"
        });
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

    /**
     * Set slider wrapper width based on window width
     * Set slider wrapper height based on window height and multiplier
     */
    private draw(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        document.body.style.overflowX = 'hidden';

        document.body.style.height = `${this.slides.length * this.options.multiplier * windowHeight}px`;
        this.$slidesContainer.style.display = 'flex';
        this.$slidesContainer.style.width = `${this.slides.length * windowWidth}px`;
    }

    /**
     * Attach slider events
     */
    private attachEvents(): void {
        this.moveSlider = this.moveSlider.bind(this);
        this.redrawSlider = this.redrawSlider.bind(this);

        const autoCenter = this.autoCenter();
        const updateSlidesClasses = this.updateSlideClasses();

        window.addEventListener("scroll", throttle(() => {
            this.moveSlider();
            this.updateData();

            updateSlidesClasses();
            autoCenter();
        }, this.options.scrollThrottle));

        window.addEventListener("resize", debounce(this.redrawSlider, 200));
    }

    /**
     * Move slider based on scroll Y position and update slider data
     */
    private moveSlider(): void {
        const ratio = window.scrollY / (this.slides.length * this.options.multiplier - 1) / window.innerHeight;
        const totalLength = this.slides.length * window.innerWidth - window.innerWidth;
        const leftIndent = (totalLength * ratio);

        this.$pageSliderWrapper.style.left = `-${leftIndent}px`;

        // Update slider data
        this.data = {
            ...this.data,
            leftIndent
        }
    }

    private redrawSlider(): void {
        this.draw();
    }

    /**
     * Center slider to the nearest slide
     * @return {Function}
     */
    private autoCenter(): Function {
        let waitDebounceTimeout = null;

        return () => {
            if (!this.options.autoCenter) {
                return;
            }
            clearTimeout(waitDebounceTimeout);
            waitDebounceTimeout = setTimeout(() => {
                if (this.data.distanceToNextSlide < 0.45) {
                    this.goToSlide(this.data.currentIndex);
                }
            }, this.options.autoCenterDelay);
        }
    }

    /**
     * Set slider data object
     */
    private updateData(): void {
        const currentIndex = Math.round(this.data.leftIndent / window.innerWidth);
        const currentSlide = this.slides[currentIndex] as HTMLElement || null;
        const distanceToNextSlide = Math.abs(
            this.data.leftIndent - (currentIndex * window.innerWidth)
        ) / (window.innerWidth / 2);

        this.data = {
            ...this.data,
            currentIndex,
            currentSlide,
            distanceToNextSlide
        }
    }

    private updateSlideClasses(): Function {
        let currentSlide: HTMLElement = null;
        return () => {
            if(currentSlide !== this.data.currentSlide){
                this.data.currentSlide.classList.add('active');
            }
            currentSlide = this.data.currentSlide;
        }
    }


    private getDefaultOptions(options: object): PageSliderOptions {
        options = options || {};
        return {
            multiplier: 1,
            scrollThrottle: 10,
            autoCenter: true,
            autoCenterDelay: 1000,
            ...options
        }
    }
}

export default PageSlider;
