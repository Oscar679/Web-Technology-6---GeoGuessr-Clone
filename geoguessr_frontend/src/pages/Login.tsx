import api from "../api";
import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

const Login = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";

    }, []);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());

        try {
            const response = await api.post("/api/login", values);

            localStorage.setItem("token", response.data.token);

            window.dispatchEvent(new Event("auth-changed"));
            console.log("SUCCESS:", response.data);

            document.body.style.overflow = "visible";
            navigate("/");
        } catch (err: any) {
            console.error(err);
            setError("Log in attempt failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-900 min-h-screen text-white">
            <div className="px-6 py-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/Login">Log In</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex items-center justify-center min-h-[calc(100vh-220px)]">
                <div className="flex flex-col items-center gap-6">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md space-y-4 bg-zinc-800 p-6 rounded-lg"
                    >
                        <h1 className="text-2xl font-semibold text-center">Log In</h1>
                        <input
                            name="name"
                            placeholder="Username"
                            required
                            className="w-full px-3 py-2 rounded bg-zinc-700 text-white"
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full px-3 py-2 rounded bg-zinc-700 text-white"
                        />

                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded font-medium"
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </form>
                    <a
                        href="/SignUp"
                        className="text-sm text-zinc-400 hover:text-indigo-500 hover:underline"
                    >
                        Not a member? - Sign up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
