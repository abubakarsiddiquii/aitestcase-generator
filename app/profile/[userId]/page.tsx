import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { UserProfile } from "@/components/user-profile"
import { UserPosts } from "@/components/user-posts"

interface ProfilePageProps {
  params: {
    userId: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <UserProfile userId={params.userId} />
          </div>
          <div className="md:col-span-2">
            <UserPosts userId={params.userId} />
          </div>
        </div>
      </div>
    </div>
  )
}
