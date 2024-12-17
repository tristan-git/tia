import { createConfig } from "@ponder/core";
import { parseAbiItem } from "abitype";
import { http } from "viem";
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
      address: "0x306253B640cB46eBef3DCCE9C05359aD6055869b",
      startBlock: 2637077,
    },
    EstateManager: {
      abi: EstateManagerAbi,
      network: "skale",
      factory: {
        address: "0x306253B640cB46eBef3DCCE9C05359aD6055869b",
        event: parseAbiItem(
          "event EstateManagerCreated(address indexed admin, address indexed manager, address estateManager, bytes32 rnbCode)"
        ),
        parameter: "estateManager",
      },
      startBlock: 2637077,
    },

    InterventionManager: {
      abi: InterventionManagerAbi,
      network: "skale",
      factory: {
        address: "0x306253B640cB46eBef3DCCE9C05359aD6055869b",
        event: parseAbiItem(
          "event ModuleRegisteredInManager(address indexed estateManager, string name, address moduleAddress)"
        ),
        parameter: "moduleAddress",
      },
      startBlock: 2637077,
    },
  },
});
