import { Point } from "@influxdata/influxdb-client";
import { ReceiveEndpoint } from "@kronos-integration/endpoint";

export class PointEndpoint extends ReceiveEndpoint {
  constructor(name, owner, options) {
    super(name, owner, options);
  }

  get org() {
    return this.owner.org;
  }

  get bucket() {
    return this.owner.bucket;
  }

  get writeClient() {
    return this.owner.client.getWriteApi(this.org, this.bucket, "ns");
  }

  async receive(value) {
    const num = Number.parseFloat(value.toString());

    console.log(num);

    const point = new Point("power").floatField("ac", num);

    this.writeClient.writePoint(point);
  }
}
