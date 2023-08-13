export interface Contract {
  signer: string;
  contract: string;
}

export interface DeployArgument<T> {
  name: string;
  skip: boolean;
  process: boolean;
  params: T;
}

// Params lists
export interface Params {}
