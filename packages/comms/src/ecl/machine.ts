import { StateObject } from "@hpcc-js/util";
import { IConnection, IOptions } from "../connection";
import { GetTargetClusterInfo, MachineService } from "../services/wsMachine";

export interface TpTargetClusterEx extends GetTargetClusterInfo.MachineInfoEx {
}

export class Machine extends StateObject<TpTargetClusterEx, TpTargetClusterEx> implements TpTargetClusterEx {
    protected connection: MachineService;

    get Address(): string { return this.get("Address"); }
    get ConfigAddress(): string { return this.get("ConfigAddress"); }
    get Name(): string { return this.get("Name"); }
    get ProcessType(): string { return this.get("ProcessType"); }
    get DisplayType(): string { return this.get("DisplayType"); }
    get Description(): string { return this.get("Description"); }
    get AgentVersion(): string { return this.get("AgentVersion"); }
    get Contact(): string { return this.get("Contact"); }
    get Location(): string { return this.get("Location"); }
    get UpTime(): string { return this.get("UpTime"); }
    get ComponentName(): string { return this.get("ComponentName"); }
    get ComponentPath(): string { return this.get("ComponentPath"); }
    get RoxieState(): string { return this.get("RoxieState"); }
    get RoxieStateDetails(): string { return this.get("RoxieStateDetails"); }
    get OS(): number { return this.get("OS"); }
    get ProcessNumber(): number { return this.get("ProcessNumber"); }
    get Processors(): GetTargetClusterInfo.Processors { return this.get("Processors"); }
    get Storage(): GetTargetClusterInfo.Storage { return this.get("Storage"); }
    get Running(): GetTargetClusterInfo.Running { return this.get("Running"); }
    get PhysicalMemory(): GetTargetClusterInfo.PhysicalMemory { return this.get("PhysicalMemory"); }
    get VirtualMemory(): GetTargetClusterInfo.VirtualMemory { return this.get("VirtualMemory"); }
    get ComponentInfo(): GetTargetClusterInfo.ComponentInfo { return this.get("ComponentInfo"); }

    constructor(optsConnection: IOptions | IConnection | MachineService, machineInfo: GetTargetClusterInfo.MachineInfoEx) {
        super();
        if (optsConnection instanceof MachineService) {
            this.connection = optsConnection;
        } else {
            this.connection = new MachineService(optsConnection);
        }

        this.set({
            ...machineInfo
        });
    }
}
