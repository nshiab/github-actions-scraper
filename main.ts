import { XMLParser } from "fast-xml-parser";

const response = await fetch(
  "https://dd.weather.gc.ca/today/observations/swob-ml/latest/CWTQ-AUTO-minute-swob.xml",
);
const xml = await response.text();
const json = new XMLParser({ ignoreAttributes: false }).parse(xml);

const observation =
  json["om:ObservationCollection"]["om:member"]["om:Observation"];

const resultTime =
  observation["om:resultTime"]["gml:TimeInstant"]["gml:timePosition"];
console.log(resultTime);

const elements = observation["om:result"]["elements"]["element"];
type element = {
  "@_name": string;
  "@_value": string;
};
const temp = elements
  .find((d: element) => d["@_name"] === "air_temp")["@_value"];
console.log(temp);

const scrapeTime = new Date().toISOString();
console.log(scrapeTime);

await Deno.writeTextFile(
  "./data.csv",
  `${scrapeTime},${resultTime},${temp}\n`,
  {
    append: true,
  },
);
