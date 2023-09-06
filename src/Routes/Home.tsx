import styled from "styled-components";
import { useQuery } from "react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { IGetMoviesResult, getMovies } from "../api";
import { makeImagePath } from "./utilities";
import { useState } from "react";
import { useMatch, PathMatch, useNavigate } from "react-router-dom";
import BigBanner from "../Components/Banner";
import { useRecoilState, atom } from "recoil";
import { setIndex } from "../atoms";
import BigSlider from "../Components/Slider";

const Wrapper = styled.div`
  height: 200vh;
`;

const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.img`
  width: 100%;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
`;

function Home() {
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:id");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const navigate = useNavigate();
  const onOverlayClick = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.id &&
    data?.results.find((movie) => movie.id + "" === bigMovieMatch.params.id);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>loading..</Loader>
      ) : (
        <>
          <BigBanner bannerData={data} />
          <BigSlider Sliderdata={data} />
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{
                    top: scrollY.get() + 100,
                  }}
                  layoutId={bigMovieMatch.params.id}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        src={makeImagePath(clickedMovie.backdrop_path)}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
