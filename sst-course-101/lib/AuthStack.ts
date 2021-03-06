import * as iam from "@aws-cdk/aws-iam";
import * as sst from "@serverless-stack/resources";
import { ApiStack } from "../lib/ApiStack";
import { StorageStack } from "../lib/StorageStack";

interface MultiStackProps extends sst.StackProps {
  api: ApiStack["createApi"];
  bucket: StorageStack["bucket"];
}

export class AuthStack extends sst.Stack {
  // Public reference to the auth instance
  auth;

  constructor(scope: sst.App, id: string, props: MultiStackProps) {
    super(scope, id, props);

    const { api, bucket } = props;

    // Create a Cognito User Pool and Identity Pool
    this.auth = new sst.Auth(this, "Auth", {
      cognito: {
        userPool: {
          // Users can login with their email and password
          signInAliases: { email: true },
        },
      },
    });

    this.auth.attachPermissionsForAuthUsers([
      // Allow access to the API
      props.api(),
      // Policy granting access to a specific folder in the bucket
      new iam.PolicyStatement({
        actions: ["s3:*"],
        effect: iam.Effect.ALLOW,
        resources: [
          bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
        ],
      }),
    ]);

    // Show the auth resources in the output
    this.addOutputs({
      Region: scope.region,
      UserPoolId: this.auth.cognitoUserPool!.userPoolArn,
      IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: this.auth.cognitoUserPoolClient!.userPoolClientId,
    });
  }
}
