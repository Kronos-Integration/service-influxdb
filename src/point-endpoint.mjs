import { Point } from "@influxdata/influxdb-client";
import { ReceiveEndpoint } from "@kronos-integration/endpoint";

export class PointEndpoint extends ReceiveEndpoint {
  async receive(value) {
    const num = Number.parseFloat(value.toString());

    const [pointName, fieldName] = this.name.split(".");

    console.log(pointName, fieldName, num);

    const point = new Point(pointName).floatField(fieldName, num);

    this.owner.writeApi.writePoint(point);
  }
}
