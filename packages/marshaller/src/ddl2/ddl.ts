import { DDL2 } from "@hpcc-js/ddl-shim";
import { IField } from "@hpcc-js/dgrid";
import { Activity, ActivityPipeline, ReferencedFields } from "./activities/activity";
import { Databomb, Form } from "./activities/databomb";
import { DSPicker } from "./activities/dspicker";
import { Filters } from "./activities/filter";
import { GroupBy } from "./activities/groupby";
import { HipiePipeline } from "./activities/hipiepipeline";
import { Limit } from "./activities/limit";
import { LogicalFile } from "./activities/logicalfile";
import { Project } from "./activities/project";
import { Param, RoxieRequest } from "./activities/roxie";
import { Sort } from "./activities/sort";
import { WUResult } from "./activities/wuresult";
import { Element, ElementContainer } from "./viz";

export { DDL2 };

export class DDLAdapter {
    private _elementContainer: ElementContainer;
    private _dsDedup: { [key: string]: DDL2.DatasourceType };

    constructor(dashboard: ElementContainer) {
        this._elementContainer = dashboard;
    }

    writeDatasource(ds, refs: ReferencedFields): DDL2.DatasourceType {
        const dsDetails = ds.details();
        if (dsDetails instanceof WUResult) {
            const ddl: DDL2.IWUResult = {
                type: "wuresult",
                id: ds.id(),
                url: dsDetails.url(),
                wuid: dsDetails.wuid(),
                resultName: dsDetails.resultName(),
                fields: this.writeFields(dsDetails.localFields().filter(field => refs[dsDetails.id()] && refs[dsDetails.id()].indexOf(field.id) >= 0))
            };
            return ddl;
        } else if (dsDetails instanceof LogicalFile) {
            const ddl: DDL2.ILogicalFile = {
                type: "logicalfile",
                id: ds.id(),
                url: dsDetails.url(),
                logicalFile: dsDetails.logicalFile(),
                fields: this.writeFields(dsDetails.localFields().filter(field => refs[dsDetails.id()] && refs[dsDetails.id()].indexOf(field.id) >= 0))
            };
            return ddl;
        } else if (dsDetails instanceof Form) {
            const ddl: DDL2.IForm = {
                type: "form",
                id: ds.id(),
                fields: dsDetails.outFields().map((field): DDL2.IField => {
                    return {
                        id: field.id,
                        type: field.type as any,
                        default: ""
                    };
                })
            };
            return ddl;
        } else if (dsDetails instanceof Databomb) {
            const ddl: DDL2.IDatabomb = {
                type: "databomb",
                id: ds.id(),
                fields: this.writeFields(dsDetails.localFields().filter(field => refs[dsDetails.id()] && refs[dsDetails.id()].indexOf(field.id) >= 0))
            };
            return ddl;
        } else if (dsDetails instanceof RoxieRequest) {
            const ddl: DDL2.IRoxieService = {
                type: "roxieservice",
                id: ds.id(),
                url: dsDetails.url(),
                querySet: dsDetails.querySet(),
                queryID: dsDetails.queryID(),
                resultName: dsDetails.resultName(),
                fields: this.writeFields(dsDetails.localFields().filter(field => refs[dsDetails.id()] && refs[dsDetails.id()].indexOf(field.id) >= 0))
            };
            return ddl;
        }
        return undefined;
    }

    readDatasource(_ddlDS: DDL2.DatasourceType, ds: DSPicker): this {
        ds
            .id(_ddlDS.id)
            .type(_ddlDS.type)
            ;
        const dsDetails = ds.details();
        if (dsDetails instanceof WUResult) {
            const ddlDS = _ddlDS as DDL2.IWUResult;
            dsDetails
                .url(ddlDS.url)
                .wuid(ddlDS.wuid)
                .resultName(ddlDS.resultName)
                ;
        } else if (dsDetails instanceof LogicalFile) {
            const ddlDS = _ddlDS as DDL2.ILogicalFile;
            dsDetails
                .url(ddlDS.url)
                .logicalFile(ddlDS.logicalFile)
                ;
        } else if (dsDetails instanceof Form) {
            const ddlDS = _ddlDS as DDL2.IForm;
            const payload = {};
            for (const field of ddlDS.fields) {
                switch (field.type) {
                    case "boolean":
                        payload[field.id] = field.default || false;
                        break;
                    case "number":
                        payload[field.id] = field.default || 0;
                        break;
                    case "string":
                    default:
                        payload[field.id] = field.default || "";
                        break;
                }
            }
            dsDetails.payload(payload);
        } else if (dsDetails instanceof Databomb) {
        } else if (dsDetails instanceof RoxieRequest) {
            const ddlDS = _ddlDS as DDL2.IRoxieService;
            dsDetails
                .url(ddlDS.url)
                .querySet(ddlDS.querySet)
                .queryID(ddlDS.queryID)
                ;
        }
        return this;
    }

    writeDatasources(): DDL2.DatasourceType[] {
        const retVal: DDL2.DatasourceType[] = [];
        for (const viz of this._elementContainer.visualizations()) {
            const ds = viz.view().dataSource();
            if (!this._dsDedup[ds.hash()]) {
                const ddlDataSource = this.writeDatasource(ds, {});
                this._dsDedup[ds.hash()] = ddlDataSource;
                retVal.push(ddlDataSource);
            }
        }
        return retVal;
    }

    writeFields(fields: IField[]): DDL2.IField[] {
        return fields.map(field => {
            const retVal: DDL2.IField = {
                id: field.id,
                type: field.type as any,  //  TODO Align DGrid field type and DDL2 field type
                default: undefined
            };
            if (field.children && field.children.length) {
                retVal.children = this.writeFields(field.children);
            }
            return retVal;
        });
    }

    writeFilters(filters: Filters): DDL2.IFilter {
        if (!filters.exists()) return undefined;
        return filters.toDDL();
    }

    readFilters(ddlFilter: DDL2.IFilter, ec: ElementContainer): Filters {
        return Filters.fromDDL(ec, ddlFilter);
    }

    writeProject(project: Project): DDL2.IProject {
        if (!project.exists()) return undefined;
        return project.toDDL();
    }

    readProject(ddlProject: DDL2.IProject): Project {
        return Project.fromDDL(ddlProject);
    }

    writeGroupBy(gb: GroupBy): DDL2.IGroupBy {
        if (!gb.exists()) return undefined;
        return gb.toDDL();
    }

    readGroupBy(ddlGB: DDL2.IGroupBy): GroupBy {
        return GroupBy.fromDDL(ddlGB);
    }

    writeSort(sort: Sort): DDL2.ISort {
        if (!sort.exists()) return undefined;
        return sort.toDDL();
    }

    readSort(ddlSort: DDL2.ISort): Sort {
        return Sort.fromDDL(ddlSort);
    }

    writeLimit(limit: Limit): DDL2.ILimit {
        if (!limit.exists()) return undefined;
        return limit.toDDL();
    }

    readLimit(ddlLimit: DDL2.ILimit): Limit {
        return Limit.fromDDL(ddlLimit);
    }

    writeDatasourceRef(ds: DSPicker, refs: ReferencedFields): DDL2.IRoxieServiceRef | DDL2.IDatasourceRef {
        const dsDetails = ds.details();
        if (dsDetails instanceof RoxieRequest) {
            return {
                id: this._dsDedup[ds.hash()].id,
                fields: this.writeFields(dsDetails.localFields().filter(field => refs[dsDetails.id()] && refs[dsDetails.id()].indexOf(field.id) >= 0)),
                request: dsDetails.request().map((rf): DDL2.IRequestField => {
                    return {
                        source: rf.source(),
                        remoteFieldID: rf.remoteFieldID(),
                        localFieldID: rf.localFieldID()
                    };
                })
            };
        } else {
            return {
                id: this._dsDedup[ds.hash()].id,
                fields: this.writeFields(dsDetails.localFields().filter(field => refs[dsDetails.id()] && refs[dsDetails.id()].indexOf(field.id) >= 0))
            };
        }
    }

    readDatasourceRef(ddlDSRef: DDL2.IRoxieServiceRef | DDL2.IDatasourceRef, ds: DSPicker, view: HipiePipeline): this {
        const ddlDS = this._dsDedup[ddlDSRef.id];
        this.readDatasource(ddlDS, ds);
        const dsDetails = ds.details();
        if (dsDetails instanceof RoxieRequest && DDL2.isIRoxieServiceRef(ddlDSRef)) {
            dsDetails.request(ddlDSRef.request.map(rf => {
                return new Param(view)
                    .source(rf.source)
                    .remoteFieldID(rf.remoteFieldID)
                    .localFieldID(rf.localFieldID)
                    ;
            }));
        }
        return this;
    }

    writeActivities(view: ActivityPipeline): DDL2.IActivity[] {
        return view.activities().map(activity => {
            if (activity instanceof Filters) {
                return this.writeFilters(activity);
            } else if (activity instanceof Project) {
                return this.writeProject(activity);
            } else if (activity instanceof GroupBy) {
                return this.writeGroupBy(activity);
            } else if (activity instanceof Sort) {
                return this.writeSort(activity);
            } else if (activity instanceof Limit) {
                return this.writeLimit(activity);
            }
        }).filter(activity => !!activity);
    }

    writeDDLViews(refs: ReferencedFields): DDL2.IView[] {
        for (const viz of this._elementContainer.visualizations()) {
            viz.view().referencedFields(refs);
        }
        return this._elementContainer.visualizations().map(viz => {
            const view = viz.view();
            const ds = view.dataSource();
            const retVal = {
                id: viz.id(),
                datasource: this.writeDatasourceRef(ds, refs),
                activities: this.writeActivities(view)
            };
            const ddlDatasource = this._dsDedup[ds.hash()];
            for (const field of retVal.datasource.fields) {
                if (ddlDatasource.fields.filter(ddlField => ddlField.id === field.id).length === 0) {
                    ddlDatasource.fields.push(field);
                }
            }
            return retVal;
        });
    }

    readDDLViews(ddlViews: DDL2.IView[]) {
        for (const ddlView of ddlViews) {
            const viz = new Element(this._elementContainer).id(ddlView.id).title(ddlView.id);
            this._elementContainer.addVisualization(viz);
            const view = viz.view();
            this.readDatasourceRef(ddlView.datasource, view.dataSource(), view);
            const activities: Activity[] = [
                view.dataSource(),
                ...ddlView.activities.map(activity => {
                    if (DDL2.isFilterActivity(activity)) {
                        return this.readFilters(activity, this._elementContainer);
                    } else if (DDL2.isProjectActivity(activity)) {
                        return this.readProject(activity);
                    } else if (DDL2.isGroupByActivity(activity)) {
                        return this.readGroupBy(activity);
                    } else if (DDL2.isSortActivity(activity)) {
                        return this.readSort(activity);
                    } else if (DDL2.isLimitActivity(activity)) {
                        return this.readLimit(activity);
                    }
                })
            ];
            view.activities(activities);
        }
        // this._dashboard.syncWidgets();
    }

    write(): DDL2.Schema {
        this._dsDedup = {};
        const refs = {};
        const retVal = {
            datasources: this.writeDatasources(),
            dataviews: this.writeDDLViews(refs)
        };
        return retVal;
    }

    read(ddl: DDL2.Schema) {
        this._dsDedup = {};
        for (const ds of ddl.datasources) {
            this._dsDedup[ds.id] = ds;
        }
        this.readDDLViews(ddl.dataviews);
    }
}
