import {
    exists, IEvent, inner, IObserverHandle,
    StateCallback, StateEvents, StateObject, StatePropCallback
} from "@hpcc-js/util";
import { IConnection, IOptions } from "../connection";
import { Activity, SMCService } from "../services/wsSMC";
import { TopologyService, TpTargetClusterQuery } from "../services/wsTopology";
import { TargetCluster } from "./targetCluster";

export interface TopologyStateEx {
    TargetClusters: TpTargetClusterQuery.TpTargetCluster[];
}
export class Topology extends StateObject<TopologyStateEx, TopologyStateEx> implements TopologyStateEx {
    protected connection: TopologyService;
    protected smcConnection: SMCService;

    //  Accessors  ---
    get properties(): TopologyStateEx { return this.get(); }
    get TargetClusters(): TpTargetClusterQuery.TpTargetCluster[] { return this.get("TargetClusters"); }
    get CTargetClusters(): TargetCluster[] {
        return this.TargetClusters.map(tc => TargetCluster.attach(this.connection, tc.Name, tc));
    }

    constructor(optsConnection: IOptions | IConnection | TopologyService) {
        super();
        if (optsConnection instanceof TopologyService) {
            this.connection = optsConnection;
            this.smcConnection = new SMCService(optsConnection.connectionOptions());
        } else {
            this.connection = new TopologyService(optsConnection);
            this.smcConnection = new SMCService(optsConnection);
        }
    }

    GetESPServiceBaseURL(type: string = ""): Promise<string> {
        return this.connection.TpServiceQuery({}).then(response => {
            const rootProtocol = this.connection.protocol();
            const ip = this.connection.ip();
            let port = rootProtocol === "https:" ? "18002xxx" : "8002xxx";
            if (exists("ServiceList.TpEspServers.TpEspServer", response)) {
                for (const item of response.ServiceList.TpEspServers.TpEspServer) {
                    if (exists("TpBindings.TpBinding", item)) {
                        for (const binding of item.TpBindings.TpBinding) {
                            if (binding.Service === type && binding.Protocol + ":" === rootProtocol) {
                                port = binding.Port;
                            }
                        }
                    }
                }
            }
            return `${rootProtocol}//${ip}:${port}/`;
        });
    }

    fetchTargetClusters(): Promise<TargetCluster[]> {
        return this.connection.TpTargetClusterQuery({ Type: "ROOT" }).then(response => {
            this.set({
                TargetClusters: response.TpTargetClusters.TpTargetCluster
            });
            return this.CTargetClusters;
        });
    }

    fetchActivity(): Promise<TargetCluster[]> {
        return this.smcConnection.Activity({}).then(response => {
            const retVal: TargetCluster[] = [];
            const context = this;
            function extractTargetCluster(propPath: string) {
                const tcs = inner(propPath, response) as Activity.TargetCluster3[];
                if (tcs) {
                    for (const tc of tcs) {
                        const state: any = {
                            ActiveWorkunit: response.Running.ActiveWorkunit.filter(aw => aw.ClusterName === tc.ClusterName),
                            ...tc
                        };
                        retVal.push(TargetCluster.attach(context.connection, tc.ClusterName, state));
                    }
                }
            }
            extractTargetCluster("ThorClusterList.TargetCluster");
            extractTargetCluster("RoxieClusterList.TargetCluster");
            extractTargetCluster("HThorClusterList.TargetCluster");
            return retVal;
        });
    }

    refresh(): Promise<TargetCluster[]> {
        return Promise.all([
            this.fetchTargetClusters(),
            this.fetchActivity()
        ]).then(async responses => {
            return responses[0];
        });
    }

    //  Monitoring  ---
    private _monitorHandle: any;
    private _monitorTickCount: number = 0;
    protected _monitor(): void {
        if (this._monitorHandle) {
            this._monitorTickCount = 0;
            return;
        }

        this._monitorHandle = setTimeout(() => {
            const refreshPromise: Promise<any> = this.hasEventListener() ? this.refresh() : Promise.resolve(null);
            refreshPromise.then(() => {
                this._monitor();
            });
            delete this._monitorHandle;
        }, this._monitorTimeoutDuraction());
    }

    private _monitorTimeoutDuraction(): number {
        this._monitorTickCount++;
        return 30000;
    }

    //  Events  ---
    on(eventID: StateEvents, propIDorCallback: StateCallback | keyof TopologyStateEx, callback?: StatePropCallback): this {
        if (this.isCallback(propIDorCallback)) {
            switch (eventID) {
                case "changed":
                    super.on(eventID, propIDorCallback);
                    break;
                default:
            }
        } else {
            switch (eventID) {
                case "changed":
                    super.on(eventID, propIDorCallback, callback!);
                    break;
                default:
            }
        }
        this._monitor();
        return this;
    }

    watch(callback: StateCallback, triggerChange: boolean = true): IObserverHandle {
        if (typeof callback !== "function") {
            throw new Error("Invalid Callback");
        }
        if (triggerChange) {
            setTimeout(() => {
                const props: any = this.properties;
                const changes: IEvent[] = [];
                for (const key in props) {
                    if (props.hasOwnProperty(props)) {
                        changes.push({ id: key, newValue: props[key], oldValue: undefined });
                    }
                }
                callback(changes);
            }, 0);
        }
        const retVal = super.addObserver("changed", callback);
        this._monitor();
        return retVal;
    }
}
