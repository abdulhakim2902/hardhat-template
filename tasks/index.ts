import { task, types } from "hardhat/config";
import { accounts } from "../scripts/accounts";
import { deploy, deployAndVerify } from "../scripts/deploy";
import { Params } from "../scripts/types";

const DefaultParams: Params = {};

task("accounts", "Get list of avalaible accounts").setAction(accounts);

task("deploy", "Deploy contract")
  .addOptionalParam("name", "Contract name", "", types.string)
  .addOptionalParam("params", "Contract parameters", DefaultParams, types.json)
  .setAction(deploy);

task("deploy-and-verify", "Deploy and verify contract")
  .addOptionalParam("name", "Contract name", "", types.string)
  .addOptionalParam("params", "Contract parameters", DefaultParams, types.json)
  .setAction(deployAndVerify);
