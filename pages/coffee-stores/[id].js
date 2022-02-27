import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import clsx from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";

import coffeeStoresData from "../../data/coffee-stores.json";

export async function getStaticProps({ params }) {
  const coffeesStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStore: coffeesStores.find((store) => `${store.id}` === params.id),
    },
  };
}

export function getStaticPaths() {
  const paths = coffeeStoresData.map((store) => {
    return {
      params: {
        id: `${store.id}`,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  const handleUpvote = () => {
    console.log("handleUpvote");
  };

  console.log(props.coffeeStore, "**&^%%");

  const {
    location: { address, neighborhood },
    name,
    imgUrl,
  } = props.coffeeStore;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a> &#8592; Back To Home!</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            alt={name}
            className={styles.storeImg}
          />
        </div>
        <div className={clsx("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              width={24}
              height={24}
              alt="icon"
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width={24}
                height={24}
                alt="icon"
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/stars.svg"
              width={24}
              height={24}
              alt="icon"
            />
            <p className={styles.text}>{22}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvote}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
