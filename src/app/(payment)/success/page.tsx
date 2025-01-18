import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const requestId = params.request_id as string;
  const checkoutId = params.checkout_id as string;
  const customerId = params.customer_id as string;
  const orderId = params.order_id as string;
  const productId = params.product_id as string;
  const signature = params.signature as string;

  if (requestId === "PAID") {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          paid: true,
          customer_id: customerId,
          plan_id: productId,
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
