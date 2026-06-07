import styles from "./RestaurantList.module.css";
import { categoryImages } from "../../constants/categoryImages";

export default function RestaurantList({ restaurants }) {
  return (
    <section className={styles["restaurant-list__container"]}>
      <ul className={styles["restaurant-list"]}>
        {restaurants.map((restaurant) => (
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
        ))}
      </ul>
    </section>
  );
}
