# The Docker MCP Gateway

## 🎓 Learning objectives

In this section, you will complete the following objectives:

- Explore the MCP Gateway
- Connect an app to the MCP Gateway
- Connect, list tools, and run a tool using MCP SDKs


## 🐳 The Docker MCP Gateway

The MCP Server used in the previous segment was code that was bundled in the container. While this MCP server could be shared, it would require any other system to have `node` installed. In fact, many MCP servers require `uvx` (Python) or `npx` (Node).

The [Docker MCP Gateway](https://github.com/docker/mcp-gateway) provides the ability to manage the lifecycle and configuration of containerized MCP servers. It presents itself as an MCP server itself, making it easy to plug into your application.

In this section, you're going to use the Docker MCP Gateway to launch the [DuckDuckGo MCP server](https://hub.docker.com/r/mcp/duckduckgo).

1. Open the :tabLink[VS Code IDE]{href="http://localhost:8085" title="Workspace"} and a new terminal.

2. In the workshop editor, open a new terminal and navigate to this directory:

    ```console terminal-id=02-tools
    cd 02-tools-and-mcp
    ```

2. Start a MCP Gateway that will provide a basic time server using the following command:

    ```console terminal-id=02-tools
    docker run -d --name=mcp-gateway --use-api-socket -p 8811:8811 docker/mcp-gateway --transport=streaming --servers=duckduckgo
    ```

    To explain this command:
      
    - **-d** - run the container in the background
    - **--name=mcp-gateway** - give the new container a specific name (helpful for cleanup later on)
    - **--use-api-socket** - this is a new flag that will mount the Docker socket and inject registry credentials into the container
    - **docker/mcp-gateway** - the name of the container image to run
    - **--transport=streaming** - configure the MCP Gateway to use the Streamable HTTP transport (MCP supports several communication transports)
    - **--servers=duckduckgo** - the name of the MCP server to enable

3. To see the log output, use the `docker logs` command:

    ```console terminal-id=02-tools
    docker logs mcp-gateway
    ```
    
    You should see output similar to the following:
    
    ```plaintext no-copy-button
    - Reading configuration...
      - Reading catalog from [https://desktop.docker.com/mcp/catalog/v2/catalog.yaml]
    - Configuration read in 251.816333ms
    - Using images:
      - mcp/duckduckgo@sha256:68eb20db6109f5c312a695fc5ec3386ad15d93ffb765a0b4eb1baf4328dec14f
    > Images pulled in 15.757ms
    - Those servers are enabled: duckduckgo
    - Listing MCP tools...
      - Running mcp/duckduckgo with [run --rm -i --init --security-opt no-new-privileges --cpus 1 --memory 2Gb --pull never -l docker-mcp=true -l docker-mcp-tool-type=mcp -l docker-mcp-name=duckduckgo -l docker-mcp-transport=stdio --network labspace]
    - duckduckgo: [10/21/25 16:15:36] INFO     Processing request of type            server.py:523
    - duckduckgo:                              ListToolsRequest                                   
    - duckduckgo:                     INFO     Processing request of type            server.py:523
    - duckduckgo:                              ListPromptsRequest                                 
    - duckduckgo:                     INFO     Processing request of type            server.py:523
    - duckduckgo:                              ListResourcesRequest                               
    - duckduckgo:                     INFO     Processing request of type            server.py:523
    - duckduckgo:                              ListResourceTemplatesRequest                       
      > duckduckgo: (2 tools)
    > 2 tools listed in 698.074834ms
    > Initialized in 969.858834ms
    > Start streaming server on port 8811
    ```

4. With the MCP Gateway up and running, you can now connect to it and see what it provides. To do so, you can use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

    ```console terminal-id=02-tools
    npx -y @modelcontextprotocol/inspector
    ```

    After running this, you will be prompted by VS Code to open a browser tab. Simply click **Cancel** to close the dialog (the URL will go through a proxy that is configured to work).

5. Once it's up and running, open the MCP Inspector by going to :tabLink[http://localhost:6274]{href="http://localhost:6274" title="MCP Inspector"}.

6. To connect to the MCP server, use the following configuration:

    - **Transport Type:** Streaming HTTP
    - **URL:** http://localhost:8811/mcp

    Once you have the settings entered, click the **Connect** button.

7. Go to the **Tools** tab and click the **List Tools** button.

    You should see both a _fetch_content_ and a _search_ tool in the list.

8. Select the _fetch_content_ tool and enter a _url_ of:

    ```plaintext
    https://www.docker.com
    ```

9. Click the **Run Tool** button and see the tool run to get the page contents!

10. When you're done, go back to the terminal running the `npx` command and hit `Ctrl+C` to stop the inspector.

> [!IMPORTANT]
> If you open the containers tab on Docker Desktop, you'll notice a container start when you run a tool. The Docker MCP Gateway manages the lifecycle of the containerized MCP servers, running them only when they need to run.


## 👩‍💻 Connecting to the MCP Gateway via code

Now that you have a MCP Gateway up and running, you are ready to connect to it, query the available tools, and invoke a tool!

1. In the workshop editor, open the :fileLink[`02-tools-and-mcp/index.js`]{path="02-tools-and-mcp/index.js" line=5} file.

2. In the file, add the following inside the `main` function:

    ```javascript
    // Create a client
    const mcpClient = new Client({
        name: "mcp-gateway",
        version: "1.0.0",
    });

    // Create the transport using the Streaming HTTP protocol
    const mcpTransport = new StreamableHTTPClientTransport(new URL("http://mcp-gateway:8811/sse"));

    // Connect to the server
    await mcpClient.connect(mcpTransport);

    // Get and list the tools    
    const tools = await mcpClient.listTools();
    console.log('Available tools from MCP:', JSON.stringify(tools, null, 2));

    // Close the client
    await mcpClient.close();
    ```

4. Using the same terminal from before (which is in the `02-tools-and-mcp` directory), install the dependencies:

    ```console terminal-id=02-tools
    npm install
    ```

5. Run the program to connect and list the tools being provided by the MCP Gateway:

    ```console terminal-id=02-tools
    node ./index.js
    ```

    If everything worked correctly, you should see output similar to the following:

    ```plaintext no-copy-button
    Available tools from MCP: {
      "tools": [
        {
          "name": "fetch_content",
          "description": "\n    Fetch and parse content from a webpage URL.\n\n    Args:\n        url: The webpage URL to fetch content from\n        ctx: MCP context for logging\n    ",
          "inputSchema": {
            "type": "object",
            "properties": {
              "url": {
                "title": "Url",
                "type": "string"
              }
            },
            "required": [
              "url"
            ]
          },
          "annotations": {}
        },
        {
          "name": "search",
          "description": "\n    Search DuckDuckGo and return formatted results.\n\n    Args:\n        query: The search query string\n        max_results: Maximum number of results to return (default: 10)\n        ctx: MCP context for logging\n    ",
          "inputSchema": {
            "type": "object",
            "properties": {
              "max_results": {
                "default": 10,
                "title": "Max Results",
                "type": "integer"
              },
              "query": {
                "title": "Query",
                "type": "string"
              }
            },
            "required": [
              "query"
            ]
          },
        "annotations": {}
        }
      ]
    }
    ```

    This is the raw output coming from the MCP server and matches what we saw in the MCP Inspector earlier.

6. Let's invoke one of the tools by adding the following _before_ the `await mcpClient.close();`:

    ```javascript
    const response = await mcpClient.callTool({ name: "fetch_content", arguments: { url: "https://www.docker.com" } });
    const pageContents = response.content[0].text;
    console.log(`The first 100 characters of the Docker homepage are: ${pageContents.substring(0, 100)}...`);
    ```

7. If you run the app again, you'll now see a container start up using the `mcp/duckduckgo` image (started by the MCP Gateway) and you'll see output similar to the following:

    ```console terminal-id=02-tools
    node ./index.js
    ```
    
    ```plaintext no-copy-button
    The first 100 characters of the Docker homepage are: Docker: Accelerated Container Application Development NEW Webinar series – Secure your software supp...
    ```

## Clean-up

Hooray! You've completed this hands-on. Before moving on, do the following to clean-up your environment:

1. If you still have the MCP Inspector running, find the terminal it's running in and press `Ctrl+C` to stop it.
2. Stop the MCP Gateway by running the following command:

    ```console terminal-id=02-tools
    docker rm -f mcp-gateway
    ```


## Recap

In this hands-on, you accomplished the following:

- Learned how tools and MCP servers operate
- Gained familiarity with using the Docker MCP Gateway
- Connected, listed tools, and ran a tool using MCP SDKs



## Additional resources

- [Model Context Protocol documentation](https://modelcontextprotocol.io) - learn more about the MCP protocol
- [The Docker MCP Gateway repo](http://github.com/docker/mcp-gateway) - learn more about the Docker MCP Gateway
- [Docker MCP Gateway configuration examples](https://github.com/docker/mcp-gateway/tree/main/examples) - see various examples of configuring the MCP Gateway