const fs = require("fs");
const path = require("path");

const files = {
  "/public/index.css": {
    content: fs.readFileSync(
      path.join(__dirname, "public", "index.css"),
      "utf8"
    ),
    type: "text/css",
  },
  "/public/main.js": {
    content: fs.readFileSync(path.join(__dirname, "public", "main.js"), "utf8"),
    type: "text/javascript",
  },
  "/": {
    content: fs.readFileSync(path.join(__dirname, "index.html"), "utf8"),
    type: "text/html",
  },
};

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  // This will either be /, /public/index.css, or /public/main.js
  const requestPath = event.path;
  const { content, type } = files[requestPath];

  return {
    headers: { "content-type": type },
    statusCode: 200,
    body: content,
  };
};
