import test from "ava";

import { StandaloneServiceProvider } from "@kronos-integration/service";
import { ServiceInfluxdb, PointEndpoint } from "@kronos-integration/service-influxdb";

test("start / stop", async t => {
  const sp = new StandaloneServiceProvider();

  const influxdb = await sp.declareService({
    type: ServiceInfluxdb,
    url: "http://localhost:8086",
    endpoints: {
      "aPoint.aField": {}
    }
  });

  await influxdb.start();
  t.is(influxdb.state, "running");

  t.truthy(influxdb.client);
  t.truthy(influxdb.writeApi);

  t.true(influxdb.endpoints["aPoint.aField"] instanceof PointEndpoint);

  await influxdb.stop();
  t.is(influxdb.state, "stopped");
});
