import {startSubgraphs} from "./subgraphs";
import {startGateway} from "./gateway";

const PORT = 4000;

const start = async ({port}) => { 
  const subgraphs = await startSubgraphs({port});
  await startGateway({port, subgraphs});
}

await start({port: PORT});