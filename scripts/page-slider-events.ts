export enum PageSliderEventsType{
    slideChanged,
    updated
}

interface PageSliderEventsItem{
    type: PageSliderEventsType
    callback: Function,
}

/**
 * Class representing events fired by PageSlider
 */
class PageSliderEvents{
    observers: Array<PageSliderEventsItem>;

    public constructor() {
        this.observers = new Array<PageSliderEventsItem>();
    }

    /**
     * @param {PageSliderEventsType} type
     * @param {Function} callback
     */
    public add(type:PageSliderEventsType, callback: Function){
        this.observers.push({
            type,
            callback
        })
    }

    /**
     * @param {PageSliderEventsType} type
     * @param {Function} callback
     */
    public remove(type:PageSliderEventsType, callback: Function){
        this.observers = this.observers.filter(entry=>
            entry.type !== type && entry.callback !== callback
        )
    }

    /**
     * @param {PageSliderEventsType} type
     * @param {Object} data
     */
    public fire(type: PageSliderEventsType, data:any){
        this.observers.forEach(entry=>{
           if(entry.type === type){
               entry.callback(data);
           }
        });
    }
}

export default PageSliderEvents;
