import { StateObject } from "@hpcc-js/util";
import { IConnection, IOptions } from "../connection";
import { GetTargetClusterInfo, MachineService } from "../services/wsMachine";
import { TopologyService, TpTargetClusterQuery } from "../services/wsTopology";
import { Machine } from "./machine";

export interface TpTargetClusterEx extends TpTargetClusterQuery.TpTargetCluster {
}

export class TargetCluster extends StateObject<TpTargetClusterEx, TpTargetClusterEx> implements TpTargetClusterEx {
    protected connection: TopologyService;
    protected machineConnection: MachineService;

    get Name(): string { return this.get("Name"); }
    get Prefix(): string { return this.get("Prefix"); }
    get Type(): string { return this.get("Type"); }
    get TpClusters(): TpTargetClusterQuery.TpClusters { return this.get("TpClusters"); }
    get TpEclCCServers(): TpTargetClusterQuery.TpEclCCServers { return this.get("TpEclCCServers"); }
    get TpEclServers(): TpTargetClusterQuery.TpEclServers { return this.get("TpEclServers"); }
    get TpEclAgents(): TpTargetClusterQuery.TpEclAgents { return this.get("TpEclAgents"); }
    get TpEclSchedulers(): TpTargetClusterQuery.TpEclSchedulers { return this.get("TpEclSchedulers"); }

    constructor(optsConnection: IOptions | IConnection | TopologyService, targetCluster: TpTargetClusterQuery.TpTargetCluster) {
        super();
        if (optsConnection instanceof TopologyService) {
            this.connection = optsConnection;
            this.machineConnection = new MachineService(optsConnection.connectionOptions());
        } else {
            this.connection = new TopologyService(optsConnection);
            this.machineConnection = new MachineService(optsConnection);
        }

        this.set({
            ...targetCluster
        });
    }

    machines(request: GetTargetClusterInfo.Request): Promise<Machine[]> {
        return this.machineConnection.GetTargetClusterInfo({
            TargetClusters: {
                Item: [`${this.Type}:${this.Name}`]
            },
            ...request
        }).then(response => {
            const retVal: Machine[] = [];
            for (const machineInfo of response.TargetClusterInfoList.TargetClusterInfo) {
                for (const machineInfoEx of machineInfo.Processes.MachineInfoEx) {
                    retVal.push(new Machine(this.machineConnection, machineInfoEx));
                }
            }
            return retVal;
        });
    }
}
