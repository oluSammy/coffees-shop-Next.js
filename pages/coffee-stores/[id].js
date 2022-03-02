import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import clsx from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "../../context/store-context";
import { isEmpty } from "../../utils/utils";
import coffeeStoresData from "../../data/coffee-stores.json";
import useSWR from "swr";

export async function getStaticProps({ params }) {
  const coffeesStores = await fetchCoffeeStores();
  const store = coffeesStores.find((store) => `${store.id}` === params.id);
  return {
    props: {
      coffeeStore: store ? store : {},
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

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;

  const {
    dispatch,
    state: { coffeeStores },
  } = useContext(StoreContext);
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [votingCount, setVotingCount] = useState(0);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  const handleUpvote = async () => {
    try {
      const res = await fetch("/api/faveCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      setVotingCount(votingCount + 1);

      const dnCoffee = await res.json();
      console.log(dnCoffee, "COUNT");

      if (dnCoffee && dnCoffee.length) {
        setVotingCount(votingCount + 1);
      }
    } catch (e) {
      console.error("Error upvoting coffee store", e);
    }
  };

  useEffect(() => {
    if (data) {
      // console.log("data from swr", data.findCoffeeStoreRecord[0]);
      setVotingCount(data.findCoffeeStoreRecord[0].voting);
      setCoffeeStore(data.findCoffeeStoreRecord[0]);
    }
  }, [data]);

  const handleCreateCoffeeStore = async (store) => {
    try {
      const { id, name, imgUrl, neighbourhood, voting, address } = store;

      const res = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: `${id}`,
          name,
          imgUrl,
          neighbourhood: "",
          voting: voting | 0,
          address: "",
        }),
      });

      const dnCoffee = await res.json();
      // console.log(dnCoffee);
    } catch (e) {
      console.error("Error creating coffee store", e);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeById = coffeeStores.find(
          (store) => `${store.id}` === id
        );

        if (findCoffeeById) {
          setCoffeeStore(findCoffeeById);
          handleCreateCoffeeStore(findCoffeeById);
        }
      }
    } else {
      // ssg
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [coffeeStores, id, initialProps.coffeeStore]);

  if (error) {
    return <div>something went wrong retrieving the coffee store</div>;
  }

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore ? coffeeStore.name : ""}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a> &#8592; Back To Home!</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>
              {coffeeStore ? coffeeStore.name : ""}
            </h1>
          </div>
          <Image
            src={
              coffeeStore && coffeeStore.imgUrl
                ? coffeeStore.imgUrl
                : "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            alt={coffeeStore ? coffeeStore.name : "alt"}
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
            <p className={styles.text}>
              {coffeeStore.location ? coffeeStore.location.address : ""}
            </p>
          </div>
          {coffeeStore.location && coffeeStore.location.neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width={24}
                height={24}
                alt="icon"
              />
              <p className={styles.text}>
                {coffeeStore.location ? coffeeStore.location.neighborhood : ""}
              </p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/stars.svg"
              width={24}
              height={24}
              alt="icon"
            />
            <p className={styles.text}>{votingCount}</p>
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
