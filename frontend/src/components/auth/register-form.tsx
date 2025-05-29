"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { REGISTER_URL } from "@/lib/constants"
import { signIn } from "next-auth/react"

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const errors: { [key: string]: string } = {}

    // Validate fields before sending the request
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match."
    }
    if (!email) {
      errors.email = "Email is required."
    }
    if (!password) {
      errors.password = "Password is required."
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirm_password: confirmPassword, role: 'customer' }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data?.success && data?.user?.token) {
            await signIn("credentials", {
                email: email,
                password: password,
                redirect: true,
                callbackUrl: "/",
            });
        } else {
            setErrorMessage(data?.message || "Registration failed");
        }

      } else {
        setErrorMessage(data.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later. " + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register now</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email and password to create your account
        </p>
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="confirm_password">Confirm Password</Label>
          </div>
          <Input
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-sm">{fieldErrors.confirmPassword}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Your account already exist?{" "}
        <a href="/login" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </form>
  )
}
