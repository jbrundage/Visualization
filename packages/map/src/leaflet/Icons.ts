import { Icon, Map, Marker, point } from "leaflet";
import { ClusterLayer } from "./FeatureLayer";

export class Icons extends ClusterLayer {

    constructor(cluster = false) {
        super(cluster);
    }

    hasBounds(): boolean {
        return true;
    }

    private propValue(colIdx, row, defaultValue) {
        return (colIdx < 0 ? defaultValue : row[colIdx]) || defaultValue;
    }

    private _hashSum;
    layerUpdate(map: Map) {
        super.layerUpdate(map);

        const columns = this.columns();
        const latIdx = columns.indexOf(this.latitudeColumn());
        const longIdx = columns.indexOf(this.longtitudeColumn());
        const iconUrlIdx = columns.indexOf(this.iconUrlColumn());
        const tooltipIdx = columns.indexOf(this.tooltipColumn());
        const dbChecksum = this._db.checksum();
        const hashSum = this.hashSum([], {
            dbChecksum
        });

        if (this._hashSum !== hashSum) {
            this._hashSum = hashSum;
            this.clear();
            this.data().filter(row => !this.omitNullLatLong() || (!!row[latIdx] && !!row[longIdx])).forEach(row => {
                const marker = new Marker([row[latIdx], row[longIdx]], {
                    icon: new Icon({
                        iconUrl: this.propValue(iconUrlIdx, row, this.iconUrl()),
                        iconSize: [this.iconWidth(), this.iconHeight()],
                        iconAnchor: [this.iconAnchorX(), this.iconAnchorY()],
                        props: {
                            owner: this,
                            row
                        }
                    }),
                    draggable: false
                } as any)
                    .on("click", e => this.clickHandler(e, marker, row))
                    ;
                if (tooltipIdx >= 0) {
                    marker.bindTooltip(this.propValue(tooltipIdx, row, ""), {
                        direction: "top",
                        offset: point(0, -34)
                    });
                }
                this.add(marker);
            });
        }
    }

    _currSelRow;
    clickHandler(e, marker, row) {
        const sel = this._selection.click(marker._icon);
        this._currSelRow = sel ? row : undefined;
        this.click(this.rowToObj(row), "", sel);
    }

    //  Events  ---
    click(row, col, sel) {
    }
}
Icons.prototype._class += " map_Icons";

export interface Icons {
    latitudeColumn(): string;
    latitudeColumn(_: string);
    longtitudeColumn(): string;
    longtitudeColumn(_: string);
    omitNullLatLong(): boolean;
    omitNullLatLong(_: boolean);
    iconUrl(): string;
    iconUrl(_: string);
    iconUrl_exists(): boolean;
    iconUrlColumn(): string;
    iconUrlColumn(_: string);
    iconUrlColumn_exists(): boolean;
    iconHtml(): string;
    iconHtml(_: string);
    iconHtml_exists(): boolean;
    iconHtmlColumn(): string;
    iconHtmlColumn(_: string);
    iconHtmlColumn_exists(): boolean;
    iconWidth(): number;
    iconWidth(_: number);
    iconHeight(): number;
    iconHeight(_: number);
    iconAnchorX(): number;
    iconAnchorX(_: number);
    iconAnchorY(): number;
    iconAnchorY(_: number);
    tooltipColumn(): string;
    tooltipColumn(_: string);
    tooltipColumn_exists(): boolean;
}

Icons.prototype.publish("latitudeColumn", null, "set", "Latitude column", function () { return this.columns(); }, { optional: true });
Icons.prototype.publish("longtitudeColumn", null, "set", "Longtitude column", function () { return this.columns(); }, { optional: true });
Icons.prototype.publish("omitNullLatLong", true, "boolean", "Remove lat=0,lng=0 from IconsData", null, { tags: ["Basic"] });
Icons.prototype.publish("iconUrl", "", "string", "Icon URL", null, { disable: (w: Icons) => w.iconHtml_exists() || w.iconHtmlColumn_exists() });
Icons.prototype.publish("iconUrlColumn", null, "set", "Icon URL column", function () { return this.columns(); }, { optional: true, disable: (w: Icons) => w.iconHtml_exists() || w.iconHtmlColumn_exists() });
Icons.prototype.publish("iconHtml", "", "string", "Icon html", null, { disable: (w: Icons) => w.iconUrl_exists() || w.iconUrlColumn_exists() });
Icons.prototype.publish("iconHtmlColumn", null, "set", "Icon html column", function () { return this.columns(); }, { optional: true, disable: (w: Icons) => w.iconUrl_exists() || w.iconUrlColumn_exists() });
Icons.prototype.publish("iconWidth", 32, "number", "Icon width");
Icons.prototype.publish("iconHeight", 32, "number", "Icon height");
Icons.prototype.publish("iconAnchorX", 16, "number", "Icon Anchor X");
Icons.prototype.publish("iconAnchorY", 32, "number", "Icon Anchor Y");
Icons.prototype.publish("tooltipColumn", null, "set", "Tooltip column", function () { return this.columns(); }, { optional: true });

export class ClusterIcons extends Icons {
    constructor() {
        super(true);
    }
}
ClusterIcons.prototype._class += " map_ClusterIcons";
