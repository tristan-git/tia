import { createConfig } from "@ponder/core";
import { parseAbiItem } from "abitype";
import { http } from "viem";
import { VotingFactoryAbi } from "./abis/VotingFactoryAbi";
import { VotingAbi } from "./abis/VotingAbi";
import { EstateManagerFactoryAbi } from "./abis/EstateManagerFactoryAbi";
import { EstateManagerAbi } from "./abis/EstateManagerAbi";
import { InterventionManagerAbi } from "./abis/InterventionManagerAbi";

export default createConfig({
  // database: {
  //   kind: "postgres",
  //   connectionString: process.env.DATABASE_URL,
  // },

  networks: {
    skale: {
      chainId: 974399131,
      transport: http(process.env.PONDER_RPC_URL_974399131),
    },
  },
  contracts: {
    EstateManagerFactory: {
      abi: EstateManagerFactoryAbi,
      network: "skale",
      address: "0x662872d50e70ad3e9d61118Af727676791df70F9",
      startBlock: 2634860,
    },
    EstateManager: {
      abi: EstateManagerAbi,
      network: "skale",
      factory: {
        address: "0x662872d50e70ad3e9d61118Af727676791df70F9",
        event: parseAbiItem(
          "event EstateManagerCreated(address indexed admin, address indexed manager, address estateManager, bytes32 rnbCode)"
        ),
        parameter: "estateManager",
      },
      startBlock: 2634860,
    },

    InterventionManager: {
      abi: InterventionManagerAbi,
      network: "skale",
      factory: {
        address: "0x662872d50e70ad3e9d61118Af727676791df70F9",
        event: parseAbiItem("event ModuleRegistered(string indexed name, address indexed moduleAddress)"),
        parameter: "moduleAddress",
      },
      startBlock: 2634860,
    },
  },
});
