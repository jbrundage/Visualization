import { Cache, StateObject } from "@hpcc-js/util";
import { IConnection, IOptions } from "../connection";
import { GetTargetClusterInfo, MachineService } from "../services/wsMachine";
import { Activity } from "../services/wsSMC";
import { TopologyService, TpTargetClusterQuery } from "../services/wsTopology";
import { Machine } from "./machine";
import { Workunit } from "./workunit";

export class TargetClusterCache extends Cache<{ Name: string }, TargetCluster> {
    constructor() {
        super((obj) => {
            return obj.Name;
        });
    }
}
const _targetCluster = new TargetClusterCache();

export interface TpTargetClusterEx {
    MachineInfoEx: GetTargetClusterInfo.MachineInfoEx[];
    ActiveWorkunit: Activity.ActiveWorkunit[];
}

export type UTargetClusterState = TpTargetClusterQuery.TpTargetCluster & Activity.TargetCluster3 & TpTargetClusterEx;
export type ITargetClusterState = TpTargetClusterQuery.TpTargetCluster | Activity.TargetCluster3 | TpTargetClusterEx;
export class TargetCluster extends StateObject<UTargetClusterState, ITargetClusterState> implements UTargetClusterState {
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
    get ClusterName(): string { return this.get("ClusterName"); }
    get QueueName(): string { return this.get("QueueName"); }
    get QueueStatus(): string { return this.get("QueueStatus"); }
    get StatusDetails(): string { return this.get("StatusDetails"); }
    get Warning(): string { return this.get("Warning"); }
    get ClusterType(): number { return this.get("ClusterType"); }
    get ClusterSize(): number { return this.get("ClusterSize"); }
    get ClusterStatus(): number { return this.get("ClusterStatus"); }
    get MachineInfoEx(): GetTargetClusterInfo.MachineInfoEx[] { return this.get("MachineInfoEx", []); }
    get CMachineInfoEx(): Machine[] {
        return this.MachineInfoEx.map(machineInfoEx => Machine.attach(this.machineConnection, machineInfoEx.Address, machineInfoEx));
    }
    get ActiveWorkunit(): Activity.ActiveWorkunit[] { return this.get("ActiveWorkunit", []); }
    get CActiveWorkunit(): Workunit[] {
        return this.ActiveWorkunit.map(awu => Workunit.attach(this.connection.connectionOptions(), awu.Wuid, awu));
    }

    static attach(optsConnection: IOptions | IConnection | TopologyService, name: string, state?: ITargetClusterState): TargetCluster {
        const retVal: TargetCluster = _targetCluster.get({ Name: name }, () => {
            return new TargetCluster(optsConnection, name);
        });
        if (state) {
            retVal.set({
                ...state
            });
        }
        return retVal;
    }

    protected constructor(optsConnection: IOptions | IConnection | TopologyService, name: string) {
        super();
        if (optsConnection instanceof TopologyService) {
            this.connection = optsConnection;
            this.machineConnection = new MachineService(optsConnection.connectionOptions());
        } else {
            this.connection = new TopologyService(optsConnection);
            this.machineConnection = new MachineService(optsConnection);
        }
        this.clear({
            Name: name
        });
    }

    fetchMachines(request: GetTargetClusterInfo.Request = {}): Promise<Machine[]> {
        return this.machineConnection.GetTargetClusterInfo({
            TargetClusters: {
                Item: [`${this.Type}:${this.Name}`]
            },
            ...request
        }).then(response => {
            const retVal: GetTargetClusterInfo.MachineInfoEx[] = [];
            for (const machineInfo of response.TargetClusterInfoList.TargetClusterInfo) {
                for (const machineInfoEx of machineInfo.Processes.MachineInfoEx) {
                    retVal.push(machineInfoEx);
                }
            }
            this.set("MachineInfoEx", retVal);
            return this.CMachineInfoEx;
        });
    }

    machineStats(): { maxDisk: number; meanDisk: number } {
        let maxDisk = 0;
        let totalFree = 0;
        let total = 0;
        for (const machine of this.CMachineInfoEx) {
            for (const storageInfo of machine.Storage.StorageInfo) {
                totalFree += storageInfo.Available;
                total += storageInfo.Total;
                const usage = 1 - storageInfo.Available / storageInfo.Total;
                if (usage > maxDisk) {
                    maxDisk = usage;
                }
            }
        }
        return {
            maxDisk,
            meanDisk: 1 - (total ? totalFree / total : 1)
        };
    }
}
