import React, { FunctionComponent } from "react"
import { useForm } from "react-hook-form"
import useSWR from "swr"
import { hash, secretbox } from "tweetnacl"

export type SecretState = { oscar: string; cais: string }

const SecretContext = React.createContext<SecretState>({
  oscar: "",
  cais: "",
})

const deriveKey = (password: string) => {
  let key: Uint8Array = Buffer.from(password, "utf-8")
  for (let i = 0; i < 1e5; i++) key = hash(key)
  return key.subarray(0, 32)
}

const openSecretBox = (key: Uint8Array, box: string, nonce: string) => {
  const plain = secretbox.open(
    Buffer.from(box, "base64"),
    Buffer.from(nonce, "base64"),
    key
  )
  if (!plain) throw new Error("Incorrect password")
  return Buffer.prototype.toString.call(plain, "utf-8")
}

const getSecrets = async (password: string) => {
  const key = deriveKey(password)
  const state: SecretState = {
    oscar: openSecretBox(
      key,
      process.env.NEXT_PUBLIC_REMOTE_DB_URL_OSCAR!,
      process.env.NEXT_PUBLIC_REMOTE_DB_URL_OSCAR_NONCE!
    ),
    cais: openSecretBox(
      key,
      process.env.NEXT_PUBLIC_REMOTE_DB_URL_CAIS!,
      process.env.NEXT_PUBLIC_REMOTE_DB_URL_CAIS_NONCE!
    ),
  }
  return state
}

export const SecretProvider: FunctionComponent = ({ children }) => {
  const [password, setPassword] = React.useState<string | null>(null)

  React.useEffect(() => {
    setPassword(localStorage.getItem("password") || null)
  }, [])
  React.useEffect(() => {
    if (password) localStorage.setItem("password", password)
  }, [password])

  const { data, isValidating, error } = useSWR(password || null, getSecrets)

  const { register, handleSubmit } = useForm()

  if (data) {
    return (
      <SecretContext.Provider value={data}>{children}</SecretContext.Provider>
    )
  } else {
    return (
      <div>
        <style jsx>{`
          div {
            width: 100vw;
            min-height: 100vh;
            padding: 2em;
            text-align: center;
            display: flex;
            flex-flow: column nowrap;
          }
        `}</style>
        <form onSubmit={handleSubmit((data) => setPassword(data.password))}>
          <input
            type="text"
            placeholder="Password"
            name="password"
            ref={register()}
          />
          <input type="submit" />
        </form>

        {isValidating ? <p>Validating...</p> : null}

        {error
          ? (console.error(error),
            (
              <>
                <p>Error</p>
                <pre>{"" + error}</pre>
              </>
            ))
          : null}
      </div>
    )
  }
}

export const useSecrets = () => React.useContext(SecretContext)
