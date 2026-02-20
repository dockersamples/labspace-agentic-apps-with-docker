# The Docker Model Runner

Now that you understand how models work, you're ready to learn how the Docker Model Runner works and how to interact with it.

## 🎓 Learning objectives

In this section, you will complete the following objectives:

- Learn about the Docker Model Runner
- Learn how to use the Docker Model Runner
- Connect an app to the Docker Model Runner



## ❓ What is Docker Model Runner?

Docker Model Runner (DMR) makes it easy to manage, run, and deploy AI models using Docker. It's been designed for developers by streamlining the process of pulling, running, and serving large language models (LLMs) and other AI models directly from Docker Hub or any OCI-compliant registry. It's key features include:

- Pull and push models to and from Docker Hub
- Serve models on OpenAI-compatible APIs for easy integration with existing apps
- Package GGUF files as OCI Artifacts and publish them to any Container Registry
- Run and interact with AI models directly from the command line or from the Docker Desktop GUI
- Manage local models and display logs
- Display prompt and response details
- Conversational context support for multi-turn interactions

But enough talk! It's time for you to get hands-on with it and explore more!



## 💻 Exploring the Docker Model Runner CLI

Now that we understand how models work, how does Docker help you use models?

The Docker Model Runner CLI commands are designed to look familiar to the other Docker CLI commands. Let's explore a few of them!

1. Open the lab's VS Code editor on :tabLink[http://localhost:8085]{href="http://localhost:8085"}.

2. Pull a model by using the `docker model pull` command:

    ```console
    docker model pull ai/gemma3:4B-Q4_K_M
    ```

    This command should exit fairly quickly since the model was pulled when you started the lab environment.

    These models are pulled as [OCI Artifacts](https://docs.docker.com/docker-hub/repos/manage/hub-images/oci-artifacts/), which are similar to container images. Most container registries also support OCI Artifacts, allowing you to mirror models or distribute your own using other registries.

3. To learn more details about a model, you can use the `docker model inspect` command:

    ```console
    docker model inspect ai/gemma3:4B-Q4_K_M
    ```

    Running that will give you output similar to the following:

    ```json no-copy-button
    {
        "id": "sha256:a353a8898c9d63b83254ad34ff8f3711d94e06dd412f1278c0ff0d9af27426f2",
        "tags": [
            "ai/gemma3:4B-Q4_K_M"
        ],
        "created": 1758368217,
        "config": {
            "format": "gguf",
            "quantization": "MOSTLY_Q4_K_M",
            "parameters": "3.88 B",
            "architecture": "gemma3",
            "size": "2.31 GiB",
            "gguf": {
                "gemma3.attention.head_count": "8",
                ...
            }
        }
    }
    ```

    The parameter and quantization details of the model are useful when determining a model to use.

4. To run a single query against the model, use the `docker model run` command:

    ```console
    docker model run ai/gemma3:4B-Q4_K_M "Tell me an interesting fact"
    ```

    Once the model is loaded, you'll get a response!



## 👩‍💻 Connecting to the Docker Model Runner in an app

The Docker Model Runner exposes models using an OpenAI-compatible API, making it easy to integrate into your codebase. Any library that supports OpenAI will be able to support the Docker Model Runner.

You will now use the [openai](https://www.npmjs.com/package/openai) library to connect to Docker Model Runner and perform a simple request.

1. In the workshop editor, open the :fileLink[`01-models/index.js`]{path="01-models/index.js"} file.

2. In that file, create an OpenAI client by adding the following code:

    ```javascript
    const OpenAI = require("openai");
    const openai = new OpenAI({
        baseURL: process.env.OPENAI_BASE_URL,
        apiKey: process.env.OPENAI_API_KEY,
    });
    ```

    This client is configured to use the `OPENAI_BASE_URL` and `OPENAI_API_KEY` variables, making it easy to reconfigure the code to point to other APIs (including OpenAI itself).

    The workshop environment sets these defaults to point to Docker Model Runner. Later in this lab, you'll see how Compose can define and inject these values into the app.

3. Use the newly created client and send a basic request to it by adding the following code:

    ```javascript
    async function run() {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: `You are a random fact giver based on a provided topic. Give one random fact and make it fun and interesting!`
                },
                {
                    role: "user",
                    content: `Countries of the world`
                }
            ]
        });
    
        return response.choices[0].message.content.trim();
    }

    run()
        .then(response => console.log(response))
        .catch(err => console.error(err));
    ```

    This snippet uses the `OPENAI_MODEL` environment to specify the model that should be used, making it easy to reconfigure to use another model.

4. Before running the code, open a new terminal and navigate into the directory:

    ```console terminal-id=model-app
    cd 01-models
    ```

5. Install the openai library by using `npm install`:

    ```console terminal-id=model-app
    npm install
    ```

6. Run the app:

    ```bash terminal-id=model-app
    node ./index.js
    ```

    This example doesn't stream the response, so it may take a moment to get the full answer and display it (depending on your machine's hardware resources).



## 🔎 Viewing requests to Docker Model Runner

You can get additional insights about the requests going into the Docker Model Runner for the specific model used by running this command:

```bash
docker model requests ai/gemma3:4B-Q4_K_M | jq .
```

You can get these information with Docker Desktop as well.

1. Open Docker Desktop and click the **Models** menu item.

2. In the **Models** section, click the **Requests** tab.

3. Select the most recent request which was generated by the Node code you just ran.

    It should open a window similar to the following, providing token usage and initial details of the request:

    ![Screenshot of Docker Desktop's view of a recent request handled by the Docker Model Runner](.labspace/images/dd-dmr-request-view.png)

4. Click on the **Request** tab to view the entire request received by the Docker Model Runner, including the list of messages that are forwarded to the model.

    ![Screenshot of the request details for a Docker Model Runner request](.labspace/images/dd-dmr-request-details.png)

And with that, you've learned a little bit about models, how they work, and how to use the Docker Model Runner in a simple application.

Now, it's time to dive into tools!
