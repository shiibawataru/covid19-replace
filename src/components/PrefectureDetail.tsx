import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import styled from "styled-components";
import { readRemoteFile } from "react-papaparse";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

///////////////////////
//type
///////////////////////
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

type CsvData1Type = {
  Date: string;
  ALLRequiringinpatientcare: number;
};

type PrefPatientsDataType = {
  srcurl_pdf: string;
  srcurl_web: string;
  description: string;
  lastUpdate: string;
  npatients: number;
  nexits: number;
  ndeaths: number;
  ncurrentpatients: number;
  ninspections: number;
  nheavycurrentpatients: number;
  nunknowns: number;
  area: [
    {
      name: string;
      name_jp: string;
      ncurrentpatients: number;
      ndeaths: number;
      nexits: number;
      nheavycurrentpatients: number;
      ninspections: number;
      npatients: number;
      nunknowns: number;
    }
  ];
};
///////////////////////
//ここまでtype
///////////////////////

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
const GraphStyle = styled.div`
  /* height: 100px; */
  margin: 20px;
  width: 95%;
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

//折れ線グラフ用
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
      title: {
        display: true,
        text: "累計死亡者数",
      },
    },
    y1: {
      type: "linear" as const,
      display: true,
      position: "right" as const,
      title: {
        display: true,
        text: "入院治療を要する者",
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

const PrefectureDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location.state as State;
  const { beds } = location.state as any;
  const { prefId } = location.state as any;

  const [graphData, setGraphData] = useState<Array<PrefPatientsDataType>>([]);

  const dataUrl = "https://www.stopcovid19.jp/data/covid19japan-all.json";

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

  //折れ線グラフ用
  const labels = graphData.map((x) => x.lastUpdate);

  const lineData = {
    labels,
    datasets: [
      {
        label: "入院治療を要する者",
        data: graphData.map((data) => data.area[prefId - 1].ncurrentpatients),
        borderColor: "rgb(80,80,205)",
        backgroundColor: "rgba(80, 80, 205, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "累計死者数",
        showLine: false,
        data: graphData.map((data) => data.area[prefId - 1].ndeaths),
        borderColor: "rgb(10, 10, 13)",
        backgroundColor: "rgba(10, 10, 13, 0.5)",
        yAxisID: "y",
      },
    ],
  };

  useEffect(() => {
    //都道府県ごと入院治療を要する者
    axios.get(dataUrl).then((res) => setGraphData(res.data));
  }, []);

  return (
    <Wrapper>
      <DetailTitle>
        {state.name_jp} 現在患者数/想定病床残数　
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
      <GraphStyle>
        <Line options={options} data={lineData} />
      </GraphStyle>
      <ToTopButton type="button" onClick={() => toTop()}>
        Topへ
      </ToTopButton>
    </Wrapper>
  );
};

export default PrefectureDetail;
