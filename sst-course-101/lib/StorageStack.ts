import * as sst from "@serverless-stack/resources";

export class StorageStack extends sst.Stack {
  // Public reference
  notesTable: sst.Table;
  bucket: sst.Bucket;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create the DynamoDB table
    this.notesTable = new sst.Table(this, "Notes", {
      fields: {
        userId: sst.TableFieldType.STRING,
        noteId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
    });

    // Create an S3 bucket
    this.bucket = new sst.Bucket(this, "Uploads");
  }
}
