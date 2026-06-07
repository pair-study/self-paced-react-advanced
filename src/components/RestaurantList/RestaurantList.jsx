import styles from "./RestaurantList.module.css";

const categoryImages = {
  한식: "../templates/category-korean.png",
  중식: "../templates/category-chinese.png",
  일식: "../templates/category-japanese.png",
  양식: "../templates/category-western.png",
  아시안: "../templates/category-asian.png",
  기타: "../templates/category-etc.png",
};

export default function RestaurantList({ restaurants }) {
  const restaurantItem = restaurants.map((restaurant) => {
    return (
      <li className={styles.restaurant} key={restaurant.id}>
        <div className={styles.restaurant__category}>
          <img
            src={categoryImages[restaurant.category]}
            alt={restaurant.category}
            className={styles["category-icon"]}
          />
        </div>
        <div className={styles.restaurant__info}>
          <h3 className={`${styles.restaurant__name} text-subtitle`}>
            {restaurant.name}
          </h3>
          <p className={`${styles.restaurant__description} text-body`}>
            {restaurant.description}
          </p>
        </div>
      </li>
    );
  });

  return (
    <section className={styles["restaurant-list-container"]}>
      <ul className={styles["restaurant-list"]}>{restaurantItem}</ul>
    </section>
  );
}
