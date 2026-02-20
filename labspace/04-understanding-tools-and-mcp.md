# Understanding tools and MCP

## 🎓 Learning objectives

In this section, you will complete the following objectives:

- Learn how tools work in agentic applications
- Learn how MCP provides tools

Let's get started!



## 🔨 Understanding tools

For agentic applications, tools are what provide the ability to _do_ things - fetch additional content, perform actions, and more. Without tools, models can only utilize the knowledge it was trained with.

When the Chat Completions request is sent to the model, a collection of `tools` can also be sent. 

The following is an example of a description of a tool that can provide the current time:

```json no-copy-button
{
    "tools": [
    {
      "type": "function",
      "function": {
        "name": "get-current-time",
        "description": "Get the current time for a specified timezone",
        "parameters": {
          "type": "object",
          "properties": {
            "timezone": {
              "type": "string",
              "description": "The requested timezone"
            }
          },
          "required": ["timezone"]
        }
      }
    ]
}
```

In this tool description, the client provides three critical elements:

1. **Tool name** - if the model wants to invoke this tool, how should it refer to the tool?
2. **Description** - what does this tool do? When or why might the model want to use this tool?
3. **Parameters** - if the model decides it needs to invoke this tool, what parameters does it need to extract from the conversation?

If the model determines it needs to execute a tool, it returns a message indicating that request. The client then executes the tool and sends the model the tool result in a `tool` message.

## Trying out tool execution

Complete the following steps to see the tool execution flow in action.

1. In the :tabLink[Visual Chatbot]{href="http://localhost:3050" title="Visual Chatbot"}, clear the messages by clicking the **Reset messages** button at the bottom of the thread.

2. Add a new user message asking for the current time.

    ```plaintext
    What is the current time in New York?
    ```

    The result you get back will be wildly inaccurate. That's because the model doesn't have access to the current date and time. Let's change that!

3. In the **Tools** tab in the right sidebar, click the **+ Add time tool** button.

    After doing so, you should see a new tool enabled named `get-current-time`.

4. Click on the tool description to view the tool details.

    In the details, you'll see the `description` and `parameters` that will be sent to the model.

5. Add another message to the stack asking again. This time though, the tool description will be sent to the API.

    ```plaintext
    How about telling me the time now?
    ```

    In the response, you should see a "Tool execution request". Click on the message to see the actual response that came from the model.

    ![Capture of the tool execution request when requesting the current time](.labspace/images/dd-time-invocation-request.png)

    Remember that it is up to the client to actually invoke the tool, _not the model_.

6. Click the **Invoke tool** button to invoke the tool. 

    You should see a new message added to the stack with the current date and time. Clicking on it will show it has the type of `tool`, as well as the current time and an identifier to connect it to the tool invocation request.

    ![Screenshot of the tool execution response](.labspace/images/dd-time-invocation-response.png)

7. Send the messages (which includes the tool execution response) by clicking the **Send messages to model**

    You should see a response from the model that now uses the correct time.


> [!IMPORTANT]
> It's important to recognize the flow - the app presents tools and the model decides whether to use a tool or not. It's the app, _not_ the model, that executes the tool. It then sends the result back to the model, which then can continue making progress.


## ❓ What are MCP Servers?

Now that we've seen tools, it's time to talk about MCP servers. MCP stands for _Model Context Protocol_ and defines a protocol of communication between an application and external processes or servers, scoped for agentic applications. These external applications can provide packaged tools, prompts, resources, and more.

1. In the :tabLink[Visual Chatbot]{href="http://localhost:3050" title="Visual Chatbot"}, reset all of the messages.

2. In the _MCP Servers_ tab in the right sidebar, click the **+ Start weather MCP server** button.

    You will see a _weather_ MCP server started and a listing of "? tools".

3. Tell the application to fetch the list of tools by clicking the **Fetch tools** button.

    You should see the listing now display "3 tools".

4. Switch to the "Tools" tab to see the tools that are provided by the MCP server. You should see the following tools: _weather__get-forecast_, _weather__get-hourly-forecast_, and _weather__get-weather-warnings_. 

5. Add a user message to ask for if there are any current weather warnings in New York City.

    ```plaintext
    Are there any current weather warnings in New York City?
    ```

    In the response, you should see a "Tool execution request" for _weather__get-weather-warnings_.

    Again, that is up to the client to actually invoke the tool, _not the model_.

6. Click the **Invoke tool** button to invoke the tool. 

    After invoking the tool, you should see a response generated by the model.

> [!IMPORTANT]
> The MCP servers provide a collection of tools and handle the actual invocation of the tool. It is the app's job to collect the listing of tools, perform any necessary filtering, forward those tools to the model, and then delegate requested execution to the MCP server.

