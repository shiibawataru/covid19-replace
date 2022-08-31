import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

type State = {
  state: {
    name: string;
    name_jp: string;
    ncurrentpatients: number;
    ndeaths: number;
    nexits: number;
    nheavycurrentpatients: number;
    ninspections: number;
    npatients: number;
    nunknowns: number;
  };
};

///////////////////////
//CSS
///////////////////////
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailTitle = styled.div`
  font-size: 3vw;
`;
const DetailContents = styled.div`
  font-size: 2vw;
`;

const PieChartStyle = styled.div`
  /* height: 100px; */
  width: 30%;
  margin: 20px;
`;

const ToTopButton = styled.button`
  font-size: large;
  margin: 20px;
  width: 10vw;
  height: 5vh;
`;
///////////////////////
//ここまでCSS
///////////////////////

const WholeCountryDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location.state as State;
  const { beds } = location.state as any;

  //Topへ戻る
  const toTop = () => {
    navigate("/");
    window.location.reload();
  };

  //円グラフ
  const data = {
    labels: [
      `現在患者数(${state.ncurrentpatients})`,
      `想定病床残数(${beds - state.ncurrentpatients})`,
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [
          `${state.ncurrentpatients}`,
          `${
            beds - state.ncurrentpatients >= 0
              ? beds - state.ncurrentpatients
              : 0
          } `,
        ],
        backgroundColor: ["rgba(230, 0, 0, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(230, 0, 0, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    console.log(state);
    console.log(beds);
  });

  return (
    <Wrapper>
      <DetailTitle>
        全国 現在患者数/想定病床残数　
        {Math.floor((state.ncurrentpatients / beds) * 100)}％
      </DetailTitle>
      <PieChartStyle>
        <Pie data={data} />
      </PieChartStyle>
      <DetailContents>
        累積患者数：{state.npatients.toLocaleString()}人　累積退院者数：
        {state.nexits.toLocaleString()}人
      </DetailContents>
      <DetailContents>
        累積死者：{state.ndeaths.toLocaleString()}人　対策病床数：
        {Number(beds).toLocaleString()}床
      </DetailContents>
      <ToTopButton type="button" onClick={() => toTop()}>
        Topへ
      </ToTopButton>
    </Wrapper>
  );
};

export default WholeCountryDetail;
