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

    const params = await processParameters(hre, args);

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

    if (!args.skip) {
      console.log("Waiting for block confirmations...");

      await contract.deploymentTransaction()?.wait(5);

      console.log("Confirmed!");
    }

    const contractInfo = {
      name: name,
      address: contractAddress,
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

    console.log("\nVerifying", contract.name.toLowerCase(), "contract...");

    await hre.run("verify:verify", {
      address: contract.address,
      contract: `contracts/${contract.name}.sol:${contract.name}`,
      constructorArguments: params,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function processParameters(
  hre: HardhatRuntimeEnvironment,
  args: DeployArgument<Params>,
) {
  const values = Object.values(args.params);
  if (!args.process) return values;

  // Custom function if you want to process parameters
  // Before deploying contract

  return values;
}
