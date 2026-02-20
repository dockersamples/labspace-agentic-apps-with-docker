# Understanding model interactions

## 🎓 Learning objectives

In this section, you will complete the following objectives:

- Learn about the OpenAI API endpoint used to create GenAI responses
- Understand the role of the system prompt
- Explore the various types of data a model can interact with



## 💬 Understanding messages

When interacting with models, you interact with an API that wraps the model. The main endpoint most applications interact with is called the "Chat Completions" API endpoint, which allows you to "create a model response for a given chat conversation." ([documentation here](https://platform.openai.com/docs/api-reference/chat)).

This endpoint requires two fields:

- `model` - the intended model you want to use
- `messages` - a collection of messages for the conversation to evaluate

Each `message` contains, at a minimum, two properties:

- `role` - the role of the message (more on that soon)
- `content` - the content of the message

An example endpoint request body is below:

```json no-copy-button
[
    { 
      "role": "system", 
      "content": "You are a helpful assistant. Blah blah..." 
    },
    { 
      "role": "user", 
      "content": "Hello!"
    }
]
```

The response from the API then contains a message that can be added back on the stack of messages. But, it has a `role` of `assistant`.

```json no-copy-button
{
  "id": "chatcmpl-123",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "\n\nHello there, how may I assist you today?",
    },
    "logprobs": null,
    "finish_reason": "stop"
  }]
  ...
}
```

## 📝 Writing your own messages

Now that you've learned a little bit about the API, you can try crafting your own messages. First start by creating your own `user` messages and submitting them to a model.

1. Open the Visual Chatbot app by opening :tabLink[http://localhost:3050]{href="http://localhost:3050" title="Visual Chatbot"}

    You'll see in the chat area a "system prompt", which sets the persona for the interaction with the model (more on this in the next section).

2. Click on the **Add user message** button to add another message to the message stack.

3. Type the following message into the input field and click the **Add user message** button:

    ```plaintext
    Why is the sky blue?
    ```

4. Click the **Send messages to model** button to send the stack of messages to the model.

    After a moment, you will get a response back from the model. You should notice that the response matches that from the system prompt - it is whimsical and has a fantasy-like feel.

5. Click on the response message (the blue chat bubble) to see the raw message that was returned by the API.

6. Create another user message that extends the conversation:

    ```plaintext
    Are there times in which it has other colors?
    ```

    If this message were submitted on its own, it would be missing a lot of context - what are you referring to? What colors have already been referenced?

    However, when you submit the message, you get a response back that indicates the model is following the thread.

    This is because the entire stack of messages is being submitted for each and every interaction with the model.

> [!IMPORTANT]
> Models have no notion of memory or history on their own - **they are stateless.** All messages in the stack are sent to the API in order to support history and context. This is why context length is an important consideration.



## 🤖 Understanding the system prompt

Now that you've learned about the `user` and `assistant` messages, you're ready to explore the importance of the system prompt. In most cases, when you hear about prompt engineering, the focus is on crafting the system prompt.

The **"system prompt"** provides specific instructions to the model on how it should behave, how it should operate, rules it should follow, and additional context it should include in the conversation.

Complete the following steps to explore how the system prompt can completely change a conversation.

1. In the Visual Chatbot, go to the **Settings** menu in the top-right corner and click the **System prompt** menu item.

2. In the dialog that appears, select the **Grumpy old man** option in the list of _Quick persona chooser_. You should see the prompt updated with a new description.

3. Enable the **Replay user messages on new system prompt** option.

4. Click the **Save** button to save the new prompt.

    What you should see now is a very short and terse response back from the model.



## Using non-chat messages

What you've seen so far are messages that appear to be written by a human in a chatbot-like interface. However, models can work with a variety of input data including JSON.

In this short hands-on, you will set a system prompt that will work with JSON data and send a JSON object to the model.

1. In the Visual Chatbot's **System prompt** chooser, select the **Message summarizer** persona.  

    You will now see a prompt that tells the models to summarize a collection of messages that are represented in a JSON object.

2. Disable the **Replay user messages on new system prompt** option. Save the new prompt settings.

3. Click the **Reset messages** button at the bottom of the chat thread to start a new conversation.

4. Create a new user message that contains the following JSON text:

    ```json
    [
        { 
            "author": "Jane",
            "timestamp": "2025-07-08 14:29",
            "message": "Can you help me create the blog post for the launch?"
        },
        {
            "author": "Jane",
            "timestamp": "2025-07-08 15:32",
            "message": "Hello? Haven't heard back from you. Can you help?"
        },
        {
            "author": "Jane",
            "timestamp": "2025-07-08 16:12",
            "message": "Never mind. We used some of the PMM materials and created the post"
        }
    ]
    ```

5. Send the message the model. The response should provide is a summary of the text thread, indicating no action is now required.

> [!IMPORTANT]
> The same model can be used in a variety of ways, depending on the provided system prompt. Many models also work well with a variety of input data.


