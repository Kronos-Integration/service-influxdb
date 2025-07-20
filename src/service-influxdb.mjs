import { prepareAttributesDefinitions } from "pacc";
import { Service } from "@kronos-integration/service";
import { InfluxDB } from "@influxdata/influxdb-client";

const CONFIG_ATTRIBUTES =
  prepareAttributesDefinitions({
    url: {
      description: "url of the influxdb server",
      needsRestart: true,
      type: "url"
    },
    token: {
      type: "string",
      private: true
    },
  ...Service.configurationAttributes
  });

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

  static get configurationAttributes() {
    return CONFIG_ATTRIBUTES;
  }

  /**
   * @return {string} name with url
   */
  get extendetName() {
    return `${this.name}(${this.url})`;
  }

  async _start() {
    await super._start();

    const client = new InfluxDB({ url: this.url, token: this.token });

    this.client = client;
  }

  async _stop() {
    return super._stop();
  }
}

export default ServiceInfluxdb;
