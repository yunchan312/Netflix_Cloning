import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLeaving, setIndex } from "../atoms";
import { IGetMoviesResult } from "../api";
import { makeImagePath } from "../Routes/utilities";
import { useNavigate } from "react-router-dom";

const offset = 6;

const Slider = styled.div`
  position: relative;
  width: 100%;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  overflow-x: hidden;
  padding-top: 100px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 150px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 8px;
  }
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: { x: 0 },
  exit: { x: -window.outerWidth },
};

export default function BigSlider({
  Sliderdata,
}: {
  Sliderdata?: IGetMoviesResult;
}) {
  const theMovieIndex = useRecoilValue(setIndex);
  const navigate = useNavigate();
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const [leaving, setLeaving] = useRecoilState(isLeaving);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  return (
    <Slider>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          key={theMovieIndex}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          variants={rowVariants}
        >
          {Sliderdata?.results
            .slice(1)
            .slice(offset * theMovieIndex, offset * theMovieIndex + offset)
            .map((movie) => (
              <Box
                onClick={() => onBoxClicked(movie.id)}
                layoutId={movie.id + ""}
                transition={{ type: "tween" }}
                variants={boxVariants}
                whileHover="hover"
                initial="normal"
                key={movie.id}
                bgphoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </Slider>
  );
}
