"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginFlow, logoutFlow } from "@/interfaces/flow/login";
import {
  FIND,
  FUNGIBLE_TOKEN,
  METADATA_VIEWS,
  NON_FUNGIBLE_TOKEN,
} from "@/lib/address-book";
import { config, currentUser } from "@onflow/fcl";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

type NetworkKey = "mainnet" | "testnet";
/*--------------------------------------------------------------------------------------------------------------------*/
function initFCL(network: string) {
  const key = network as NetworkKey;

  config({
    "accessNode.api": `https://rest-${network}.onflow.org`,
    "0xFIND": FIND[key],
    "0xNonFungibleToken": NON_FUNGIBLE_TOKEN[key],
    "0xFungibleToken": FUNGIBLE_TOKEN[key],
    "0xMetadataViews": METADATA_VIEWS[key],
  });
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function QueryProvider(props: { children: React.ReactNode }) {
  const { children } = props;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchInterval: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error: any) => {
            if (error?.response?.status === 401) {
              // Refresh the page if the token expires
              location.reload();
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const LoginContext = createContext<{
  user: any;
  isLoadingUser: boolean;
  loginUser: () => void;
  logoutUser: () => void;
} | null>(null);

export function FCLProvider(props: { children: ReactNode }) {
  const { network } = useParams();
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };

  const { children } = props;
  const [user, setUser] = useState({});
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  function loginUser() {
    setIsLoadingUser(true);
    loginFlow(network as NetworkKey, (res) => {
      setUser({
        address: res.addr,
      });
      setIsLoadingUser(false);
    });
  }

  function logoutUser() {
    logoutFlow();
    setUser({});
    setIsLoadingUser(false);
    navigate("/");
  }

  useEffect(() => {
    if (network) {
      initFCL(network as string);
    }
  }, [network]);

  useEffect(() => {
    currentUser.subscribe((user: any) => {
      const walletNetwork = user.services.find((el: any) => el.network).network;
      if (walletNetwork !== network) {
        logoutFlow();
        return;
      }
      if (user.addr) {
        setUser({
          address: user.addr,
          loggedIn: user.loggedIn,
        });
      }
    });
  }, []);

  return (
    <LoginContext.Provider
      value={{ user, isLoadingUser, loginUser, logoutUser }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context)
    throw new Error("useLoginContext must be used within a FCLProvider");
  return context;
};
