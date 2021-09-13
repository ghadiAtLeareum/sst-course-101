import * as sst from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";
import { ApiStack } from "./ApiStack";
import { AuthStack } from "./AuthStack";

export default function main(app: sst.App) {
  const storageStack = new StorageStack(app, "storage");

  const apiStack = new ApiStack(app, "api", {
    notesTable: storageStack.notesTable,
  });

  const authStack = new AuthStack(app, "auth", {
    api: apiStack.createApi,
    bucket: storageStack.bucket,
  });
}
