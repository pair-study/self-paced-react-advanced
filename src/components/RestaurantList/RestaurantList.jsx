import { CATEGORY_IMAGES } from "../../constants/categoryImages";
import styled from "styled-components";
import { textSubtitle, textBody } from "../../styles/typography";
import { ALL_CATEGORY } from "../../constants/categories";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "../../api";

export default function RestaurantList({
  selectedCategory,
  onRestaurantClick,
}) {
  const {
    data: newRestaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
    // queryFn: () => getRestaurants(인자가 있을 경우)
  });

  const filteredRestaurants =
    selectedCategory === ALL_CATEGORY
      ? (newRestaurants ?? [])
      : (newRestaurants ?? []).filter((r) => r.category === selectedCategory);

  return (
    <ListContainer>
      {isLoading && <p>로딩중입니다.</p>}
      {error && <p>{error}</p>}
      <RestaurantUl>
        {filteredRestaurants.map((restaurant) => (
          <Restaurant key={restaurant.id}>
            <RestaurantButton onClick={() => onRestaurantClick(restaurant)}>
              <RestaurantCategory>
                <CategoryIcon
                  src={CATEGORY_IMAGES[restaurant.category]}
                  alt={restaurant.category}
                />
              </RestaurantCategory>
              <RestaurantInfo>
                <RestaurantName>{restaurant.name}</RestaurantName>
                <RestaurantDescription>
                  {restaurant.description}
                </RestaurantDescription>
              </RestaurantInfo>
            </RestaurantButton>
          </Restaurant>
        ))}
      </RestaurantUl>
    </ListContainer>
  );
}

const ListContainer = styled.section`
  display: flex;
  flex-direction: column;

  padding: 0 16px;
  margin: 16px 0;
`;

const RestaurantUl = styled.ul``;

const Restaurant = styled.li`
  padding: 16px 8px;
  border-bottom: 1px solid var(--grey-150);
`;

const RestaurantButton = styled.button`
  display: flex;
  align-items: flex-start;
  width: 100%;

  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font: inherit;
`;

const RestaurantCategory = styled.div`
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
`;

const CategoryIcon = styled.img`
  width: 36px;
  height: 36px;
`;

const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const RestaurantName = styled.h3`
  margin: 0;
  ${textSubtitle}
`;

const RestaurantDescription = styled.p`
  display: -webkit-box;
  padding-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  ${textBody}
`;
