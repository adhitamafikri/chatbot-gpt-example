sequenceDiagram
    Actor User
    User->>MitraChatGPT: types any message in the TypingArea
    User->>MitraChatGPT: sends the message
    MitraChatGPT-->>User: clear the TypingArea
    MitraChatGPT->>Vuex: dispatch `sendMessage` action
    alt sendMessage success
        Vuex->>Vuex: append the `message` payload into the `messages` state
        Vuex-->>MitraChatGPT: returns the `messages`
        MitraChatGPT--)User: show the `messages`
        loop every five seconds
            MitraChatGPT->>Vuex: dispatch `receiveMessages` action
            alt `receiveMessages` success
                Vuex-->>MitraChatGPT: return `messages`
                MitraChatGPT-->>User: show messages
            else `receiveMessages` error
                Vuex-->>MitraChatGPT: return `error`
                MitraChatGPT-->>User: show error snackbar
            end
        end
    else sendMessage failed
        Vuex-->>MitraChatGPT: returns the `error`
        MitraChatGPT--)User: show error snackbar
    end
