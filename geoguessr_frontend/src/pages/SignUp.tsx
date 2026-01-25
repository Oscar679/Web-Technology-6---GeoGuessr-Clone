import axios from "axios";
import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../components/ui/breadcrumb";

const SignUp = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";

    }, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post(
                "http://127.0.0.1/oe222ia/geoguessr_backend/api/register",
                values
            );

            console.log("SUCCESS:", response.data);
        } catch (err: any) {
            console.error(err);
            setError("Sign up attempt failed.");
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
                            <BreadcrumbLink href="/Login">Sign up</BreadcrumbLink>
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
                        <h1 className="text-2xl font-semibold text-center">Sign up</h1>
                        <input
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            required
                            className="w-full px-3 py-2 rounded bg-zinc-700 text-white"
                        />
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
                            {loading ? "Signing up..." : "Sign up"}
                        </button>
                    </form>

                    <a
                        href="/Login"
                        className="text-sm text-zinc-400 hover:text-indigo-500 hover:underline"
                    >
                        Already a member? – Log in
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
