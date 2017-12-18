import { publish } from "@hpcc-js/common";
import { ElementContainer } from "../model";
import { ActivityPipeline } from "./activity";
import { DSPicker } from "./dspicker";
import { Filters } from "./filter";
import { GroupBy } from "./groupby";
import { Limit } from "./limit";
import { Project } from "./project";
import { Sort } from "./sort";

export class HipiePipeline extends ActivityPipeline {
    _elementContainer: ElementContainer;

    @publish(null, "widget", "Data Source 2")
    dataSource: publish<this, DSPicker>;
    @publish(null, "widget", "Client Filters")
    filters: publish<this, Filters>;
    @publish(null, "widget", "Project")
    project: publish<this, Project>;
    @publish(null, "widget", "Group By")
    groupBy: publish<this, GroupBy>;
    @publish(null, "widget", "Source Columns")
    sort: publish<this, Sort>;
    @publish(null, "widget", "Mappings")
    mappings: publish<this, Project>;
    @publish(null, "widget", "Limit output")
    limit: publish<this, Limit>;

    constructor(model: ElementContainer, viewID: string) {
        super();
        this._elementContainer = model;
        this._id = viewID;
        this.dataSource(new DSPicker(this));
        this.dataSource().monitor((id, newVal, oldVal) => {
            this.broadcast(id, newVal, oldVal, this.dataSource());
        });
        this.filters(new Filters(model));
        this.project(new Project());
        this.groupBy(new GroupBy());
        this.sort(new Sort());
        this.limit(new Limit());
        this.mappings(new Project());
        this.activities([
            this.dataSource(),
            this.filters(),
            this.project(),
            this.groupBy(),
            this.sort(),
            this.limit(),
            this.mappings()
        ]);
    }

}
