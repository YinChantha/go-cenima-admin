import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, LoginResponse, LoginPayload } from "./types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Retry failed requests once
    },
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Login function with formatted payload
  const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const actualCacheKey = ["login", payload.email ? "email" : "phoneNumber"];
    const loginEndpoint = payload.email ? `${URL}/auth/admin/login` : `${URL}/auth/branch/login`;
    setLoading(true);
    try {
      // Construct payload with default values for optional fields
      const formattedPayload = {
        hash: payload.hash || "string",
        password: payload.password,
        isRecover: payload.isRecover,
        ...(payload.email
          ? { email: payload.email }
          : { phoneNumber: payload.phoneNumber }),
      };
      const response = await queryClient.fetchQuery({
        queryKey: actualCacheKey,
        queryFn: async () => {
          const res = await fetch(loginEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedPayload),
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.message || "Invalid credentials");
          }
          return res.json();
        },
      });
      const { token } = response.token;
      localStorage.setItem("user", JSON.stringify(response));
      localStorage.setItem("token", response.token);
      setUser(token);
      router.push("/dashboard");
      return response;
    } catch (error) {
      throw new Error("Login failed: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    queryClient.clear(); // Clear query cache on logout
    router.push("/login");
  };

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("token");

    if (storedUser && storedAccessToken) {
      setUser(JSON.parse(storedUser) as User);
      setLoading(false);
    } else if (pathname !== "/login") {
      !storedUser && pathname !== "/login";
      router.push("/login");
    }

    setLoading(false);
  }, [pathname, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
      </AuthContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
