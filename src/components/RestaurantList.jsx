import { CATEGORY_IMAGES } from "../constants/categoryImages.js";
import styled from "styled-components";

const List = styled.ul`
  padding: 0 16px;
  margin: 16px 0;
`;

const Restaurant = styled.li`
  border-bottom: 1px solid var(--grey-150);
`;

const Button = styled.button`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 16px 8px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
`;

const Category = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  min-width: 64px;
  min-height: 64px;
  margin-right: 16px;
  border-radius: 50%;
  background: var(--lighten-color);

  img {
    width: 36px;
    height: 36px;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const RestaurantName = styled.h3`
  margin: 0;
  font-size: 18px;
  line-height: 28px;
  font-weight: 600;
`;

const RestaurantDescription = styled.p`
  display: -webkit-box;
  padding-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
`;

export default function RestaurantList({ restaurants, onRestaurantClick }) {
  return (
    <List>
      {restaurants.map((restaurant) => {
        return (
          <Restaurant key={restaurant.id}>
            <Button onClick={() => onRestaurantClick(restaurant)}>
              <Category>
                <img
                  src={CATEGORY_IMAGES[restaurant.category]}
                  alt={restaurant.category}
                />
              </Category>
              <Info>
                <RestaurantName>{restaurant.name}</RestaurantName>
                <RestaurantDescription>{restaurant.description}</RestaurantDescription>
              </Info>
            </Button>
          </Restaurant>
        );
      })}
    </List>
  );
}
