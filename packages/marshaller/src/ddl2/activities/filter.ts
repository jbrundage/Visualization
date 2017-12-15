import { PropertyExt, publish } from "@hpcc-js/common";
import { DDL2 } from "@hpcc-js/ddl-shim";
import { IField } from "@hpcc-js/dgrid";
import { hashSum } from "@hpcc-js/util";
import { Element, ElementContainer } from "../viz";
import { Activity, ReferencedFields, stringify } from "./activity";

export class ColumnMapping extends PropertyExt {
    private _owner: Filter;

    @publish(null, "set", "Filter Fields", function (this: ColumnMapping) { return this.sourceOutFields(); }, { optional: true })
    remoteField: publish<this, string>;
    @publish(null, "set", "Local Fields", function (this: ColumnMapping) { return this.localFields(); }, { optional: true })
    localField: publish<this, string>;
    @publish("==", "set", "Filter Fields", ["==", "!=", ">", ">=", "<", "<=", "contains"])
    condition: publish<this, DDL2.IMappingConditionType>;

    constructor(owner: Filter) {
        super();
        this._owner = owner;
    }

    toDDL(): DDL2.IMapping {
        return {
            remoteFieldID: this.remoteField(),
            localFieldID: this.localField(),
            condition: this.condition()
        };
    }

    static fromDDL(owner: Filter, ddl: DDL2.IMapping): ColumnMapping {
        return new ColumnMapping(owner)
            .remoteField(ddl.remoteFieldID)
            .localField(ddl.localFieldID)
            .condition(ddl.condition)
            ;
    }

    hash() {
        return hashSum({
            remoteField: this.remoteField(),
            localField: this.localField(),
            condition: this.condition()
        });
    }

    localFields() {
        return this._owner.inFields().map(field => field.label);
    }

    sourceOutFields() {
        return this._owner.sourceOutFields().map(field => field.label);
    }

    createFilter(filterSelection: any[]): (localRow: any) => boolean {
        const lf = this.localField();
        const rf = this.remoteField();
        switch (this.condition()) {
            case "==":
                return (localRow) => localRow[lf] === filterSelection[0][rf];
            case "!=":
                return (localRow) => localRow[lf] !== filterSelection[0][rf];
            case "<":
                return (localRow) => localRow[lf] < filterSelection[0][rf];
            case "<=":
                return (localRow) => localRow[lf] <= filterSelection[0][rf];
            case ">":
                return (localRow) => localRow[lf] > filterSelection[0][rf];
            case ">=":
                return (localRow) => localRow[lf] >= filterSelection[0][rf];
            case "contains":
                return (localRow) => filterSelection.some(fsRow => localRow[lf] === fsRow[rf]);
        }
    }

    doFilter(row: object, filterSelection: any[]): boolean {
        return this.createFilter(filterSelection)(row);
    }
}
ColumnMapping.prototype._class += " ColumnMapping";

export class Filter extends PropertyExt {
    private _owner: Filters;

    @publish(null, "set", "Datasource", function (this: Filter) { return this.visualizationIDs(); }, { optional: true })
    source: publish<this, string>;
    @publish(false, "boolean", "Ignore null filters")
    nullable: publish<this, boolean>;
    @publish([], "propertyArray", "Mappings", null, { autoExpand: ColumnMapping })
    mappings: publish<this, ColumnMapping[]>;

    constructor(owner: Filters) {
        super();
        this._owner = owner;
    }

    toDDL(): DDL2.IFilterCondition {
        return {
            viewID: this.source(),
            nullable: this.nullable(),
            mappings: this.ddlMappings()
        };
    }

    static fromDDL(owner: Filters, ddl: DDL2.IFilterCondition): Filter {
        return new Filter(owner)
            .source(ddl.viewID)
            .nullable(ddl.nullable)
            .ddlMappings(ddl.mappings)
            ;
    }

    ddlMappings(): DDL2.IMapping[];
    ddlMappings(_: DDL2.IMapping[]): this;
    ddlMappings(_?: DDL2.IMapping[]): DDL2.IMapping[] | this {
        if (!arguments.length) return this.validMappings().map(mapping => mapping.toDDL());
        this.mappings(_.map(mapping => ColumnMapping.fromDDL(this, mapping)));
        return this;
    }

    visualizationIDs() {
        return this._owner.visualizationIDs();
    }

    hash(): string {
        return hashSum({
            source: this.source(),
            nullable: this.nullable(),
            mappings: this.validMappings().map(mapping => mapping.hash())
        });
    }

    validMappings(): ColumnMapping[] {
        return this.mappings().filter(mapping => !!mapping.localField() && !!mapping.remoteField());
    }

    appendMappings(mappings: Array<{ remoteField: string, localField: string }>): this {
        for (const mapping of mappings) {
            this.mappings().push(new ColumnMapping(this)
                .remoteField(mapping.remoteField)
                .localField(mapping.localField)
            );
        }
        return this;
    }

    inFields(): IField[] {
        return this._owner.inFields();
    }

    sourceViz(): Element {
        return this._owner.visualization(this.source());
    }

    sourceOutFields(): IField[] {
        return this.sourceViz().view().outFields();
    }

    sourceSelection(): any[] {
        return this.sourceViz().state().selection();
    }

    dataFilter(data: any[]): any[] {
        const selection = this.sourceSelection();
        if (selection.length === 0 && !this.nullable()) {
            return [];
        }
        return data;
    }

    rowFilter(row: object): boolean {
        const validMappings = this.validMappings();
        return validMappings.every(mapping => mapping.doFilter(row, this.sourceSelection()));
    }
}
Filter.prototype._class += " Filter";

export class Filters extends Activity {
    private _elementContainer: ElementContainer;

    @publish([], "propertyArray", "Filter", null, { autoExpand: Filter })
    filter: publish<this, Filter[]>;

    constructor(elementContainer: ElementContainer) {
        super();
        this._elementContainer = elementContainer;
    }

    toDDL(): DDL2.IFilter {
        return {
            type: "filter",
            conditions: this.conditions()
        };
    }

    static fromDDL(elementContainer: ElementContainer, ddl: DDL2.IFilter): Filters {
        return new Filters(elementContainer)
            .conditions(ddl.conditions)
            ;
    }

    toJS(): string {
        return `new Filters().conditions(${stringify(this.conditions())})`;
    }

    conditions(): DDL2.IFilterCondition[];
    conditions(_: DDL2.IFilterCondition[]): this;
    conditions(_?: DDL2.IFilterCondition[]): DDL2.IFilterCondition[] | this {
        if (!arguments.length) return this.validFilters().map(filter => filter.toDDL());
        this.filter(_.map(fc => Filter.fromDDL(this, fc)));
        return this;
    }

    visualizationIDs(): string[] {
        return this._elementContainer.visualizationIDs();
    }

    visualization(sourceID: string | PropertyExt): Element {
        return this._elementContainer.visualization(sourceID);
    }

    //  Activity overrides  ---
    hash(): string {
        return hashSum(this.validFilters().map(filter => filter.hash()));
    }

    exists(): boolean {
        return this.validFilters().length > 0;
    }

    updatedBy(): string[] {
        return this.validFilters().map(filter => filter.source());
    }

    referencedFields(refs: ReferencedFields): void {
        super.referencedFields(refs);
        const localFieldIDs: string[] = [];
        for (const filter of this.validFilters()) {
            const filterSource = filter.sourceViz().view();
            const remoteFieldIDs: string[] = [];
            for (const mapping of filter.validMappings()) {
                localFieldIDs.push(mapping.localField());
                remoteFieldIDs.push(mapping.remoteField());
            }
            filterSource.resolveFields(refs, remoteFieldIDs);
        }
        super.resolveInFields(refs, localFieldIDs);
    }

    exec(): Promise<void> {
        return super.exec();
    }

    pullData(): object[] {
        let data = super.pullData();
        const filters = this.validFilters();
        //  Test for null selection + nullable
        for (const filter of filters) {
            data = filter.dataFilter(data);
        }
        return data.filter(row => {
            return filters.every(filter => filter.rowFilter(row));
        });
    }

    //  --- --- ---
    validFilters(): Filter[] {
        return this.filter().filter(filter => filter.source());
    }

    appendFilter(source: Element, mappings: Array<{ remoteField: string, localField: string }>): this {
        this.filter().push(new Filter(this)
            .source(source.id())
            .appendMappings(mappings));
        return this;
    }
}
Filters.prototype._class += " Filters";
