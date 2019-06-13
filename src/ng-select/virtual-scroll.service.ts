import { isDefined } from './value-utils';

export interface ItemsRangeResult {
    scrollHeight: number;
    topPadding: number;
    start: number;
    end: number;
}

export interface PanelDimensions {
    itemHeight: number;
    panelHeight: number;
    itemsPerViewport: number;
}

export class VirtualScrollService {

    private _dimensions: PanelDimensions;

    get dimensions() {
        return this._dimensions;
    }

    calculateItems(scrollPos: number, itemsLength: number, buffer: number): ItemsRangeResult {
        const d = this._dimensions;
        const scrollHeight = d.itemHeight * itemsLength;

        const scrollTop = Math.max(0, scrollPos);
        const indexByScrollTop = scrollTop / scrollHeight * itemsLength;
        let end = Math.min(itemsLength, Math.ceil(indexByScrollTop) + (d.itemsPerViewport + 1));

        const maxStartEnd = end;
        const maxStart = Math.max(0, maxStartEnd - d.itemsPerViewport);
        let start = Math.min(maxStart, Math.floor(indexByScrollTop));

        let topPadding = d.itemHeight * Math.ceil(start) - (d.itemHeight * Math.min(start, buffer));
        topPadding = !isNaN(topPadding) ? topPadding : 0;
        start = !isNaN(start) ? start : -1;
        end = !isNaN(end) ? end : -1;
        start -= buffer;
        start = Math.max(0, start);
        end += buffer;
        end = Math.min(itemsLength, end);

        return {
            topPadding,
            scrollHeight,
            start,
            end
        }
    }

    setDimensions(itemHeight: number, panelHeight: number) {
        const itemsPerViewport = Math.max(1, Math.floor(panelHeight / itemHeight));
        this._dimensions = {
            itemHeight,
            panelHeight,
            itemsPerViewport
        };
    }

    getScrollTo(itemTop: number, itemHeight: number, lastScroll: number) {
        const itemBottom = itemTop + itemHeight;
        const top = isDefined(lastScroll) ? lastScroll : itemTop; // TODO: needs fix, lastScroll always defined
        const bottom = top + this.dimensions.panelHeight;

        if (itemBottom > bottom) {
            return top + itemBottom - bottom;
        } else if (itemTop <= top) {
            return itemTop;
        }
    }
}
