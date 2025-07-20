import test from "ava";

import { StandaloneServiceProvider } from "@kronos-integration/service";
import { ServiceInfluxdb } from "@kronos-integration/service-influxdb";

test("start / stop", async t => {
  const sp = new StandaloneServiceProvider();

  const influxdb = await sp.declareService({
    type: ServiceInfluxdb,
    url: "http://localhost:8086"
  });

  await influxdb.start();
  t.is(influxdb.state, "running");

  await influxdb.stop();
  t.is(influxdb.state, "stopped");
});
