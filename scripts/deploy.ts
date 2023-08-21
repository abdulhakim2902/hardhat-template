import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployArgument, Params } from "./types";

export async function deploy(
  args: DeployArgument<Params>,
  hre: HardhatRuntimeEnvironment,
) {
  const { run, ethers, network } = hre;
  const { name } = args;

  try {
    await run("compile");

    const params = await getParams(hre, args);

    const [deployer] = await ethers.getSigners();

    console.log("\nNetwork:", network.name);
    console.log("Deployer addr:", deployer.address);
    console.log("Params:", params);

    const factory = await ethers.getContractFactory(name, deployer);

    console.log("\nDeploying", name.toLowerCase(), "contract...");

    const contract = await factory.deploy(...params);

    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();

    console.log("Contract is deployed at", contractAddress);

    const contractInfo = {
      name: name,
      address: contractAddress,
      contract: contract,
    };

    return { contract: contractInfo, params };
  } catch (err) {
    console.log(err);
  }
}

export async function deployAndVerify(
  args: DeployArgument<Params>,
  hre: HardhatRuntimeEnvironment,
) {
  try {
    const { run } = hre;
    const { contract, params } = await run("deploy", args);

    console.log("Waiting for block confirmations...");

    await contract?.contract?.deploymentTransaction()?.wait(5);

    console.log("Confirmed!\n");

    console.log("Verifying", contract.name.toLowerCase(), "contract...");

    await hre.run("verify:verify", {
      address: contract.address,
      contract: `contracts/${contract.name}.sol:${contract.name}`,
      constructorArguments: params,
    });
  } catch (err) {
    console.log(err);
  }
}

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
