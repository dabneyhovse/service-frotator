import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import socket from "./socket";

import {
  FrotatorHome,
  FroshListMain,
  Flashcards,
  Quiz,
  SingleFrosh,
  Leaderboard,
  Spam,
} from "./components";
import { fetchFrosh } from "./store/frosh";
import { frotatorAddSpam } from "./store/spam";

export default function FrotatorMain() {
  const dispatch = useDispatch();

  const { search, page } = useSelector((state) => ({
    search: state.frotator.frosh.search,

    page: state.frotator.frosh.page,
  }));
  useEffect(() => {
    dispatch(fetchFrosh({ search, pageNum: page }));

    return () => {
      // unmount stuff
    };
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<FrotatorHome />} />
      <Route exact path="/frosh" element={<FroshListMain />} />
      <Route exact path="/frosh/:froshId" element={<SingleFrosh />} />
      <Route exact path="/flashcards" element={<Flashcards />} />
      <Route exact path="/spam" element={<Spam />} />
      <Route exact path="/quiz" element={<Quiz />} />
      <Route exact path="/quiz/leaderboard" element={<Leaderboard />} />
    </Routes>
  );
}
