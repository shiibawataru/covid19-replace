import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePapaParse, useCSVReader } from "react-papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { format } from "date-fns";

///////////////
//CSS
//////////////
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const GraphStyle = styled.div`
  margin: 20px;
  width: 95%;
`;
const ToTopButton = styled.button`
  font-size: large;
  margin: 20px;
  width: 10vw;
  height: 5vh;
`;
///////////////
//ここまでCSS
//////////////

type CsvData1Type = {
  Date: string;
  ALLRequiringinpatientcare: number;
};
type CsvData2Type = {
  開始日: string;
  終了日: string;
  救急搬送困難事案数: string;
};
type CsvData3Type = {
  Date: string;
  ALLRequiringinpatientcare?: string;
  救急搬送困難事案数?: string;
};
///////////////
//折れ線グラフ用
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = () => {
  const [csvData1, setCsvData1] = useState<Array<CsvData1Type>>([]);
  const [csvData2, setCsvData2] = useState<Array<CsvData2Type>>([]);
  //グラフ作成用配列
  const [csvData3, setCsvData3] = useState<Array<CsvData3Type>>([]);

  //折れ線グラフ用
  const labels = csvData1.map((x) => format(new Date(x.Date), "yyyy-MM-dd"));
  const labels1 = csvData2.map((x) => x.終了日);

  const options = {
    responsive: true,
    // interaction: {
    //   mode: "index" as const,
    //   intersect: false,
    // },
    stacked: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "COVID-19 日本の新型コロナウイルス概況",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "救急搬送困難事案数",
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
      x: {
        labels: labels,
      },
      x1: {
        labels: labels1,
        display: false,
      },
    },
  };

  //Topへ戻るボタン
  const toTop = () => {
    navigate("/");
    window.location.reload();
  };

  const data: any = {
    // labels,
    datasets: [
      {
        fill: false,
        label: "入院治療を要する者",
        data: csvData1.map((data) => data.ALLRequiringinpatientcare),
        borderColor: "rgb(80,80,205)",
        backgroundColor: "rgba(80, 80, 205, 0.5)",
        yAxisID: "y1",
        xAxisID: "x",
      },
      {
        label: "入院治療を要する者",
        data: csvData2.map((data) => data.救急搬送困難事案数),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
        xAxisID: "x1",
      },
    ],
  };
  /////////////
  //入院治療を要する者
  const inpatientTreatmentUrl =
    "https://www.stopcovid19.jp/data/mhlw_go_jp/opendata/requiring_inpatient_care_etc_daily.csv";
  //救急搬送困難事案数
  const emergencyTransportationDifficultiesUrl =
    "https://code4fukui.github.io/fdma_go_jp/emergencytransport_difficult_all.csv";
  //
  const { readRemoteFile } = usePapaParse();
  const { CSVReader } = useCSVReader();

  useEffect(() => {
    //入院治療を要する者
    readRemoteFile(inpatientTreatmentUrl, {
      complete: (results: any) => {
        setCsvData1(results.data);
        //新しいグラフ用配列の作成
        results.data.map((item: any) => {
          setCsvData3((csvData3) => [
            ...csvData3,
            {
              Date: item.Date,
              ALLRequiringinpatientcare: item.ALLRequiringinpatientcare,
            },
          ]);
        });
      },
      header: true,
      download: true,
      delimiter: ",",
      //数字の数値か
      dynamicTyping: true,
      //空白と括弧の削除
      transformHeader: function (h) {
        return h.replace(/\s|\(|\)/g, "");
      },
      skipEmptyLines: true,
    });
    //救急搬送困難事案数
    readRemoteFile(emergencyTransportationDifficultiesUrl, {
      complete: (results: any) => {
        setCsvData2(results.data);
      },
      header: true,
      download: true,
      delimiter: ",",
      //数字の数値か
      dynamicTyping: true,
      //空白と括弧の削除
      transformHeader: function (h) {
        return h.replace(/\s|\(|\)/g, "");
      },
      skipEmptyLines: true,
    });
  }, []);

  const navigate = useNavigate();
  return (
    <Wrapper>
      <GraphStyle>
        <Line options={options} data={data} />
      </GraphStyle>

      <ToTopButton type="button" onClick={() => toTop()}>
        Topへ
      </ToTopButton>
    </Wrapper>
  );
};

export default Graph;
