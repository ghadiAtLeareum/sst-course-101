import * as sst from "@serverless-stack/resources";
import { StorageStack } from "../lib/StorageStack";

interface MultiStackProps extends sst.StackProps {
  notesTable: StorageStack["notesTable"];
}

export class ApiStack extends sst.Stack {
  notesTable: StorageStack["notesTable"];

  constructor(scope: sst.App, id: string, props: MultiStackProps) {
    super(scope, id, props);

    this.notesTable = props.notesTable;
    this.client_create_API();
  }

  private client_create_API() {
    const api = new sst.ApiGatewayV1Api(this, "Api", {
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: this.notesTable.tableName,
        },
      },
      routes: {
        "POST /add-note": {
          function: {
            srcPath: ".",
            handler: "src/create.handler",
            permissions: ["dynamodb:PutItem"],
          },
        },
      },
    });

    // Show the API endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
