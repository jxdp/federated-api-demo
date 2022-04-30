import * as services from "./services";

export const startSubgraphs = async ({port}) => Promise.all(Object.values(services).map((service, i) => service.start({
  port: port + i + 1,
})));
