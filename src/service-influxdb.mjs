import {
  prepareAttributesDefinitions,
  url_attribute,
  token_attribute,
  string_attribute_writable
} from "pacc";
import { Service } from "@kronos-integration/service";
import { InfluxDB } from "@influxdata/influxdb-client";
import { PointEndpoint } from "./point-endpoint.mjs";
export { PointEndpoint };

/**
 * influxdb client.
 */
export class ServiceInfluxdb extends Service {
  /**
   * @return {string} 'influxdb'
   */
  static get name() {
    return "influxdb";
  }

  static get description() {
    return "influxdb client";
  }

  static attributes = prepareAttributesDefinitions(
    {
      url: {
        ...url_attribute,
        description: "url of the influxdb server",
        needsRestart: true,
        env: "INFLUXDB_URL"
      },
      token: {
        ...token_attribute,
        env: "INFLUXDB_TOKEN"
      },
      org: {
        ...string_attribute_writable,
        env: "INFLUXDB_ORG"
      },
      bucket: {
        ...string_attribute_writable,
        env: "INFLUXDB_BUCKET"
      }
    },
    Service.attributes
  );

  /**
   * @return {string} name with url
   */
  get extendetName() {
    return `${this.name}(${this.url})`;
  }

  endpointOnDemand(expression, from) {
    if (expression.indexOf(".") >= 0) {
      this.info(`create endpoint ${expression}`);
      const endpoint = new PointEndpoint(expression, this);
      this.addEndpoint(endpoint);
      return endpoint;
    }
  }

  endpointFactoryFromConfig(name, definition, ic) {
    if (name.indexOf(".") >= 0) {
      return PointEndpoint;
    }

    return super.endpointFactoryFromConfig(name, definition, ic);
  }

  async _start() {
    await super._start();

    const client = new InfluxDB({
      url: this.url,
      token: await this.getCredential("token")
    });

    this.client = client;
    this.writeApi = client.getWriteApi(this.org, this.bucket);
  }

  async _stop() {
    await super._stop();
    return this.writeApi?.close();
  }
}

export default ServiceInfluxdb;
