import { RegisterForm } from "@/components/auth/register-form"
// import BackgroundImage from "@/public/bg-image.jpg"
import BackgroundImage from "../../../../public/bg-image.webp"
import Image from "next/image"
import Link from "next/link"

const {SITE_NAME} = process.env;
export default function Register() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="text-2xl font-bold text-blue-300">
            {SITE_NAME}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
          <Image src={BackgroundImage} alt="image"  layout="fill" objectFit="cover" />
      </div>
    </div>
  )
}
