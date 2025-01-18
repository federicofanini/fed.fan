import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";

interface SearchParams {
  request_id?: string;
  checkout_id?: string;
  customer_id?: string;
  order_id?: string;
  product_id?: string;
  signature?: string;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id) {
    redirect("/login");
  }

  const { request_id, customer_id, product_id } = await searchParams;

  if (request_id === "PAID") {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          paid: true,
          customer_id,
          plan_id: product_id,
        },
      });
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user access:", error);
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">An error occurred</h1>
          <p className="text-lg">
            We couldn&apos;t process your payment. Please try again later.
          </p>
        </div>
      );
    }
  }

  return redirect("/blackboard/website");
}
