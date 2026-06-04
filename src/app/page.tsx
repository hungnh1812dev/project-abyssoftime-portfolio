import { redirect } from "next/navigation";
import { defaultLocale } from "@/utils/Constants";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
