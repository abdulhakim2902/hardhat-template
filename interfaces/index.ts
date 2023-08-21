export interface Contract {
  signer: string;
  contract: string;
}

export interface DeployArgument<T> {
  name: string;
  params: T;
}

// Params lists
export interface Params {
  [any: string]: any;
}
