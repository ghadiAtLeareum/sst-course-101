import * as uuid from "uuid";
import * as AWS from "aws-sdk";
import type {
  Context,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
  };
  try {
    const body = JSON.parse(event.body!);
    const { content, attachment } = body;
    const params = {
      TableName: "dev-sst-course-101-Notes",
      Item: {
        // The attributes of the item to be created
        userId: "user-" + uuid.v4(), // The id of the author
        noteId: uuid.v4(), // A unique uuid
        content: content, // Parsed from request body
        attachment: attachment, // Parsed from request body
        createdAt: Date.now(), // Current Unix timestamp
      },
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
      headers,
    };
  } catch (error: any) {
    console.error("An exception was thrown!");
    console.error(error.message);
    console.error(error);

    return {
      statusCode: error.statusCode,
      body: JSON.stringify(error),
      headers,
    };
  }
}
