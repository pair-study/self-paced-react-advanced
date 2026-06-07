import styles from "./RestaurantList.module.css";
import { categoryImages } from "../../constants/categoryImages";

export default function RestaurantList({ restaurants }) {
  const restaurantItem = restaurants.map((restaurant) => {
    return (
      <li className={styles.restaurant} key={restaurant.id}>
        <div className={styles.restaurant__category}>
          <img
            src={categoryImages[restaurant.category]}
            alt={restaurant.category}
            className={styles["restaurant__category-icon"]}
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
    <section className={styles["restaurant-list__container"]}>
      <ul className={styles["restaurant-list"]}>{restaurantItem}</ul>
    </section>
  );
}
