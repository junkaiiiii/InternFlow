'use client'
import { type ChangeEvent, useState } from "react";
import { api } from "@/libs/api"
import { useRouter } from "next/navigation";
import { AuthValidator } from "@/libs/validators/index";

const features = ["Track every application", "Stay ahead of deadlines", "See your internship pipeline"];

type SignUpFormData = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignUp() {
    const [formData, setFormData] = useState<SignUpFormData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    const handleChange = (field: keyof SignUpFormData) => {
        return (event: ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({ ...prev, [field]: event.target.value }));
        };
    };

    const handleSignUp = async () => {
        // TODO: actual data in backend and use helpers function to call backend //done
        // TODO: validate email and passwords and username (username check in backend) //done

        try {
            const error = AuthValidator.signup(formData)
            if (error) {
                setError(error)
            }
            console.log({
                username: formData.username,
                password: formData.password,
                email: formData.email
            })

            // actual signup logic
            const data = await api.post('/user/signup',
                {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email
                }
            )


            if (data.success) {
                localStorage.setItem("intern-flow-token", data.data.token)
                router.push('/analytics')
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred.");
            }
        }

    }

    return (
        <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 flex items-center justify-center">
            <div className="grid w-[80%] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/30 lg:grid-cols-[1fr_480px]">
                <div className="flex flex-col justify-evenly bg-zinc-900 p-8 sm:p-10 lg:p-12">
                    <div>
                        <p className="text-sm font-semibold text-primary">InternFlow</p>
                        <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                            Build a calmer internship search.
                        </h1>
                        <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
                            Create your workspace for saved roles, application progress, interview notes,
                            and follow-up dates in one focused place.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                        {features.map((feature) => (
                            <div
                                className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/[0.03] px-4 py-3 text-sm text-white/75"
                                key={feature}
                            >
                                <span className="h-2.5 w-2.5 rounded-full bg-primary " />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/95 p-6 sm:p-10">
                    <div className="mx-auto flex w-full max-w-sm flex-col justify-center">
                        <div>
                            <h2 className="text-2xl font-semibold text-black">Create account</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Start organizing your internship applications today.
                            </p>
                        </div>


                        <div className="mt-8 space-y-2">
                            <label className="block">
                                <span className="text-sm font-medium text-black">Username </span>
                                <input
                                    className="h-12 w-full rounded-lg border border-input bg-white px-4 text-sm text-gray-500 outline-none transition placeholder:text-gray-500 focus:border-primary "
                                    name="username"
                                    onChange={handleChange("username")}
                                    placeholder="Enter username"
                                    type="text"
                                    value={formData.username}
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-black">Email</span>
                                <input
                                    className="h-12 w-full rounded-lg border border-input bg-white px-4 text-sm text-gray-500 outline-none transition placeholder:text-gray-500 focus:border-primary "
                                    name="email"
                                    onChange={handleChange("email")}
                                    placeholder="you@example.com"
                                    type="email"
                                    value={formData.email}
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-black">Password</span>
                                <input
                                    className="h-12 w-full rounded-lg border border-input bg-white px-4 text-sm text-gray-500 outline-none transition placeholder:text-gray-500 focus:border-primary "
                                    name="password"
                                    onChange={handleChange("password")}
                                    placeholder="Create a strong password"
                                    type="password"
                                    value={formData.password}
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-black">Confirm Password</span>
                                <input
                                    className="h-12 w-full rounded-lg border border-input bg-white px-4 text-sm text-gray-500 outline-none transition placeholder:text-gray-500 focus:border-primary "
                                    name="confirmPassword"
                                    onChange={handleChange("confirmPassword")}
                                    placeholder="Retype the password"
                                    type="password"
                                    value={formData.confirmPassword}
                                />
                            </label>

                            {error && (
                                <p className="text-red-500 mt-5">{error}</p>
                            )
                            }
                            <button
                                className={` ${error ? 'mt-3' : 'mt-10'} h-12 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-black shadow-lg shadow-primary/20 transition hover:bg-emerald-500 cursor-pointer`}
                                onClick={handleSignUp}
                            >
                                Sign up
                            </button>
                        </div>

                        <p className="mt-6 text-center text-sm text-[#64716d]">
                            Already have an account?{" "}
                            <a className="font-semibold text-[#0c7f5e] hover:text-[#075a43]" href="/login">
                                Log in
                            </a>
                        </p>

                    </div>
                </div>
            </div>
        </main>
    );
}
