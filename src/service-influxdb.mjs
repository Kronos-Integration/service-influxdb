import { mergeAttributes, createAttributes } from "model-attributes";
import { Service } from "@kronos-integration/service";
import { InfluxDB, Point } from "@influxdata/influxdb-client";


/**
 * MQTT client.
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
    return mergeAttributes(
      createAttributes({
        url: {
          description: "url of the influxdb server",
          needsRestart: true,
          type: "url"
        },
        token: {
          type: "string",
          private: true
        }
      }),
      Service.configurationAttributes
    );
  }

  /**
   * @return {string} name with url
   */
  get extendetName() {
    return `${this.name}(${this.url})`;
  }

  async _start() {
    await super._start();

    const client = new InfluxDB({ this.url, this.token });

    this.client = client;
  }

  async _stop() {
    return super._stop();
  }
}

export default ServiceInfluxdb;
