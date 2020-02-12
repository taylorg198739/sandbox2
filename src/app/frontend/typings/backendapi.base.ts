import {K8sError, PodInfo, StringMap, TypeMeta} from '@api/backendapi';

export class PropMeta {
    id: number;
    name: string;
}

export class APIMetadata {
    readonly name: string;
    constructor(aInName: string) {
        this.name = aInName;
    }
}

export interface APIStruct {
    readonly apiVersion: string;
    readonly kind: string;
    readonly metadata: APIMetadata;
}

export interface Base  {
}

export interface ListMeta {
  totalItems: number;
}

export interface ObjectMeta {
  name?: string;
  namespace?: string;
  labels?: StringMap;
  annotations?: StringMap;
  creationTimestamp?: string;
  uid?: string;
}

export interface ResourceList {
  listMeta: ListMeta;
  items?: Resource[];
  errors?: K8sError[];
}

export interface Resource {
  objectMeta: ObjectMeta;
  typeMeta: TypeMeta;
}

export interface ResourceDetail {
  objectMeta: ObjectMeta;
  typeMeta: TypeMeta;
  errors: K8sError[];
}

export interface ResourceOwner extends Resource {
  pods: PodInfo;
  containerImages: string[];
  initContainerImages: string[];
}

export interface LabelSelector {
  matchLabels: StringMap;
}
