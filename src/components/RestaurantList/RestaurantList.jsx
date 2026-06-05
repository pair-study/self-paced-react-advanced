import styles from "./RestaurantList.module.css";
import { CATEGORY_IMAGES } from "../../constants/categoryImages.js";

export default function RestaurantList({ restaurants, onSelect }) {
  return (
    <section className={styles.restaurantList}>
      <ul>
        {restaurants.map((restaurant) => {
          return (
            <li
              key={restaurant.id}
              className={styles.restaurant}
              onClick={onSelect}
            >
              <div className={styles.restaurant__category}>
                <img
                  src={CATEGORY_IMAGES[restaurant.category]}
                  alt={restaurant.category}
                  className={styles.restaurant__categoryIcon}
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
        })}
      </ul>
    </section>
  );
}
