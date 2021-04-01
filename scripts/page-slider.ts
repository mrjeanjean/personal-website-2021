import {debounce, throttle, unwrapElement, wrapElement} from "./helpers";

/**
 * Page slider options
 * @property {number} multiplier - Scroll speed based on slide height * multiplier
 * @property {number} throttle - Computing rate on scroll event
 * @property {boolean} autoCenter - Auto center slide when user stop scrolling
 * @property {boolean} autoCenterDelay - How long wait before autoCenter slide
 */
interface PageSliderOptions {
    multiplier?: number,
    scrollThrottle?: number,
    autoCenter?: boolean,
    autoCenterDelay?: number
}


/**
 * Representing current Page Slider state
 * @property {number} leftIndent - Left indent value of slide wrapper
 * @property {number} currentSlide
 * @property {boolean} currentIndex - Current slide index
 * @property {boolean} nbSlides
 * @property {boolean} distanceToNextSlide
 */
interface PageSliderData {
    leftIndent: number,
    currentSlide: HTMLElement,
    currentIndex: number,
    nbSlides: number,
    distanceToNextSlide: number
}

/**
 * Class used for horizontal scrolling effect
 */
class PageSlider {
    $slidesContainer: HTMLElement;
    $pageSliderWrapper: HTMLElement;
    slides: NodeListOf<HTMLElement>;
    options: PageSliderOptions;
    data: PageSliderData;

    onScrollFallback: any;
    onResizeFallback: any;

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

        this.onScroll = this.onScroll.bind(this);
        this.moveSlider = this.moveSlider.bind(this);
        this.draw = this.draw.bind(this);

        this.data = {
            leftIndent: 0,
            currentSlide: null,
            currentIndex: 0,
            nbSlides: this.slides.length,
            distanceToNextSlide: 0
        }

        this.draw();
        this.attachEvents();
        this.onScroll();
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
     * Move slider to the next slide
     */
    public next(){
        const nextIndex = this.data.currentIndex + 1;
        if( nextIndex < this.slides.length){
            this.goToSlide(nextIndex);
        }
    }

    /**
     * Move slider to the previous slide
     */
    public previous(){
        const prevIndex = this.data.currentIndex - 1;
        if( prevIndex >= 0){
            this.goToSlide(prevIndex);
        }
    }

    public clear(): void {
        window.removeEventListener("scroll", this.onScrollFallback);
        window.removeEventListener("resize", this.onResizeFallback);

        // Remove slide container css rules
        this.$slidesContainer.style.display = null;
        this.$slidesContainer.style.width = null;

        // Remove body css rules
        document.body.style.overflowX = null;
        document.body.style.height = null;

        unwrapElement(this.$pageSliderWrapper);
        this.slides.forEach($slide => $slide.classList.add("active"));
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
        this.onScrollFallback = throttle(this.onScroll(), this.options.scrollThrottle);
        this.onResizeFallback = debounce(this.draw, 200);

        window.addEventListener("scroll", this.onScrollFallback);
        window.addEventListener("resize", this.onResizeFallback);
    }

    /**
     * Trigger some actions on scroll events
     * @return {Function}
     */
    private onScroll(): Function {
        const autoCenter = this.autoCenter();
        const updateSlidesClasses = this.updateSlideClasses();

        return () => {
            this.moveSlider();
            this.updateData();

            updateSlidesClasses();
            autoCenter();
        };
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

    /**
     * Center slider to the nearest slide
     * @return {Function} - Callback as closure
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
     * Add css class on currently revealed slide
     * @return {Function} - Callback as closure
     */
    private updateSlideClasses(): Function {
        let currentSlide: HTMLElement = null;
        return () => {
            if (currentSlide !== this.data.currentSlide) {
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
