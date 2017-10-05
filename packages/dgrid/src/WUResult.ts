import { publish } from "@hpcc-js/common";
import { Result } from "@hpcc-js/comms";
import { Common } from "./Common";
import { Store } from "./WUResultStore";

export class WUResult extends Common {
    protected _prevResultID: string;

    constructor() {
        super();
    }

    @publish(undefined, "string", "URL to WsWorkunits")
    wsWorkunitsUrl: { (): string, (_: string): WUResult };
    @publish(undefined, "string", "Workunit ID")
    wuid: { (): string, (_: string): WUResult };
    @publish(undefined, "string", "Result Name")
    resultName: { (): string, (_: string): WUResult };
    @publish(undefined, "number", "Sequence Number")
    sequence: { (): number, (_: number): WUResult };
    @publish("", "string", "Logical File Name")
    logicalFile: { (): string, (_: string): WUResult };

    calcResult(): Result | null {
        if (this.wuid() && this.resultName()) {
            return new Result({ baseUrl: this.wsWorkunitsUrl() }, this.wuid(), this.resultName());
        } else if (this.wuid() && this.sequence() !== undefined) {
            return new Result({ baseUrl: this.wsWorkunitsUrl() }, this.wuid(), this.sequence());
        } else if (this.logicalFile()) {
            return new Result({ baseUrl: this.wsWorkunitsUrl() }, this.logicalFile());
        }
        return null;
    }

    calcResultID(): string {
        let retVal = this.wsWorkunitsUrl() + "->";
        if (this.wuid() && this.resultName()) {
            retVal += this.wuid() + "->" + this.resultName();
        } else if (this.wuid() && this.sequence() !== undefined) {
            retVal += this.wuid() + "->" + this.sequence();
        } else if (this.logicalFile()) {
            retVal += this.logicalFile();
        }
        return retVal;
    }

    update(domNode, element) {
        super.update(domNode, element);
        if (this._prevResultID !== this.calcResultID()) {
            this._prevResultID = this.calcResultID();
            const result = this.calcResult();
            if (result) {
                result.fetchXMLSchema().then((schema) => {
                    const store = new Store(result, schema);
                    this._dgrid.set("columns", store.columns());
                    this._dgrid.set("collection", store);
                });
            }
        }
    }

    click(row, col, sel) {
    }
}
WUResult.prototype._class += " dgrid_WUResult";
