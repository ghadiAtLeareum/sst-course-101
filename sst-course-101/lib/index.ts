import * as sst from "@serverless-stack/resources";
import StorageStack from "./StorageStack";
import ApiStack from "./ApiStack";

export default function main(app: sst.App) {
  new StorageStack(app, "storage");
  new ApiStack(app, "api");
}
