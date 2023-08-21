import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployArgument, Params } from "../interfaces";

export async function getParams(
  hre: HardhatRuntimeEnvironment,
  args: DeployArgument<Params>,
): Promise<string[]> {
  const params = args.params;

  /*
    Custom function for processing the parameters 
    before deploying contract
  */

  return Object.values(params);
}
