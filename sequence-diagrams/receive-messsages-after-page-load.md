sequenceDiagram
    Actor User
    User->>MitraChatGPT: access '/mitra-chat-gpt'
    MitraChatGPT-->>User: show MitraChatGPT page
    MitraChatGPT->>Vuex: check getter `getSessionKey`
    Vuex-->>MitraChatGPT: returns `sessionKey`
    opt sessionKey exists
        loop every five seconds
            MitraChatGPT->>Vuex: dispatch action `receiveMessages`
            alt success
                Vuex-->>MitraChatGPT: return `messages`
                MitraChatGPT-->>User: show messages
            else failed
                Vuex-->>MitraChatGPT: return `error`
                MitraChatGPT-->>User: show error snackbar
            end            
        end
    end
