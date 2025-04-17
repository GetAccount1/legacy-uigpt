import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to login page if not authenticated, otherwise to chat
  return redirect("/login")
}
