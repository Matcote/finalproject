import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

const Timer = () => {
  const history = useHistory();
  const user = useSelector((state) => state.user.user);
  React.useEffect(() => {
    if (user === null) {
      history.push("/login");
    }
  });
  return (
    <Wrapper>
      Timer
      <Navbar />
    </Wrapper>
  );
};
const Wrapper = styled.div``;

export default Timer;