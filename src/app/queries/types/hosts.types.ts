import { ICR, INameNamespaceRef, IStatusCondition, IVMwareObjRef } from './common.types';

export interface IHostNetworkAdapter {
  name: string;
  ipAddress: string;
  linkSpeed: number;
  mtu: number;
}

export interface IHost {
  id: string;
  parent: IVMwareObjRef;
  revision: number;
  name: string;
  selfLink: string;
  inMaintenance: boolean;
  thumbprint: string;
  cpuSockets: number;
  cpuCores: number;
  productName: string;
  productVersion: string;
  networking: {
    vNICs: {
      key: string;
      linkSpeed: number;
    }[];
    pNICs: {
      key: string;
      portGroup: string;
      dPortGroup: string;
      ipAddress: string;
      mtu: number;
    }[];
    portGroups: {
      key: string;
      name: string;
      vSwitch: string;
    }[];
    switches: {
      key: string;
      name: string;
      portGroups: string[];
      pNICs: string[];
    }[];
  };
  networks: IVMwareObjRef[];
  datastores: IVMwareObjRef[];
  vms: IVMwareObjRef[];
  networkAdapters: IHostNetworkAdapter[];
}

export interface IHostConfig extends ICR {
  apiVersion: string;
  kind: 'Host';
  spec: {
    id: string;
    ipAddress: string;
    provider: INameNamespaceRef;
    secret?: INameNamespaceRef | null;
    thumbprint?: string;
  };
  status?: {
    observedGeneration: string;
    conditions: IStatusCondition[];
  };
}
