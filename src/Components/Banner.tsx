import styled from "styled-components";
import { makeImagePath } from "../Routes/utilities";
import { useState } from "react";
import { IGetMoviesResult } from "../api";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isLeaving, setIndex } from "../atoms";
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
`;

const Title = styled.h2`
  font-size: 58px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;

const offset = 6;

export default function BigBanner({
  bannerData,
}: {
  bannerData?: IGetMoviesResult;
}) {
  const [leaving, setLeaving] = useRecoilState(isLeaving);
  const setMovieIndex = useSetRecoilState(setIndex);

  const increaseIndex = () => {
    if (bannerData) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = bannerData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMovieIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  return (
    <Banner
      onClick={() => increaseIndex()}
      bgphoto={makeImagePath(bannerData?.results[0].backdrop_path || "")}
    >
      <Title>{bannerData?.results[0].title}</Title>
      <Overview>{bannerData?.results[0].overview}</Overview>
    </Banner>
  );
}
