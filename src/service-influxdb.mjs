import {
  prepareAttributesDefinitions,
  url_attribute,
  token_attribute,
  default_attribute
} from "pacc";
import { Service } from "@kronos-integration/service";
import { InfluxDB } from "@influxdata/influxdb-client";

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
        ...default_attribute,
        env: "INFLUXDB_ORG"
      },
      bucket: {
        ...default_attribute,
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

  async _start() {
    await super._start();

    const client = new InfluxDB({
      url: this.url,
      token: await this.getCredential("token")
    });

    this.client = client;
  }

  async _stop() {
    return super._stop();
  }
}

export default ServiceInfluxdb;
