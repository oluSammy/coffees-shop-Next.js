import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const RootDynamic = () => {
  const router = useRouter();
  const query = router.query;

  console.log(query.id);
  return (
    <div>
      <Head>
        <title>{query.id}</title>
      </Head>
      RootDynamic
    </div>
  );
};

export default RootDynamic;
