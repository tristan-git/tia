import { select } from "@inquirer/prompts";
import { spawn } from "child_process";

// https://www.npmjs.com/package/@inquirer/prompts

// //////////////////////////////////////////////////////////////////////
//  choose Compilation options
// //////////////////////////////////////////////////////////////////////

async function chooseCompilation() {
  let lastChoice = "compile"; // Variable pour mémoriser le dernier choix

  // boucle
  while (true) {
    const chosenValue = await select({
      message: "DEPLOYEMENT OPTIONS : ",
      choices: [
        { name: "1 - ALL CONTRACTS", value: "compile" }, // = npx hardhat compile
        { name: "2 - CLEAN CACHE", value: "clean" }, // = npx hardhat clean
        { name: "3 - CANCEL", value: null },
      ],
      pageSize: 6,
      default: lastChoice || null,
    });

    // Si l'utilisateur choisit de quitter, sort de la boucle
    if (chosenValue === null) break;

    lastChoice = chosenValue;

    const process = spawn("npx", ["hardhat", chosenValue], { stdio: "inherit" });

    process.on("error", (error) => console.error(`Erreur lors de l'exécution de la compilation : ${error.message}`));
    process.on("exit", (code) => console.log(`Compilation terminé avec le code : ${code}`));
  }
}

chooseCompilation().catch(console.error);
