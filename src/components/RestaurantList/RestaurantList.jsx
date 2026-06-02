import styles from "./RestaurantList.module.css";
import koreanImg from "../../assets/category-korean.png";
import chineseImg from "../../assets/category-chinese.png";
import japaneseImg from "../../assets/category-japanese.png";
import westernImg from "../../assets/category-western.png";
import asianImg from "../../assets/category-asian.png";
import etcImg from "../../assets/category-etc.png";

const CATEGORY_IMAGES = {
  한식: koreanImg,
  중식: chineseImg,
  일식: japaneseImg,
  양식: westernImg,
  아시안: asianImg,
  기타: etcImg,
};

export default function RestaurantList({ restaurants }) {
  return (
    <section className={styles.restaurantList}>
      <ul>
        {restaurants.map((restaurant) => {
          return (
            <li key={restaurant.id} className={styles.restaurant}>
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
