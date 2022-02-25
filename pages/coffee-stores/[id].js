import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const CoffeeStore = () => {
  const router = useRouter();

  return (
    <div>
      CoffeeStore page {router.query.id}
      <Link href="/">
        <a>Back To Home!</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;
